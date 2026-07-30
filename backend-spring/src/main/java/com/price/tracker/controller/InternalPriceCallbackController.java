package com.price.tracker.controller;

import com.price.tracker.domain.entity.PriceHistory;
import com.price.tracker.domain.entity.Product;
import com.price.tracker.dto.PriceCallbackDto;
import com.price.tracker.repository.PriceHistoryRepository;
import com.price.tracker.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/internal/prices")
public class InternalPriceCallbackController {

    private final ProductRepository productRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    @Value("${app.security.internal-token:secret-internal-key-2026}")
    private String expectedToken;

    public InternalPriceCallbackController(ProductRepository productRepository,
                                           PriceHistoryRepository priceHistoryRepository) {
        this.productRepository = productRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }

    @PostMapping("/callback")
    public ResponseEntity<Void> handlePriceCallback(
            @RequestHeader(value = "X-Internal-Token", required = false) String token,
            @RequestBody PriceCallbackDto dto) {

        // Validar token de seguridad interno
        if (token == null || !token.equals(expectedToken)) {
            return ResponseEntity.status(401).build();
        }

        System.out.println("<- [Spring Callback] Precio recibido: $" + dto.price() + " para Producto ID: " + dto.productId());

        // Guardar el registro en el histórico
        Product product = productRepository.findById(dto.productId()).orElse(null);
        if (product != null && dto.price().compareTo(BigDecimal.ZERO) > 0) {
            PriceHistory history = PriceHistory.builder()
                    .product(product)
                    .price(dto.price())
                    .currency(dto.currency())
                    .isAvailable(dto.available())
                    .build();

            priceHistoryRepository.save(history);
            System.out.println("💾 [Spring] Histórico de precio guardado en DB.");
        }

        return ResponseEntity.ok().build();
    }
}