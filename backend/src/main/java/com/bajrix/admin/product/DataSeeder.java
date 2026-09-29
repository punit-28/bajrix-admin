package com.bajrix.admin.product;

import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository repo;

    public DataSeeder(ProductRepository repo) { this.repo = repo; }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;
        add("PPC Cement 50 kg", "Cement", "UltraTech", "bag", "390", 500, 10, Product.Status.ACTIVE);
        add("OPC 53 Grade Cement 50 kg", "Cement", "ACC", "bag", "425", 320, 10, Product.Status.ACTIVE);
        add("TMT Fe500D 12 mm", "Steel", "Tata Tiscon", "kg", "68", 12000, 100, Product.Status.ACTIVE);
        add("TMT Fe550 8 mm", "Steel", "JSW", "kg", "71", 0, 100, Product.Status.ACTIVE);
        add("River Sand", "Aggregates", "Local", "tonne", "1450", 80, 5, Product.Status.ACTIVE);
        add("20 mm Stone Aggregate", "Aggregates", "Local", "tonne", "980", 150, 5, Product.Status.ACTIVE);
        add("Red Clay Bricks", "Bricks & Blocks", "Kashmir Bricks", "piece", "9.50", 25000, 500, Product.Status.ACTIVE);
        add("AAC Block 600x200x100", "Bricks & Blocks", "Siporex", "piece", "58", 4000, 100, Product.Status.ACTIVE);
        add("Exterior Emulsion 20 L", "Paint", "Asian Paints", "bucket", "6200", 35, 1, Product.Status.ACTIVE);
        add("Wall Putty 40 kg", "Paint", "Birla White", "bag", "1350", 0, 1, Product.Status.INACTIVE);
        add("CPVC Pipe 1 inch", "Plumbing", "Astral", "piece", "310", 260, 10, Product.Status.ACTIVE);
        add("Modular Switch 6A", "Electrical", "Legrand", "piece", "85", 900, 10, Product.Status.INACTIVE);
    }

    private void add(String name, String category, String brand, String unit, String price,
                     int stock, int minQty, Product.Status status) {
        Product p = new Product();
        p.setName(name); p.setCategory(category); p.setBrand(brand); p.setUnit(unit);
        p.setPrice(new BigDecimal(price)); p.setStock(stock); p.setMinOrderQty(minQty); p.setStatus(status);
        repo.save(p);
    }
}
