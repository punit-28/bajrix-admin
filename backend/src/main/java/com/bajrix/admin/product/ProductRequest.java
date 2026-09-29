package com.bajrix.admin.product;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Name is required") @Size(max = 150, message = "Max 150 characters") String name,
        @NotBlank(message = "Category is required") @Size(max = 60, message = "Max 60 characters") String category,
        @NotBlank(message = "Brand is required") @Size(max = 80, message = "Max 80 characters") String brand,
        @NotBlank(message = "Unit is required") @Size(max = 20, message = "Max 20 characters") String unit,
        @NotNull(message = "Price is required") @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Max 2 decimal places") BigDecimal price,
        @NotNull(message = "Stock is required") @Min(value = 0, message = "Stock cannot be negative") Integer stock,
        @NotNull(message = "Minimum order is required") @Min(value = 1, message = "Minimum order must be at least 1") Integer minOrderQty,
        @NotNull(message = "Status is required") Product.Status status) {
}
