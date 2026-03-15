CREATE TABLE IF NOT EXISTS payments (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT         NOT NULL,
    amount         DECIMAL(10,2)  NOT NULL,
    currency       VARCHAR(3)     NOT NULL DEFAULT 'CZK',
    method         ENUM('CARD','BANK_TRANSFER','CASH') NOT NULL,
    status         ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at        DATETIME       NULL,
    provider_ref   VARCHAR(100)   NULL,
    created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_payments_amount CHECK (amount > 0),

    CONSTRAINT fk_payments_reservations FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE RESTRICT,

    INDEX idx_payments_reservation_id (reservation_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_reservation_id_status (reservation_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
