-- =============================================
-- V16 — TRIGGER trg_payment_set_paid_at
-- BEFORE UPDATE na payments: pokud status přechází na PAID
-- a paid_at je dosud NULL, automaticky vyplní paid_at = NOW().
-- =============================================

DROP TRIGGER IF EXISTS trg_payment_set_paid_at;

DELIMITER $$

CREATE TRIGGER trg_payment_set_paid_at
BEFORE UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'PAID'
       AND OLD.status <> 'PAID'
       AND NEW.paid_at IS NULL THEN
        SET NEW.paid_at = NOW();
    END IF;
END$$

DELIMITER ;
