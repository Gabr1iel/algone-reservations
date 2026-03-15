-- ============================================================
-- Algone Reservations — DDL pro import do Enterprise Architect
-- Databáze: MySQL 8.0 / InnoDB / UTF8MB4
-- Tabulek: 11
-- ============================================================
-- Změny oproti původnímu návrhu:
--   - Odebrány tabulky guests a reservation_guests
--   - Přidán číselník special_request_types
--   - Přidána entita reservation_special_requests

-- ======================
-- 1. HOTELS
-- ======================
CREATE TABLE hotels (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    name            VARCHAR(255)                    NOT NULL,
    description     TEXT                            NULL,
    email           VARCHAR(255)                    NOT NULL,
    phone           VARCHAR(20)                     NULL,
    address_line    VARCHAR(255)                    NOT NULL,
    city            VARCHAR(100)                    NOT NULL,
    zip             VARCHAR(20)                     NOT NULL,
    country         VARCHAR(100)                    NOT NULL DEFAULT 'Česká republika',
    check_in_from   TIME                            NOT NULL,
    check_out_until TIME                            NOT NULL,
    created_at      DATETIME                        NOT NULL,
    updated_at      DATETIME                        NOT NULL,
    CONSTRAINT pk_hotels PRIMARY KEY (id)
);

-- ======================
-- 2. USERS
-- ======================
CREATE TABLE users (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    email           VARCHAR(255)                    NOT NULL,
    password_hash   VARCHAR(255)                    NOT NULL,
    first_name      VARCHAR(100)                    NOT NULL,
    last_name       VARCHAR(100)                    NOT NULL,
    phone           VARCHAR(20)                     NULL,
    role            ENUM('USER','ADMIN')            NOT NULL DEFAULT 'USER',
    created_at      DATETIME                        NOT NULL,
    updated_at      DATETIME                        NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- ======================
-- 3. ROOM_TYPES (číselník, per hotel)
-- ======================
CREATE TABLE room_types (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    hotel_id        BIGINT                          NOT NULL,
    name            VARCHAR(50)                     NOT NULL,
    description     TEXT                            NULL,
    max_capacity    TINYINT                         NOT NULL,
    base_price      DECIMAL(10,2)                   NOT NULL,
    CONSTRAINT pk_room_types PRIMARY KEY (id),
    CONSTRAINT uq_room_types_hotel_name UNIQUE (hotel_id, name),
    CONSTRAINT fk_room_types_hotels FOREIGN KEY (hotel_id)
        REFERENCES hotels (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ======================
-- 4. ROOMS
-- ======================
CREATE TABLE rooms (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    hotel_id        BIGINT                          NOT NULL,
    room_type_id    BIGINT                          NOT NULL,
    room_number     VARCHAR(10)                     NOT NULL,
    capacity        TINYINT                         NOT NULL,
    price_per_night DECIMAL(10,2)                   NOT NULL,
    description     TEXT                            NULL,
    is_active       BOOLEAN                         NOT NULL DEFAULT TRUE,
    created_at      DATETIME                        NOT NULL,
    updated_at      DATETIME                        NOT NULL,
    CONSTRAINT pk_rooms PRIMARY KEY (id),
    CONSTRAINT uq_rooms_hotel_room_number UNIQUE (hotel_id, room_number),
    CONSTRAINT fk_rooms_hotels FOREIGN KEY (hotel_id)
        REFERENCES hotels (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rooms_room_types FOREIGN KEY (room_type_id)
        REFERENCES room_types (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_rooms_hotel_id ON rooms (hotel_id);
CREATE INDEX idx_rooms_room_type_id ON rooms (room_type_id);
CREATE INDEX idx_rooms_is_active ON rooms (is_active);

-- ======================
-- 5. ROOM_IMAGES
-- ======================
CREATE TABLE room_images (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    room_id         BIGINT                          NOT NULL,
    image_url       VARCHAR(500)                    NOT NULL,
    is_primary      BOOLEAN                         NOT NULL DEFAULT FALSE,
    sort_order      INT                             NOT NULL DEFAULT 0,
    CONSTRAINT pk_room_images PRIMARY KEY (id),
    CONSTRAINT fk_room_images_rooms FOREIGN KEY (room_id)
        REFERENCES rooms (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_room_images_room_id ON room_images (room_id);

-- ======================
-- 6. AMENITIES (číselník)
-- ======================
CREATE TABLE amenities (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    code            VARCHAR(50)                     NOT NULL,
    name            VARCHAR(100)                    NOT NULL,
    description     TEXT                            NULL,
    CONSTRAINT pk_amenities PRIMARY KEY (id),
    CONSTRAINT uq_amenities_code UNIQUE (code)
);

-- ======================
-- 7. ROOM_AMENITIES (M:N spojovací tabulka)
-- ======================
CREATE TABLE room_amenities (
    room_id         BIGINT                          NOT NULL,
    amenity_id      BIGINT                          NOT NULL,
    CONSTRAINT pk_room_amenities PRIMARY KEY (room_id, amenity_id),
    CONSTRAINT fk_room_amenities_rooms FOREIGN KEY (room_id)
        REFERENCES rooms (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_room_amenities_amenities FOREIGN KEY (amenity_id)
        REFERENCES amenities (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ======================
-- 8. RESERVATIONS
-- ======================
CREATE TABLE reservations (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    user_id         BIGINT                          NOT NULL,
    room_id         BIGINT                          NOT NULL,
    check_in        DATE                            NOT NULL,
    check_out       DATE                            NOT NULL,
    status          ENUM('PENDING','CONFIRMED','CHECKED_IN','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    total_price     DECIMAL(10,2)                   NOT NULL,
    note            TEXT                            NULL,
    created_at      DATETIME                        NOT NULL,
    updated_at      DATETIME                        NOT NULL,
    CONSTRAINT pk_reservations PRIMARY KEY (id),
    CONSTRAINT fk_reservations_users FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_reservations_rooms FOREIGN KEY (room_id)
        REFERENCES rooms (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_reservations_user_id ON reservations (user_id);
CREATE INDEX idx_reservations_room_id ON reservations (room_id);
CREATE INDEX idx_reservations_status ON reservations (status);
CREATE INDEX idx_reservations_dates ON reservations (check_in, check_out);

-- ======================
-- 9. PAYMENTS
-- ======================
CREATE TABLE payments (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    reservation_id  BIGINT                          NOT NULL,
    amount          DECIMAL(10,2)                   NOT NULL,
    currency        VARCHAR(3)                      NOT NULL DEFAULT 'CZK',
    method          ENUM('CARD','BANK_TRANSFER','CASH') NOT NULL,
    status          ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at         DATETIME                        NULL,
    provider_ref    VARCHAR(100)                    NULL,
    created_at      DATETIME                        NOT NULL,
    updated_at      DATETIME                        NOT NULL,
    CONSTRAINT pk_payments PRIMARY KEY (id),
    CONSTRAINT fk_payments_reservations FOREIGN KEY (reservation_id)
        REFERENCES reservations (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_payments_reservation_id ON payments (reservation_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_reservation_id_status ON payments (reservation_id, status);

-- ======================
-- 10. SPECIAL_REQUEST_TYPES (číselník)
-- ======================
CREATE TABLE special_request_types (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    code            VARCHAR(50)                     NOT NULL,
    name            VARCHAR(100)                    NOT NULL,
    description     TEXT                            NULL,
    CONSTRAINT pk_special_request_types PRIMARY KEY (id),
    CONSTRAINT uq_special_request_types_code UNIQUE (code)
);

-- ======================
-- 11. RESERVATION_SPECIAL_REQUESTS
-- ======================
CREATE TABLE reservation_special_requests (
    id              BIGINT          AUTO_INCREMENT  NOT NULL,
    reservation_id  BIGINT                          NOT NULL,
    special_request_type_id BIGINT                  NOT NULL,
    note            TEXT                            NULL,
    created_at      DATETIME                        NOT NULL,
    CONSTRAINT pk_reservation_special_requests PRIMARY KEY (id),
    CONSTRAINT fk_res_special_req_reservations FOREIGN KEY (reservation_id)
        REFERENCES reservations (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_res_special_req_types FOREIGN KEY (special_request_type_id)
        REFERENCES special_request_types (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_res_special_req_reservation_id ON reservation_special_requests (reservation_id);
CREATE INDEX idx_res_special_req_type_id ON reservation_special_requests (special_request_type_id);
