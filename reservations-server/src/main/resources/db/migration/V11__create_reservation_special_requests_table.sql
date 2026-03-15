CREATE TABLE IF NOT EXISTS reservation_special_requests (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id          BIGINT NOT NULL,
    special_request_type_id BIGINT NOT NULL,
    note                    TEXT   NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_res_special_req_reservations FOREIGN KEY (reservation_id)
        REFERENCES reservations(id) ON DELETE CASCADE,
    CONSTRAINT fk_res_special_req_types FOREIGN KEY (special_request_type_id)
        REFERENCES special_request_types(id) ON DELETE RESTRICT,

    INDEX idx_res_special_req_reservation_id (reservation_id),
    INDEX idx_res_special_req_type_id (special_request_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
