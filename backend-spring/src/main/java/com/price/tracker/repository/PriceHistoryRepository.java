package com.price.tracker.repository;

import com.price.tracker.domain.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    // Obtener todo el historial de precios de un producto ordenado cronológicamente
    List<PriceHistory> findByProductIdOrderByRecordedAtAsc(Long productId);

    // Obtener la última lectura registrada de un producto
    Optional<PriceHistory> findFirstByProductIdOrderByRecordedAtDesc(Long productId);

    // Consulta para obtener el precio mínimo histórico alcanzado por un producto
    @Query("SELECT MIN(ph.price) FROM PriceHistory ph WHERE ph.product.id = :productId AND ph.price > 0")
    Optional<java.math.BigDecimal> findMinPriceByProductId(Long productId);
}