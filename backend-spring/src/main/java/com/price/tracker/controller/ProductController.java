package com.price.tracker.controller;

import com.price.tracker.domain.entity.PriceHistory;
import com.price.tracker.domain.entity.Product;
import com.price.tracker.dto.CreateProductRequest;
import com.price.tracker.repository.PriceHistoryRepository;
import com.price.tracker.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;
    private final PriceHistoryRepository priceHistoryRepository;

    public ProductController(ProductService productService,
                             PriceHistoryRepository priceHistoryRepository) {
        this.productService = productService;
        this.priceHistoryRepository = priceHistoryRepository;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody CreateProductRequest request) {
        Product created = productService.createAndEnqueueProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<PriceHistory>> getPriceHistory(@PathVariable Long id) {
        List<PriceHistory> history = priceHistoryRepository.findByProductIdOrderByRecordedAtAsc(id);
        return ResponseEntity.ok(history);
    }
}