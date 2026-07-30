package com.price.tracker.config;

import com.price.tracker.domain.entity.Product;
import com.price.tracker.dto.ScrapingTaskDto;
import com.price.tracker.repository.ProductRepository;
import com.price.tracker.service.ScrapingQueuePublisher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class TestRunnerConfig {

    @Bean
    CommandLineRunner runTestScraping(ProductRepository productRepository, ScrapingQueuePublisher publisher) {
        return args -> {
            // 1. Guardar o recuperar un producto de prueba en DB
            Product product = productRepository.findByPlatformAndExternalId("EBAY", "TEST-SKU-123")
                    .orElseGet(() -> productRepository.save(Product.builder()
                            .platform("EBAY")
                            .externalId("TEST-SKU-123")
                            .name("Producto de Prueba")
                            .url("https://www.ebay.com/itm/123456789") // Puedes probar con una URL real de eBay/Amazon
                            .build()));

            // 2. Publicar la tarea en la cola de Redis al arrancar la app
            ScrapingTaskDto task = new ScrapingTaskDto(
                    UUID.randomUUID().toString(),
                    product.getId(),
                    product.getPlatform(),
                    product.getUrl()
            );

            System.out.println("🧪 [TestRunner] Publicando tarea de prueba para Producto ID: " + product.getId());
            publisher.publishTask(task);
        };
    }
}