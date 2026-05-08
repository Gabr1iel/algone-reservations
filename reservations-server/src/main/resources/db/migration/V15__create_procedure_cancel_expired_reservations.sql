-- =============================================
-- V15 — PROCEDURE sp_cancel_expired_reservations
-- Hromadně zruší PENDING rezervace starší než p_days dní.
-- Určeno k periodickému spouštění (cron / scheduled task).
-- =============================================

DROP PROCEDURE IF EXISTS sp_cancel_expired_reservations;

DELIMITER $$

CREATE PROCEDURE sp_cancel_expired_reservations(IN p_days INT)
BEGIN
    UPDATE reservations
       SET status = 'CANCELLED'
     WHERE status = 'PENDING'
       AND created_at < DATE_SUB(NOW(), INTERVAL p_days DAY);
END$$

DELIMITER ;
