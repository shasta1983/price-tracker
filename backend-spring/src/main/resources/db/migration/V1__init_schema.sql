-- V1__init_schema.sql

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
                          id BIGSERIAL PRIMARY KEY,
                          platform VARCHAR(50) NOT NULL, -- Ej: AMAZON, EBAY
                          external_id VARCHAR(100) NOT NULL, -- Ej: ASIN o SKU
                          url TEXT NOT NULL,
                          name VARCHAR(500),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT uk_platform_external_id UNIQUE (platform, external_id)
);

CREATE TABLE trackers (
                          id BIGSERIAL PRIMARY KEY,
                          user_id BIGINT NOT NULL REFERENCES users(id),
                          product_id BIGINT NOT NULL REFERENCES products(id),
                          target_price DECIMAL(10, 2) NOT NULL,
                          is_active BOOLEAN DEFAULT TRUE,
                          expires_at TIMESTAMP NOT NULL, -- Para implementar la lógica de limpieza (TTL)
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_history (
                               id BIGSERIAL PRIMARY KEY,
                               product_id BIGINT NOT NULL REFERENCES products(id),
                               price DECIMAL(10, 2) NOT NULL,
                               currency VARCHAR(10) DEFAULT 'USD',
                               is_available BOOLEAN DEFAULT TRUE,
                               recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar las consultas del histórico y los cron jobs
CREATE INDEX idx_trackers_active_expires ON trackers(is_active, expires_at);
CREATE INDEX idx_price_history_product_date ON price_history(product_id, recorded_at);