package com.bajrix.admin.product;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) { this.service = service; }

    @GetMapping
    public ProductService.PageResponse<Product> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Product.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String dir) {
        return service.search(q, category, status, page, size, sortBy, dir);
    }

    @GetMapping("/stats")
    public ProductService.Stats stats() { return service.stats(); }

    @GetMapping("/categories")
    public List<String> categories() { return service.categories(); }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody ProductRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) { return service.update(id, req); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
