-- =============================================
-- V13 — VIEW v_active_reservations
-- Přehled aktivních rezervací (status NOT IN CANCELLED, COMPLETED)
-- s joinem na user, room, room_type a hotel.
-- =============================================

DROP VIEW IF EXISTS v_active_reservations;

CREATE VIEW v_active_reservations AS
SELECT
    r.id              AS reservation_id,
    r.check_in,
    r.check_out,
    r.status,
    r.total_price,
    r.created_at,
    u.id              AS user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS guest_name,
    u.email           AS guest_email,
    rm.id             AS room_id,
    rm.room_number,
    rt.name           AS room_type,
    h.id              AS hotel_id,
    h.name            AS hotel_name
FROM reservations r
JOIN users u       ON u.id  = r.user_id
JOIN rooms rm      ON rm.id = r.room_id
JOIN room_types rt ON rt.id = rm.room_type_id
JOIN hotels h      ON h.id  = rm.hotel_id
WHERE r.status NOT IN ('CANCELLED', 'COMPLETED');
