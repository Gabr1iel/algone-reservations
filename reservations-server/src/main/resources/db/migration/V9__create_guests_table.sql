CREATE TABLE IF NOT EXISTS guests (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NULL,
    document_number VARCHAR(100) NULL,
    nationality VARCHAR(100) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_guests_last_name (last_name),
    INDEX idx_guests_document_number (document_number)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;