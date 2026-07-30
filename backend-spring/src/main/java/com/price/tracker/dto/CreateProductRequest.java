package com.price.tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateProductRequest {
    private String name;

    @NotBlank(message = "La URL es obligatoria")
    @Pattern(
            regexp = "^https?://(www\\.)?(amazon|ebay)\\.[a-z.]{2,}/.*$",
            message = "Solo se permiten enlaces de Amazon o eBay"
    )
    private String url;
}