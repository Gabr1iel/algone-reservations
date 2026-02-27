CREATE TABLE IF NOT EXISTS room_amenities (
    room_id    BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,

    PRIMARY KEY (room_id, amenity_id),
    CONSTRAINT fk_room_amenities_rooms     FOREIGN KEY (room_id)    REFERENCES rooms(id)     ON DELETE CASCADE,
    CONSTRAINT fk_room_amenities_amenities FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;