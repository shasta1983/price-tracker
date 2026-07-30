package com.price.tracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateProductRequest {
    private String name;

    @NotBlank(message = "La URL es obligatoria")
    private String url;
}