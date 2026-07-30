package com.price.tracker.repository;

import com.price.tracker.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByPlatformAndExternalId(String platform, String externalId);
}