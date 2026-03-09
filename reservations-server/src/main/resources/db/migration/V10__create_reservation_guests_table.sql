CREATE TABLE IF NOT EXISTS reservation_guests (
                                                  reservation_id BIGINT NOT NULL,
                                                  guest_id BIGINT NOT NULL,
                                                  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                                  PRIMARY KEY (reservation_id, guest_id),

    CONSTRAINT fk_reservation_guests_reservations
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,

    CONSTRAINT fk_reservation_guests_guests
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,

    INDEX idx_reservation_guests_guest_id (guest_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;