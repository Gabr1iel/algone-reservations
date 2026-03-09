CREATE TABLE IF NOT EXISTS reservations (
                                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            hotel_id BIGINT NOT NULL,
                                            room_id BIGINT NOT NULL,
                                            user_id BIGINT NOT NULL,
                                            from_date DATE NOT NULL,
                                            to_date DATE NOT NULL,
                                            status VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_reservations_dates CHECK (from_date < to_date),
    CONSTRAINT chk_reservations_status CHECK (status IN ('CREATED', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),

    CONSTRAINT fk_reservations_hotels FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservations_rooms FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,

    INDEX idx_reservations_hotel_id (hotel_id),
    INDEX idx_reservations_room_id (room_id),
    INDEX idx_reservations_user_id (user_id),
    INDEX idx_reservations_status (status),
    INDEX idx_reservations_dates (from_date, to_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;