ALTER TABLE reservations
    ADD CONSTRAINT fk_reservations_users
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;