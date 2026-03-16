-- =============================================
-- V12 — Seed data
-- =============================================

-- 1) Hotel Algone
INSERT INTO hotels (name, description, email, phone, address_line, city, zip, country, check_in_from, check_out_until)
VALUES (
    'Hotel Algone',
    'Moderní boutique hotel v srdci Prahy s výhledem na Vltavu. Nabízíme komfortní ubytování, restauraci s českou i mezinárodní kuchyní a konferenční prostory.',
    'recepce@hotel-algone.cz',
    '+420 222 333 444',
    'Náplavní 2013/1',
    'Praha',
    '120 00',
    'Česká republika',
    '14:00',
    '10:00'
);

-- 2) Room types (hotel_id = 1)
INSERT INTO room_types (hotel_id, name, description, max_capacity, base_price) VALUES
(1, 'Single',  'Jednolůžkový pokoj s pracovním stolem a výhledem do dvora.',          1, 1500.00),
(1, 'Double',  'Dvoulůžkový pokoj s manželskou postelí a posezením.',                  2, 2500.00),
(1, 'Suite',   'Prostorné apartmá s obývacím koutem, ložnicí a luxusní koupelnou.',    4, 5000.00),
(1, 'Deluxe',  'Dvoulůžkový pokoj vyšší kategorie s balkonem a výhledem na Vltavu.',   2, 4000.00);

-- 3) Rooms (hotel_id = 1)
-- Single rooms (room_type_id = 1)
INSERT INTO rooms (hotel_id, room_type_id, room_number, capacity, price_per_night, description, is_active) VALUES
(1, 1, '101', 1, 1500.00, 'Jednolůžkový pokoj v přízemí, klidná strana do dvora.',          TRUE),
(1, 1, '102', 1, 1500.00, 'Jednolůžkový pokoj v přízemí, bezbariérový přístup.',            TRUE),
(1, 1, '201', 1, 1600.00, 'Jednolůžkový pokoj ve 2. patře s výhledem na střechy.',          TRUE);

-- Double rooms (room_type_id = 2)
INSERT INTO rooms (hotel_id, room_type_id, room_number, capacity, price_per_night, description, is_active) VALUES
(1, 2, '103', 2, 2500.00, 'Dvoulůžkový pokoj v přízemí s manželskou postelí.',              TRUE),
(1, 2, '202', 2, 2500.00, 'Dvoulůžkový pokoj ve 2. patře, dvě oddělená lůžka.',            TRUE),
(1, 2, '203', 2, 2700.00, 'Dvoulůžkový pokoj ve 2. patře s balkonem.',                     TRUE),
(1, 2, '301', 2, 2500.00, 'Dvoulůžkový pokoj ve 3. patře s výhledem do zahrady.',          TRUE);

-- Suite (room_type_id = 3)
INSERT INTO rooms (hotel_id, room_type_id, room_number, capacity, price_per_night, description, is_active) VALUES
(1, 3, '401', 4, 5000.00, 'Apartmá ve 4. patře s panoramatickým výhledem na Prahu.',       TRUE),
(1, 3, '402', 4, 5500.00, 'Prezidentské apartmá s terasou a jacuzzi.',                     TRUE);

-- Deluxe rooms (room_type_id = 4)
INSERT INTO rooms (hotel_id, room_type_id, room_number, capacity, price_per_night, description, is_active) VALUES
(1, 4, '302', 2, 4000.00, 'Deluxe pokoj ve 3. patře s balkonem a výhledem na Vltavu.',     TRUE),
(1, 4, '303', 2, 4200.00, 'Deluxe rohový pokoj se dvěma okny a posezením.',                TRUE);

-- Jeden neaktivní pokoj (údržba)
INSERT INTO rooms (hotel_id, room_type_id, room_number, capacity, price_per_night, description, is_active) VALUES
(1, 1, '104', 1, 1500.00, 'Jednolůžkový pokoj — momentálně mimo provoz (rekonstrukce koupelny).', FALSE);

-- 4) Amenities
INSERT INTO amenities (code, name, description) VALUES
('WIFI',        'Wi-Fi',            'Vysokorychlostní bezdrátové připojení k internetu na pokoji.'),
('PARKING',     'Parkování',        'Hlídané podzemní parkoviště, rezervace nutná.'),
('AC',          'Klimatizace',      'Individuálně regulovatelná klimatizace.'),
('MINIBAR',     'Minibar',          'Minibar s výběrem nápojů a snacků.'),
('BALCONY',     'Balkon',           'Soukromý balkon s posezením.'),
('TV',          'TV',               'Smart TV s mezinárodními kanály a streamovacími službami.'),
('SAFE',        'Trezor',           'Elektronický trezor na pokoji.'),
('HAIRDRYER',   'Fén',              'Fén k dispozici v koupelně.');

-- 5) Room amenities — přiřazení vybavení k pokojům
-- Všechny pokoje mají WIFI (1), TV (6), SAFE (7), HAIRDRYER (8)
INSERT INTO room_amenities (room_id, amenity_id) VALUES
-- Pokoj 101 (Single)
(1, 1), (1, 6), (1, 7), (1, 8),
-- Pokoj 102 (Single)
(2, 1), (2, 6), (2, 7), (2, 8),
-- Pokoj 201 (Single)
(3, 1), (3, 3), (3, 6), (3, 7), (3, 8),
-- Pokoj 103 (Double)
(4, 1), (4, 3), (4, 4), (4, 6), (4, 7), (4, 8),
-- Pokoj 202 (Double)
(5, 1), (5, 3), (5, 6), (5, 7), (5, 8),
-- Pokoj 203 (Double + balkon)
(6, 1), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8),
-- Pokoj 301 (Double)
(7, 1), (7, 3), (7, 4), (7, 6), (7, 7), (7, 8),
-- Pokoj 401 (Suite — vše)
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 6), (8, 7), (8, 8),
-- Pokoj 402 (Suite — vše)
(9, 1), (9, 2), (9, 3), (9, 4), (9, 5), (9, 6), (9, 7), (9, 8),
-- Pokoj 302 (Deluxe)
(10, 1), (10, 3), (10, 4), (10, 5), (10, 6), (10, 7), (10, 8),
-- Pokoj 303 (Deluxe)
(11, 1), (11, 3), (11, 4), (11, 6), (11, 7), (11, 8),
-- Pokoj 104 (neaktivní Single)
(12, 1), (12, 6), (12, 7), (12, 8);

-- 6) Admin user (admin@test.com / admin123)
-- BCrypt hash vygenerován přes BCryptPasswordEncoder se strength 10
INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
VALUES (
    'admin@test.com',
    '$2a$10$wEVK4NzcuFkj9J41m9rHGOQR5oQKImlcVKnfB3WMwQ6q6XVbAtvfG',
    'Admin',
    'Algone',
    '+420 111 222 333',
    'ADMIN'
);

-- 7) Special request types
INSERT INTO special_request_types (code, name, description) VALUES
('EXTRA_BED',        'Přistýlka',              'Přidání přistýlky na pokoj (dle dostupnosti).'),
('LATE_CHECKOUT',    'Pozdní odjezd',           'Check-out prodloužen do 14:00 (dle dostupnosti).'),
('EARLY_CHECKIN',    'Brzký příjezd',           'Check-in od 11:00 (dle dostupnosti).'),
('BABY_COT',         'Dětská postýlka',         'Dětská postýlka na pokoji pro děti do 3 let.'),
('PARKING',          'Parkování',               'Rezervace parkovacího místa v podzemní garáži.'),
('AIRPORT_TRANSFER', 'Transfer z letiště',      'Zajištění transferu z/na letiště Václava Havla.'),
('QUIET_ROOM',       'Tichý pokoj',             'Pokoj na klidnější straně budovy, mimo ulici.'),
('HIGH_FLOOR',       'Vyšší patro',             'Preferovaný pokoj ve vyšším patře.');
