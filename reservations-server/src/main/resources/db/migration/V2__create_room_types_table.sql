CREATE TABLE IF NOT EXISTS room_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT NULL,
    max_capacity TINYINT UNSIGNED NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,

    CONSTRAINT uq_room_types_hotel_name UNIQUE (hotel_id, name),
    CONSTRAINT fk_room_types_hotels FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;