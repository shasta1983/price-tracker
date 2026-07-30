package com.price.tracker.repository;

import com.price.tracker.domain.entity.Tracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TrackerRepository extends JpaRepository<Tracker, Long> {

    // Consulta para obtener productos con seguimiento activo no expirado
    @Query("SELECT DISTINCT t.product FROM Tracker t WHERE t.isActive = true AND t.expiresAt > :now")
    List<com.price.tracker.domain.entity.Product> findAllActiveProductsToTrack(LocalDateTime now);
}