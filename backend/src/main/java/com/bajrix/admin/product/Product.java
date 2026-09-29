package com.bajrix.admin.product;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor
public class Product {

    public enum Status { ACTIVE, INACTIVE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(nullable = false) private String category;
    @Column(nullable = false) private String brand;
    @Column(nullable = false) private String unit;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal price;
    @Column(nullable = false) private Integer stock;
    @Column(nullable = false) private Integer minOrderQty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
