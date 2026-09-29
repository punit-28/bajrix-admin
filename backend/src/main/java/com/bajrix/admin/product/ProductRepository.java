package com.bajrix.admin.product;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findByNameIgnoreCaseAndBrandIgnoreCase(String name, String brand);

    long countByStatus(Product.Status status);

    long countByStock(int stock);

    @Query("select distinct p.category from Product p order by p.category")
    List<String> findCategories();
}
