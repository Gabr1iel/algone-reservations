-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: localhost    Database: algone_reservations
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `amenities`
--

DROP TABLE IF EXISTS `amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_amenities_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amenities`
--

LOCK TABLES `amenities` WRITE;
/*!40000 ALTER TABLE `amenities` DISABLE KEYS */;
INSERT INTO `amenities` VALUES (1,'WIFI','Wi-Fi','Vysokorychlostní bezdrátové připojení k internetu na pokoji.'),(2,'PARKING','Parkování','Hlídané podzemní parkoviště, rezervace nutná.'),(3,'AC','Klimatizace','Individuálně regulovatelná klimatizace.'),(4,'MINIBAR','Minibar','Minibar s výběrem nápojů a snacků.'),(5,'BALCONY','Balkon','Soukromý balkon s posezením.'),(6,'TV','TV','Smart TV s mezinárodními kanály a streamovacími službami.'),(7,'SAFE','Trezor','Elektronický trezor na pokoji.'),(8,'HAIRDRYER','Fén','Fén k dispozici v koupelně.');
/*!40000 ALTER TABLE `amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','create hotels table','SQL','V1__create_hotels_table.sql',-1665203070,'root','2026-03-07 11:10:05',52,1),(2,'2','create room types table','SQL','V2__create_room_types_table.sql',179842934,'root','2026-03-07 11:10:05',76,1),(3,'3','create room table','SQL','V3__create_room_table.sql',71775179,'root','2026-03-07 11:10:05',165,1),(4,'4','create room images table','SQL','V4__create_room_images_table.sql',-1294611275,'root','2026-03-07 11:10:05',63,1),(5,'5','create amenities table','SQL','V5__create_amenities_table.sql',161380794,'root','2026-03-07 11:10:05',118,1),(6,'6','create room amenities table','SQL','V6__create_room_amenities_table.sql',-343144000,'root','2026-03-07 11:10:06',58,1),(7,'7','create users table','SQL','V7__create_users_table.sql',-532056716,'root','2026-04-14 08:10:00',67,1),(8,'8','create reservations table','SQL','V8__create_reservations_table.sql',2051396336,'root','2026-04-14 08:10:00',80,1),(9,'9','create payments table','SQL','V9__create_payments_table.sql',-719649478,'root','2026-04-14 08:10:00',75,1),(10,'10','create special request types table','SQL','V10__create_special_request_types_table.sql',1663565438,'root','2026-04-14 08:10:01',72,1),(11,'11','create reservation special requests table','SQL','V11__create_reservation_special_requests_table.sql',1279823724,'root','2026-04-14 08:10:01',49,1),(12,'12','seed data','SQL','V12__seed_data.sql',-1209241470,'root','2026-04-14 08:10:01',100,1),(13,'13','create view active reservations','SQL','V13__create_view_active_reservations.sql',-845481861,'root','2026-05-10 12:09:23',46,1),(14,'14','create function calculate total price','SQL','V14__create_function_calculate_total_price.sql',2008064105,'root','2026-05-10 12:09:23',24,1),(15,'15','create procedure cancel expired reservations','SQL','V15__create_procedure_cancel_expired_reservations.sql',-2131124228,'root','2026-05-10 12:09:23',27,1),(16,'16','create trigger payment set paid at','SQL','V16__create_trigger_payment_set_paid_at.sql',1486826885,'root','2026-05-10 12:09:23',21,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zip` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Česká republika',
  `check_in_from` time NOT NULL,
  `check_out_until` time NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'Hotel Algone','Moderní boutique hotel v srdci Prahy s výhledem na Vltavu. Nabízíme komfortní ubytování, restauraci s českou i mezinárodní kuchyní a konferenční prostory.','recepce@hotel-algone.cz','+420 222 333 444','Náplavní 2013/1','Praha','120 00','Česká republika','14:00:00','10:00:00','2026-04-14 08:10:01','2026-04-14 08:10:01');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reservation_id` bigint NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CZK',
  `method` enum('CARD','BANK_TRANSFER','CASH') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','PAID','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paid_at` datetime DEFAULT NULL,
  `provider_ref` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_reservation_id` (`reservation_id`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_reservation_id_status` (`reservation_id`,`status`),
  CONSTRAINT `fk_payments_reservations` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_payments_amount` CHECK ((`amount` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_payment_set_paid_at` BEFORE UPDATE ON `payments` FOR EACH ROW BEGIN
    IF NEW.status = 'PAID'
       AND OLD.status <> 'PAID'
       AND NEW.paid_at IS NULL THEN
        SET NEW.paid_at = NOW();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `reservation_special_requests`
--

DROP TABLE IF EXISTS `reservation_special_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_special_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reservation_id` bigint NOT NULL,
  `special_request_type_id` bigint NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_res_special_req_reservation_id` (`reservation_id`),
  KEY `idx_res_special_req_type_id` (`special_request_type_id`),
  CONSTRAINT `fk_res_special_req_reservations` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_res_special_req_types` FOREIGN KEY (`special_request_type_id`) REFERENCES `special_request_types` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_special_requests`
--

LOCK TABLES `reservation_special_requests` WRITE;
/*!40000 ALTER TABLE `reservation_special_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation_special_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `status` enum('PENDING','CONFIRMED','CHECKED_IN','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `total_price` decimal(10,2) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reservations_user_id` (`user_id`),
  KEY `idx_reservations_room_id` (`room_id`),
  KEY `idx_reservations_status` (`status`),
  KEY `idx_reservations_dates` (`check_in`,`check_out`),
  CONSTRAINT `fk_reservations_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_reservations_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_reservations_dates` CHECK ((`check_in` < `check_out`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_amenities` (
  `room_id` bigint NOT NULL,
  `amenity_id` bigint NOT NULL,
  PRIMARY KEY (`room_id`,`amenity_id`),
  KEY `fk_room_amenities_amenities` (`amenity_id`),
  CONSTRAINT `fk_room_amenities_amenities` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_room_amenities_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(8,2),(9,2),(3,3),(4,3),(5,3),(6,3),(7,3),(8,3),(9,3),(10,3),(11,3),(4,4),(6,4),(7,4),(8,4),(9,4),(10,4),(11,4),(6,5),(8,5),(9,5),(10,5),(1,6),(2,6),(3,6),(4,6),(5,6),(6,6),(7,6),(8,6),(9,6),(10,6),(11,6),(12,6),(1,7),(2,7),(3,7),(4,7),(5,7),(6,7),(7,7),(8,7),(9,7),(10,7),(11,7),(12,7),(1,8),(2,8),(3,8),(4,8),(5,8),(6,8),(7,8),(8,8),(9,8),(10,8),(11,8),(12,8);
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_room_images_room_id` (`room_id`),
  CONSTRAINT `fk_room_images_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `max_capacity` tinyint unsigned NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_room_types_hotel_name` (`hotel_id`,`name`),
  CONSTRAINT `fk_room_types_hotels` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES (1,1,'Single','Jednolůžkový pokoj s pracovním stolem a výhledem do dvora.',1,1500.00),(2,1,'Double','Dvoulůžkový pokoj s manželskou postelí a posezením.',2,2500.00),(3,1,'Suite','Prostorné apartmá s obývacím koutem, ložnicí a luxusní koupelnou.',4,5000.00),(4,1,'Deluxe','Dvoulůžkový pokoj vyšší kategorie s balkonem a výhledem na Vltavu.',2,4000.00);
/*!40000 ALTER TABLE `room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint NOT NULL,
  `room_type_id` bigint NOT NULL,
  `room_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` tinyint unsigned NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rooms_hotel_room_number` (`hotel_id`,`room_number`),
  KEY `idx_rooms_hotel_id` (`hotel_id`),
  KEY `idx_rooms_room_type` (`room_type_id`),
  KEY `idx_rooms_is_active` (`is_active`),
  CONSTRAINT `fk_rooms_hotels` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rooms_room_types` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,1,'101',1,1500.00,'Jednolůžkový pokoj v přízemí, klidná strana do dvora.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(2,1,1,'102',1,1500.00,'Jednolůžkový pokoj v přízemí, bezbariérový přístup.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(3,1,1,'201',1,1600.00,'Jednolůžkový pokoj ve 2. patře s výhledem na střechy.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(4,1,2,'103',2,2500.00,'Dvoulůžkový pokoj v přízemí s manželskou postelí.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(5,1,2,'202',2,2500.00,'Dvoulůžkový pokoj ve 2. patře, dvě oddělená lůžka.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(6,1,2,'203',2,2700.00,'Dvoulůžkový pokoj ve 2. patře s balkonem.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(7,1,2,'301',2,2500.00,'Dvoulůžkový pokoj ve 3. patře s výhledem do zahrady.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(8,1,3,'401',4,5000.00,'Apartmá ve 4. patře s panoramatickým výhledem na Prahu.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(9,1,3,'402',4,5500.00,'Prezidentské apartmá s terasou a jacuzzi.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(10,1,4,'302',2,4000.00,'Deluxe pokoj ve 3. patře s balkonem a výhledem na Vltavu.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(11,1,4,'303',2,4200.00,'Deluxe rohový pokoj se dvěma okny a posezením.',1,'2026-04-14 08:10:01','2026-04-14 08:10:01'),(12,1,1,'104',1,1500.00,'Jednolůžkový pokoj — momentálně mimo provoz (rekonstrukce koupelny).',0,'2026-04-14 08:10:01','2026-04-14 08:10:01');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `special_request_types`
--

DROP TABLE IF EXISTS `special_request_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `special_request_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_special_request_types_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `special_request_types`
--

LOCK TABLES `special_request_types` WRITE;
/*!40000 ALTER TABLE `special_request_types` DISABLE KEYS */;
INSERT INTO `special_request_types` VALUES (1,'EXTRA_BED','Přistýlka','Přidání přistýlky na pokoj (dle dostupnosti).'),(2,'LATE_CHECKOUT','Pozdní odjezd','Check-out prodloužen do 14:00 (dle dostupnosti).'),(3,'EARLY_CHECKIN','Brzký příjezd','Check-in od 11:00 (dle dostupnosti).'),(4,'BABY_COT','Dětská postýlka','Dětská postýlka na pokoji pro děti do 3 let.'),(5,'PARKING','Parkování','Rezervace parkovacího místa v podzemní garáži.'),(6,'AIRPORT_TRANSFER','Transfer z letiště','Zajištění transferu z/na letiště Václava Havla.'),(7,'QUIET_ROOM','Tichý pokoj','Pokoj na klidnější straně budovy, mimo ulici.'),(8,'HIGH_FLOOR','Vyšší patro','Preferovaný pokoj ve vyšším patře.');
/*!40000 ALTER TABLE `special_request_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@test.com','$2a$10$wEVK4NzcuFkj9J41m9rHGOQR5oQKImlcVKnfB3WMwQ6q6XVbAtvfG','Admin','Algone','+420 111 222 333','ADMIN','2026-04-14 08:10:01','2026-04-14 08:10:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_active_reservations`
--

DROP TABLE IF EXISTS `v_active_reservations`;
/*!50001 DROP VIEW IF EXISTS `v_active_reservations`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_active_reservations` AS SELECT 
 1 AS `reservation_id`,
 1 AS `check_in`,
 1 AS `check_out`,
 1 AS `status`,
 1 AS `total_price`,
 1 AS `created_at`,
 1 AS `user_id`,
 1 AS `guest_name`,
 1 AS `guest_email`,
 1 AS `room_id`,
 1 AS `room_number`,
 1 AS `room_type`,
 1 AS `hotel_id`,
 1 AS `hotel_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_active_reservations`
--

/*!50001 DROP VIEW IF EXISTS `v_active_reservations`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_active_reservations` AS select `r`.`id` AS `reservation_id`,`r`.`check_in` AS `check_in`,`r`.`check_out` AS `check_out`,`r`.`status` AS `status`,`r`.`total_price` AS `total_price`,`r`.`created_at` AS `created_at`,`u`.`id` AS `user_id`,concat(`u`.`first_name`,' ',`u`.`last_name`) AS `guest_name`,`u`.`email` AS `guest_email`,`rm`.`id` AS `room_id`,`rm`.`room_number` AS `room_number`,`rt`.`name` AS `room_type`,`h`.`id` AS `hotel_id`,`h`.`name` AS `hotel_name` from ((((`reservations` `r` join `users` `u` on((`u`.`id` = `r`.`user_id`))) join `rooms` `rm` on((`rm`.`id` = `r`.`room_id`))) join `room_types` `rt` on((`rt`.`id` = `rm`.`room_type_id`))) join `hotels` `h` on((`h`.`id` = `rm`.`hotel_id`))) where (`r`.`status` not in ('CANCELLED','COMPLETED')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-10 14:11:48
