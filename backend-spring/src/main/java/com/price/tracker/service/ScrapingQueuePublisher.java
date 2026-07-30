package com.price.tracker.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.price.tracker.dto.ScrapingTaskDto;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class ScrapingQueuePublisher {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private static final String QUEUE_NAME = "scraping_tasks";

    public ScrapingQueuePublisher(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishTask(ScrapingTaskDto task) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(task);
            redisTemplate.opsForList().leftPush(QUEUE_NAME, jsonMessage);
            System.out.println("-> [Spring] Tarea enviada a Redis: " + task.taskId());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializando la tarea de scraping", e);
        }
    }
}