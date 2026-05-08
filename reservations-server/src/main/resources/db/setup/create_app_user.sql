-- =============================================
-- Vytvoření aplikačního DB uživatele s omezenými právy.
--
-- Spouští se RUČNĚ pod účtem s právy CREATE USER + GRANT (typicky root)
-- jednorázově při setupu prostředí. NENÍ součástí Flyway migrací,
-- protože Flyway samotný potřebuje vyšší oprávnění (CREATE/ALTER/DROP).
--
-- Použití:
--   mysql -u root -p < create_app_user.sql
--
-- Práva:
--   - SELECT, INSERT, UPDATE, DELETE  → standardní DML
--   - EXECUTE                         → volání FUNCTION / PROCEDURE
--   - REFERENCES                      → vytváření FK z aplikace (volitelné)
--   - NEMÁ: CREATE, DROP, ALTER, GRANT, INDEX (DBA / Flyway only)
-- =============================================

CREATE USER IF NOT EXISTS 'app_user'@'%'
    IDENTIFIED BY 'secretpassword1234';

GRANT SELECT, INSERT, UPDATE, DELETE
    ON algone_reservations.*
    TO 'app_user'@'%';

GRANT EXECUTE
    ON algone_reservations.*
    TO 'app_user'@'%';

FLUSH PRIVILEGES;

-- Ověření udělených práv:
-- SHOW GRANTS FOR 'app_user'@'%';
