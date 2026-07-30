package com.price.tracker.service;

import com.price.tracker.domain.entity.Product;
import com.price.tracker.dto.CreateProductRequest;
import com.price.tracker.repository.ProductRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final StringRedisTemplate redisTemplate;

    private static final String SCRAPER_QUEUE = "scraping_queue";

    private static final Pattern AMAZON_ASIN_PATTERN = Pattern.compile("/(?:dp|gp/product)/([A-Z0-9]{10})");
    private static final Pattern EBAY_ITEM_PATTERN = Pattern.compile("/itm/(?:[^/]+/)?(\\d+)");

    public ProductService(ProductRepository productRepository, StringRedisTemplate redisTemplate) {
        this.productRepository = productRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public Product createAndEnqueueProduct(CreateProductRequest request) {
        String platform = extractPlatformFromUrl(request.getUrl());
        String externalId = extractExternalIdFromUrl(request.getUrl(), platform);

        String productName = (request.getName() != null && !request.getName().isBlank())
                ? request.getName()
                : "Producto " + platform;

        Product product = Product.builder()
                .name(productName)
                .url(request.getUrl())
                .platform(platform)
                .externalId(externalId)
                .build();

        Product savedProduct = productRepository.save(product);

        String jsonPayload = String.format("{\"id\":%d, \"url\":\"%s\", \"platform\":\"%s\", \"external_id\":\"%s\"}",
                savedProduct.getId(), savedProduct.getUrl(), savedProduct.getPlatform(), savedProduct.getExternalId());

        redisTemplate.opsForList().rightPush(SCRAPER_QUEUE, jsonPayload);

        return savedProduct;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    private String extractPlatformFromUrl(String url) {
        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            if (host == null) return "UNKNOWN";

            host = host.toLowerCase();
            if (host.contains("ebay")) return "EBAY";
            if (host.contains("amazon")) return "AMAZON";
            if (host.contains("aliexpress")) return "ALIEXPRESS";
            if (host.contains("mercadolibre")) return "MERCADOLIBRE";

            return "OTHER";
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }

    private String extractExternalIdFromUrl(String url, String platform) {
        if (url == null || url.isBlank()) return "UNKNOWN-" + System.currentTimeMillis();

        if ("AMAZON".equals(platform)) {
            Matcher matcher = AMAZON_ASIN_PATTERN.matcher(url);
            if (matcher.find()) {
                return matcher.group(1);
            }
        } else if ("EBAY".equals(platform)) {
            Matcher matcher = EBAY_ITEM_PATTERN.matcher(url);
            if (matcher.find()) {
                return matcher.group(1);
            }
        }

        return platform + "-" + System.currentTimeMillis();
    }
}