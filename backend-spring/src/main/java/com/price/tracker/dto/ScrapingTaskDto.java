package com.price.tracker.dto;

public record ScrapingTaskDto(
        String taskId,
        Long productId,
        String platform,
        String url
) {}
