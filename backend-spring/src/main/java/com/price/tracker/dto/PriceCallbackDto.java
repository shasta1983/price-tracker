package com.price.tracker.dto;

import java.math.BigDecimal;

public record PriceCallbackDto(
        String taskId,
        Long productId,
        BigDecimal price,
        String currency,
        Boolean available
) {}
