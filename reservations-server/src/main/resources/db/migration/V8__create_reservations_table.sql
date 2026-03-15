CREATE TABLE IF NOT EXISTS reservations (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT         NOT NULL,
    room_id     BIGINT         NOT NULL,
    check_in    DATE           NOT NULL,
    check_out   DATE           NOT NULL,
    status      ENUM('PENDING','CONFIRMED','CHECKED_IN','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    total_price DECIMAL(10,2)  NOT NULL,
    note        TEXT           NULL,
    created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_reservations_dates CHECK (check_in < check_out),

    CONSTRAINT fk_reservations_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reservations_rooms FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,

    INDEX idx_reservations_user_id (user_id),
    INDEX idx_reservations_room_id (room_id),
    INDEX idx_reservations_status (status),
    INDEX idx_reservations_dates (check_in, check_out)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
