package com.bajrix.admin.product;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bajrix.admin.common.ApiException;

@Service
@Transactional
public class ProductService {

    public record PageResponse<T>(List<T> items, int page, int totalPages, long totalItems) {}
    public record Stats(long total, long active, long outOfStock, long categories) {}

    private static final Set<String> SORTABLE = Set.of("name", "price", "stock", "createdAt");

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public PageResponse<Product> search(String q, String category, Product.Status status,
                                        int page, int size, String sortBy, String dir) {
        String field = SORTABLE.contains(sortBy) ? sortBy : "createdAt";
        Sort sort = Sort.by("asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC, field);
        var result = repo.findAll(filter(q, category, status),
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), sort));
        return new PageResponse<>(result.getContent(), result.getNumber(), result.getTotalPages(), result.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Product get(Long id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Product " + id + " not found"));
    }

    public Product create(ProductRequest req) {
        assertUnique(req, null);
        Product p = new Product();
        apply(p, req);
        return repo.save(p);
    }

    public Product update(Long id, ProductRequest req) {
        Product p = get(id);
        assertUnique(req, id);
        apply(p, req);
        return repo.save(p);
    }

    public void delete(Long id) {
        repo.delete(get(id));
    }

    @Transactional(readOnly = true)
    public Stats stats() {
        return new Stats(repo.count(), repo.countByStatus(Product.Status.ACTIVE),
                repo.countByStock(0), repo.findCategories().size());
    }

    @Transactional(readOnly = true)
    public List<String> categories() { return repo.findCategories(); }

    private void assertUnique(ProductRequest req, Long selfId) {
        repo.findByNameIgnoreCaseAndBrandIgnoreCase(req.name().trim(), req.brand().trim())
                .filter(existing -> !existing.getId().equals(selfId))
                .ifPresent(x -> { throw ApiException.conflict("A product with this name and brand already exists"); });
    }

    private void apply(Product p, ProductRequest r) {
        p.setName(r.name().trim());
        p.setCategory(r.category().trim());
        p.setBrand(r.brand().trim());
        p.setUnit(r.unit().trim());
        p.setPrice(r.price());
        p.setStock(r.stock());
        p.setMinOrderQty(r.minOrderQty());
        p.setStatus(r.status());
    }

    private Specification<Product> filter(String q, String category, Product.Status status) {
        return (root, query, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim().toLowerCase() + "%";
                ps.add(cb.or(cb.like(cb.lower(root.get("name")), like), cb.like(cb.lower(root.get("brand")), like)));
            }
            if (category != null && !category.isBlank()) ps.add(cb.equal(root.get("category"), category));
            if (status != null) ps.add(cb.equal(root.get("status"), status));
            return cb.and(ps.toArray(new Predicate[0]));
        };
    }
}
