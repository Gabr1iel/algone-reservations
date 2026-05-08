-- =============================================
-- V14 — FUNCTION fn_calculate_total_price
-- Vrací celkovou cenu rezervace = počet nocí * price_per_night.
-- Vstup: room_id, check_in, check_out
-- =============================================

DROP FUNCTION IF EXISTS fn_calculate_total_price;

DELIMITER $$

CREATE FUNCTION fn_calculate_total_price(
    p_room_id   BIGINT,
    p_check_in  DATE,
    p_check_out DATE
)
RETURNS DECIMAL(10, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_price_per_night DECIMAL(10, 2);
    DECLARE v_nights INT;

    SELECT price_per_night INTO v_price_per_night
    FROM rooms
    WHERE id = p_room_id;

    SET v_nights = DATEDIFF(p_check_out, p_check_in);

    IF v_price_per_night IS NULL OR v_nights <= 0 THEN
        RETURN 0;
    END IF;

    RETURN v_price_per_night * v_nights;
END$$

DELIMITER ;
