# Architektura projektu — Algone Reservations

Hotelový rezervační systém rozdělený na **backend** (Spring Boot REST API), **frontend** (vanilla JS SPA) a **databázi** (MySQL).

---

## Obsah

1. [Backend — reservations-server](#backend--reservations-server)
2. [Frontend — reservations-front](#frontend--reservations-front)
3. [Návrh entit](#návrh-entit)
4. [Stavový automat rezervace](#stavový-automat-rezervace)
5. [Stavový automat platby](#stavový-automat-platby)
6. [Business pravidla](#business-pravidla)
7. [API endpointy (návrh)](#api-endpointy-návrh)
8. [Databázové objekty (povinné dle zadání)](#databázové-objekty-povinné-dle-zadání)

---

## Backend — `reservations-server`

Vícevrstvá architektura: **Controller → Service → Repository → Entity**

```
src/main/java/com/algone/reservations/
```

| Složka | Účel |
|---|---|
| `config/` | Spring konfigurace — bezpečnost (SecurityConfig), CORS (CorsConfig), obecná nastavení (WebConfig). Vše co se anotuje `@Configuration`. |
| `controller/` | REST controllery (`@RestController`). Přijímají HTTP požadavky a delegují na Service vrstvu. Žádná byznys logika. Všechny endpointy pod prefixem `/api`. |
| `service/` | Byznys logika (`@Service`). Veškerá aplikační logika — validace pravidel, výpočty, orchestrace. Služby volají Repository vrstvu. |
| `repository/` | JPA repozitáře (`extends JpaRepository`). Přístup k databázi. Derived query metody nebo JPQL — žádné nativní SQL. |
| `entity/` | JPA entity (`@Entity`). Mapování na databázové tabulky. Obsahují JPA anotace, vztahy (`@ManyToOne`, `@OneToMany`, `@ManyToMany`…) a enum typy. |
| `dto/request/` | DTO objekty pro příchozí požadavky (request body). Obsahují validační anotace (`@NotNull`, `@Size`, `@Email`…). |
| `dto/response/` | DTO objekty pro odpovědi. Entity se nikdy nevrací přímo — vždy se mapují na Response DTO. |
| `exception/` | Centrální zpracování výjimek. `GlobalExceptionHandler` s `@RestControllerAdvice` a vlastní výjimky (`ResourceNotFoundException`, `BusinessRuleException`…). |
| `security/` | Autentizace a autorizace — JWT provider, implementace `UserDetailsService`, filtry. |

```
src/main/resources/
```

| Složka / Soubor | Účel |
|---|---|
| `application.properties` | Konfigurace aplikace — DB připojení (přes env proměnné), JPA nastavení (`ddl-auto=validate`), JWT secret atd. |
| `db/migration/` | SQL migrační skripty. Verzované soubory pro vytváření tabulek, VIEW, FUNCTION, PROCEDURE, TRIGGER a seed dat. Hibernate schema neřídí — pouze validuje. |

```
src/test/java/com/algone/reservations/
```

| Složka | Účel |
|---|---|
| `service/` | Unit testy byznys logiky. Testujeme Service třídy s mockovanými repozitáři. Pokrytí klíčových business pravidel. |
| `controller/` | Integrační testy REST API. Testujeme controllery přes `@WebMvcTest` nebo `MockMvc`. |

---

## Frontend — `reservations-front`

Architektura SPA: **State → Actions → Dispatcher → Selectors → Handler Factory → Views → Infrastructure**

```
js/
```

| Složka | Účel |
|---|---|
| `state/` | **Centrální stav** — jediný zdroj pravdy celé aplikace. Obsahuje `store.js` se state objektem, metody pro subscribe/notify a inicializaci výchozího stavu. Žádná komponenta si nedrží vlastní stav. |
| `actions/` | **Pojmenované akce** — konstanty reprezentující záměry pro změnu stavu. Např. `RESERVATION_CREATE`, `USER_LOGIN`, `ROOM_FETCH_SUCCESS`. Akce jsou jediný způsob, jak změnit stav. |
| `dispatcher/` | **Dispatcher** — přijme akci (typ + payload) a provede odpovídající změnu stavu ve store. Funguje jako centrální switch/router akcí. Po změně stavu notifikuje subscribers (views). |
| `selectors/` | **Selektory** — čisté funkce, které ze stavu extrahují a připravují data pro UI. Např. `getAvailableRooms(state)`, `getUserReservations(state)`. Views nikdy nečtou stav přímo. |
| `handlers/` | **Handler Factory** — továrna na event handlery pro DOM. Vytváří callbacky, které při interakci uživatele dispatchují akce. Např. klik na "Rezervovat" → dispatch `RESERVATION_CREATE`. |
| `views/pages/` | **Stránky** — renderovací funkce pro jednotlivé routy SPA. Každá stránka je funkce, která dostane data ze selektorů a handlery z handler factory a vrátí DOM strom. |
| `views/components/` | **Sdílené komponenty** — znovupoužitelné UI prvky (navbar, karty pokojů, modály, formulářové prvky). Čisté funkce vytvářející DOM přes `document.createElement`. |
| `infrastructure/` | **API klient** — `fetch()` wrapper pro komunikaci s backendem. Jediné místo, kde se volá server. Obsahuje `apiClient.js` s metodami `get()`, `post()`, `put()`, `delete()` a interceptory pro JWT tokeny. |
| `rules/` | **Business pravidla** — pojmenované invarianty vynucované na klientu. Např. `RULE_RESERVATION_MAX_DURATION`, `RULE_CHECKIN_BEFORE_CHECKOUT`. Pravidla jsou oddělena od UI a duplikují se s backendem (backend je autoritativní). |
| `router/` | **SPA router** — hash-based navigace (`#/rooms`, `#/login`, `#/my-reservations`). Při změně hash routy renderuje odpovídající stránku. |

Další soubory v kořenu:

| Soubor / Složka | Účel |
|---|---|
| `index.html` | Jediný HTML soubor — vstupní bod SPA. Obsahuje `<div id="app">` a script tagy. |
| `css/style.css` | Styly aplikace (Tailwind CSS nebo vlastní). |
| `assets/images/` | Statické obrázky — fotky pokojů, logo hotelu atd. |
| `js/app.js` | Vstupní bod JS — definice `API_BASE_URL`, inicializace store, routeru a prvního renderu. |

---

## Návrh entit

### ER diagram (textový)

```
                              hotels
                             /      \
                            /        \
                     room_types     rooms ──1:N──> room_images
                                    /    \
                                   /      \
                        room_amenities   reservations ──1:N──> payments
                              |          /          \
                          amenities   users    reservation_guests
                                                     |
                                                   guests
```

### Přehled tabulek (11)

| # | Tabulka | Typ | Popis |
|---|---|---|---|
| 1 | `hotels` | Entita | Hotely v systému |
| 2 | `users` | Entita | Registrovaní uživatelé (USER / ADMIN) |
| 3 | `room_types` | Číselník | Typy pokojů per hotel |
| 4 | `rooms` | Entita | Konkrétní pokoje v hotelu |
| 5 | `room_images` | Detail | Fotky pokojů |
| 6 | `amenities` | Číselník | Vybavení pokojů (WIFI, AC, PARKING…) |
| 7 | `room_amenities` | M:N vazba | Spojení pokojů s vybavením |
| 8 | `reservations` | Entita | Rezervace se stavovým automatem |
| 9 | `payments` | Entita | Platby k rezervacím |
| 10 | `guests` | Entita | Hosté (osoby na pokoji) |
| 11 | `reservation_guests` | M:N vazba | Přiřazení hostů k rezervacím |

---

### Tabulka `hotels` — Hotely

Hotely registrované v systému. Architektura podporuje více hotelů, ale pro semestrálku stačí seedovat jeden.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `name` | VARCHAR(255) | NOT NULL | Název hotelu |
| `description` | TEXT | NULL | Popis hotelu |
| `email` | VARCHAR(255) | NOT NULL | Kontaktní email |
| `phone` | VARCHAR(20) | NULL | Telefon |
| `address_line` | VARCHAR(255) | NOT NULL | Adresa |
| `city` | VARCHAR(100) | NOT NULL | Město |
| `zip` | VARCHAR(20) | NOT NULL | PSČ |
| `country` | VARCHAR(100) | NOT NULL | Země (default "Česká republika") |
| `check_in_from` | TIME | NOT NULL | Nejdřívější check-in (např. 14:00) |
| `check_out_until` | TIME | NOT NULL | Nejpozději check-out (např. 10:00) |
| `created_at` | DATETIME | NOT NULL | Datum vytvoření |
| `updated_at` | DATETIME | NOT NULL | Datum poslední změny |

---

### Tabulka `users` — Uživatelé

Registrovaní uživatelé systému. Role ADMIN je globální (spravuje všechny hotely).

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `email` | VARCHAR(255) | NOT NULL | Unikátní email — login |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashované heslo (bcrypt) |
| `first_name` | VARCHAR(100) | NOT NULL | Křestní jméno |
| `last_name` | VARCHAR(100) | NOT NULL | Příjmení |
| `phone` | VARCHAR(20) | NULL | Telefonní číslo (volitelné) |
| `role` | ENUM('USER', 'ADMIN') | NOT NULL | Role uživatele (default USER) |
| `created_at` | DATETIME | NOT NULL | Datum registrace |
| `updated_at` | DATETIME | NOT NULL | Datum poslední změny |

**Indexy:** `UNIQUE(email)`

---

### Tabulka `room_types` — Typy pokojů (číselník, per hotel)

Číselník typů pokojů definovaný pro každý hotel zvlášť.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `hotel_id` | BIGINT | NOT NULL | FK → `hotels.id` |
| `name` | VARCHAR(50) | NOT NULL | Název typu (Single, Double, Suite, Deluxe) |
| `description` | TEXT | NULL | Popis typu pokoje |
| `max_capacity` | INT | NOT NULL | Výchozí maximální kapacita pro tento typ |
| `base_price` | DECIMAL(10,2) | NOT NULL | Výchozí základní cena za noc |

**Indexy:** `UNIQUE(hotel_id, name)`
**FK:** `fk_room_types_hotels` → `hotels(id)` ON DELETE CASCADE

**Seed data (příklad):** Single (1 os., 1 500 Kč), Double (2 os., 2 500 Kč), Suite (4 os., 5 000 Kč), Deluxe (2 os., 4 000 Kč)

---

### Tabulka `rooms` — Pokoje

Konkrétní pokoje v hotelu. Admin může znepřístupnit pokoj přes `is_active`. Kapacita a cena mohou přepsat výchozí hodnoty z `room_types`.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `hotel_id` | BIGINT | NOT NULL | FK → `hotels.id` |
| `room_type_id` | BIGINT | NOT NULL | FK → `room_types.id` |
| `room_number` | VARCHAR(10) | NOT NULL | Číslo pokoje (např. "101", "205A") |
| `capacity` | INT | NOT NULL | Maximální počet hostů (override z room_types.max_capacity) |
| `price_per_night` | DECIMAL(10,2) | NOT NULL | Cena za noc v CZK (override z room_types.base_price) |
| `description` | TEXT | NULL | Popis pokoje |
| `is_active` | BOOLEAN | NOT NULL | Dostupnost (admin může znepřístupnit — opravy, údržba, default TRUE) |
| `created_at` | DATETIME | NOT NULL | Datum vytvoření záznamu |
| `updated_at` | DATETIME | NOT NULL | Datum poslední změny |

**Indexy:** `UNIQUE(hotel_id, room_number)`, `INDEX(hotel_id)`, `INDEX(room_type_id)`, `INDEX(is_active)`
**FK:**
- `fk_rooms_hotels` → `hotels(id)` ON DELETE CASCADE
- `fk_rooms_room_types` → `room_types(id)` ON DELETE RESTRICT

---

### Tabulka `room_images` — Fotky pokojů

Fotografie přiřazené k pokojům.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `room_id` | BIGINT | NOT NULL | FK → `rooms.id` |
| `image_url` | VARCHAR(500) | NOT NULL | Cesta nebo URL obrázku |
| `is_primary` | BOOLEAN | NOT NULL | Hlavní fotka pokoje (zobrazí se v katalogu) |
| `sort_order` | INT | NOT NULL | Pořadí zobrazení |

**FK:** `fk_room_images_rooms` → `rooms(id)` ON DELETE CASCADE

---

### Tabulka `amenities` — Vybavení (číselník)

Globální číselník vybavení pokojů.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `code` | VARCHAR(50) | NOT NULL | Unikátní kód (WIFI, PARKING, AC, MINIBAR, BALCONY…) |
| `name` | VARCHAR(100) | NOT NULL | Zobrazovaný název |
| `description` | TEXT | NULL | Popis vybavení |

**Indexy:** `UNIQUE(code)`

**Seed data (příklad):** WIFI, PARKING, AC, MINIBAR, BALCONY, TV, SAFE, HAIRDRYER

---

### Tabulka `room_amenities` — Vybavení pokojů (M:N)

Spojovací tabulka — které vybavení má který pokoj.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `room_id` | BIGINT | NOT NULL | FK → `rooms.id` |
| `amenity_id` | BIGINT | NOT NULL | FK → `amenities.id` |

**PK:** `(room_id, amenity_id)` — složený primární klíč
**FK:**
- `fk_room_amenities_rooms` → `rooms(id)` ON DELETE CASCADE
- `fk_room_amenities_amenities` → `amenities(id)` ON DELETE CASCADE

---

### Tabulka `reservations` — Rezervace

Rezervace pokojů vytvořené uživateli. **Entita se stavovým automatem.**

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `user_id` | BIGINT | NOT NULL | FK → `users.id` |
| `room_id` | BIGINT | NOT NULL | FK → `rooms.id` |
| `check_in` | DATE | NOT NULL | Datum příjezdu |
| `check_out` | DATE | NOT NULL | Datum odjezdu |
| `status` | ENUM('PENDING','CONFIRMED','CHECKED_IN','COMPLETED','CANCELLED') | NOT NULL | Stav rezervace (default PENDING) |
| `total_price` | DECIMAL(10,2) | NOT NULL | Celková cena (počet nocí × cena za noc) |
| `note` | TEXT | NULL | Poznámka od uživatele |
| `created_at` | DATETIME | NOT NULL | Datum vytvoření |
| `updated_at` | DATETIME | NOT NULL | Datum poslední změny |

**Indexy:** `INDEX(user_id)`, `INDEX(room_id)`, `INDEX(status)`, `INDEX(check_in, check_out)`
**FK:**
- `fk_reservations_users` → `users(id)` ON DELETE RESTRICT
- `fk_reservations_rooms` → `rooms(id)` ON DELETE RESTRICT

---

### Tabulka `payments` — Platby

Platby přiřazené k rezervacím. Jedna rezervace může mít více plateb (např. neúspěšný pokus + úspěšná platba, nebo refund).

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `reservation_id` | BIGINT | NOT NULL | FK → `reservations.id` |
| `amount` | DECIMAL(10,2) | NOT NULL | Částka |
| `currency` | VARCHAR(3) | NOT NULL | Měna (default CZK) |
| `method` | ENUM('CARD','BANK_TRANSFER','CASH') | NOT NULL | Způsob platby |
| `status` | ENUM('PENDING','PAID','FAILED','REFUNDED') | NOT NULL | Stav platby (default PENDING) |
| `paid_at` | DATETIME | NULL | Datum zaplacení (NULL dokud není PAID) |
| `provider_ref` | VARCHAR(100) | NULL | Reference z platební brány |
| `created_at` | DATETIME | NOT NULL | Datum vytvoření |
| `updated_at` | DATETIME | NOT NULL | Datum poslední změny |

**Indexy:** `INDEX(reservation_id)`, `INDEX(status)`, `INDEX(reservation_id, status)`
**FK:** `fk_payments_reservations` → `reservations(id)` ON DELETE RESTRICT

---

### Tabulka `guests` — Hosté

Osoby ubytované v rámci rezervace. Oddělená entita od `users` — host nemusí být registrovaný uživatel.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `id` | BIGINT AUTO_INCREMENT | NOT NULL | PK |
| `first_name` | VARCHAR(100) | NOT NULL | Křestní jméno |
| `last_name` | VARCHAR(100) | NOT NULL | Příjmení |
| `email` | VARCHAR(255) | NULL | Email (volitelný) |
| `phone` | VARCHAR(20) | NULL | Telefon (volitelný) |
| `birth_date` | DATE | NULL | Datum narození (volitelné) |
| `created_at` | DATETIME | NOT NULL | Datum vytvoření |
| `updated_at` | DATETIME | NOT NULL | Datum poslední změny |

---

### Tabulka `reservation_guests` — Hosté na rezervaci (M:N)

Spojovací tabulka — kteří hosté jsou přiřazeni ke které rezervaci.

| Sloupec | Typ | Nullable | Popis |
|---|---|---|---|
| `reservation_id` | BIGINT | NOT NULL | FK → `reservations.id` |
| `guest_id` | BIGINT | NOT NULL | FK → `guests.id` |
| `is_primary` | BOOLEAN | NOT NULL | Hlavní host na rezervaci (default FALSE) |

**PK:** `(reservation_id, guest_id)` — složený primární klíč
**FK:**
- `fk_reservation_guests_reservations` → `reservations(id)` ON DELETE CASCADE
- `fk_reservation_guests_guests` → `guests(id)` ON DELETE CASCADE

---

## Stavový automat rezervace

Entita `Reservation` má definovaný stavový automat s povolenými přechody:

```
                         ┌──────────────┐
                         │   PENDING    │  ← Vytvořena uživatelem
                         └──────┬───────┘
                                │
                   ┌────────────┼────────────┐
                   │                         │
                   ▼                         ▼
          ┌────────────────┐       ┌─────────────────┐
          │   CONFIRMED    │       │    CANCELLED     │  ← Zrušena uživatelem/adminem
          └───────┬────────┘       └─────────────────┘
                  │                         ▲
                  ▼                         │
          ┌────────────────┐                │
          │   CHECKED_IN   │ ───────────────┘  (výjimečně — předčasný odjezd)
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │   COMPLETED    │  ← Host se odhlásil, pobyt ukončen
          └────────────────┘
```

**Povolené přechody:**

| Z stavu | Na stav | Kdo | Kdy |
|---|---|---|---|
| PENDING | CONFIRMED | Admin | Potvrzení rezervace |
| PENDING | CANCELLED | User / Admin | Zrušení před potvrzením |
| CONFIRMED | CHECKED_IN | Admin | Host se ubytoval |
| CONFIRMED | CANCELLED | User / Admin | Zrušení potvrzené rezervace |
| CHECKED_IN | COMPLETED | Admin | Host se odhlásil |
| CHECKED_IN | CANCELLED | Admin | Předčasné ukončení pobytu |

**Koncové stavy:** COMPLETED, CANCELLED — žádné další přechody nejsou povoleny.

---

## Stavový automat platby

Entita `Payment` má vlastní stavový automat:

```
    ┌──────────────┐
    │   PENDING    │  ← Platba vytvořena
    └──────┬───────┘
           │
      ┌────┼────┐
      │         │
      ▼         ▼
 ┌─────────┐  ┌─────────┐
 │  PAID   │  │ FAILED  │
 └────┬────┘  └─────────┘
      │
      ▼
 ┌──────────┐
 │ REFUNDED │  ← Vrácení peněz (při zrušení rezervace)
 └──────────┘
```

**Povolené přechody:**

| Z stavu | Na stav | Kdy |
|---|---|---|
| PENDING | PAID | Platba úspěšně provedena |
| PENDING | FAILED | Platba se nezdařila |
| PAID | REFUNDED | Vrácení peněz (zrušení rezervace) |

---

## Business pravidla

Pojmenovaná pravidla vynucovaná na backendu (autoritativní) i na frontendu (UX).

### Rezervace

| Pravidlo | Popis |
|---|---|
| `RULE_CHECKIN_BEFORE_CHECKOUT` | Datum check-in musí být striktně před datem check-out. |
| `RULE_CHECKIN_NOT_IN_PAST` | Datum check-in nesmí být v minulosti. |
| `RULE_RESERVATION_MAX_DURATION` | Maximální délka pobytu je 30 nocí. |
| `RULE_ROOM_NOT_DOUBLE_BOOKED` | Pokoj nesmí mít překrývající se potvrzené/aktivní rezervace ve stejném termínu. |
| `RULE_ROOM_MUST_BE_ACTIVE` | Rezervaci lze vytvořit pouze na aktivní pokoj (`is_active = true`). |
| `RULE_GUEST_COUNT_WITHIN_CAPACITY` | Počet hostů (z `reservation_guests`) nesmí překročit kapacitu pokoje. |
| `RULE_ONLY_OWNER_CAN_CANCEL` | Uživatel může zrušit pouze své vlastní rezervace (admin může všechny). |
| `RULE_CANCEL_ONLY_PENDING_OR_CONFIRMED` | Uživatel může zrušit rezervaci pouze ve stavu PENDING nebo CONFIRMED. |
| `RULE_STATUS_TRANSITION_VALID` | Změna stavu rezervace musí respektovat stavový automat. |

### Uživatelé

| Pravidlo | Popis |
|---|---|
| `RULE_EMAIL_UNIQUE` | Email uživatele musí být unikátní v celém systému. |
| `RULE_PASSWORD_MIN_LENGTH` | Heslo musí mít minimálně 8 znaků. |

### Platby

| Pravidlo | Popis |
|---|---|
| `RULE_PAYMENT_AMOUNT_POSITIVE` | Částka platby musí být kladná. |
| `RULE_PAYMENT_TRANSITION_VALID` | Změna stavu platby musí respektovat stavový automat. |
| `RULE_REFUND_ONLY_PAID` | Vrácení peněz (REFUNDED) je možné pouze u zaplacených plateb (PAID). |

---

## API endpointy (návrh)

### Auth

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| POST | `/api/auth/register` | Registrace nového uživatele | Veřejný |
| POST | `/api/auth/login` | Přihlášení — vrátí JWT token | Veřejný |

### Hotely

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| GET | `/api/hotels` | Seznam hotelů | Veřejný |
| GET | `/api/hotels/{id}` | Detail hotelu | Veřejný |

### Pokoje

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| GET | `/api/rooms` | Seznam dostupných pokojů (filtr, stránkování) | Veřejný |
| GET | `/api/rooms/{id}` | Detail pokoje (vč. amenities a obrázků) | Veřejný |
| POST | `/api/rooms` | Vytvoření pokoje | Admin |
| PUT | `/api/rooms/{id}` | Úprava pokoje | Admin |
| PATCH | `/api/rooms/{id}/active` | Aktivace / deaktivace pokoje | Admin |

### Rezervace

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| POST | `/api/reservations` | Vytvoření rezervace | User |
| GET | `/api/reservations/my` | Moje rezervace (historie + aktuální) | User |
| GET | `/api/reservations/{id}` | Detail rezervace | User (vlastní) / Admin |
| PATCH | `/api/reservations/{id}/cancel` | Zrušení rezervace | User (vlastní) / Admin |
| GET | `/api/reservations` | Všechny rezervace (admin přehled) | Admin |
| PATCH | `/api/reservations/{id}/status` | Změna stavu rezervace | Admin |

### Platby

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| POST | `/api/reservations/{id}/payments` | Vytvoření platby k rezervaci | User |
| GET | `/api/reservations/{id}/payments` | Platby k rezervaci | User (vlastní) / Admin |
| PATCH | `/api/payments/{id}/status` | Změna stavu platby | Admin |

### Hosté

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| POST | `/api/reservations/{id}/guests` | Přidání hosta k rezervaci | User (vlastní) / Admin |
| GET | `/api/reservations/{id}/guests` | Seznam hostů na rezervaci | User (vlastní) / Admin |
| DELETE | `/api/reservations/{resId}/guests/{guestId}` | Odebrání hosta z rezervace | User (vlastní) / Admin |

### Uživatelé

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| GET | `/api/users/me` | Můj profil | User |
| PUT | `/api/users/me` | Úprava profilu | User |
| PUT | `/api/users/me/password` | Změna hesla | User |
| GET | `/api/users` | Seznam uživatelů | Admin |
| DELETE | `/api/users/{id}` | Smazání uživatele | Admin |

### Číselníky

| Metoda | Endpoint | Popis | Role |
|---|---|---|---|
| GET | `/api/room-types` | Seznam typů pokojů | Veřejný |
| GET | `/api/amenities` | Seznam vybavení | Veřejný |

---

## Databázové objekty (povinné dle zadání)

| Objekt | Návrh |
|---|---|
| **VIEW** | `v_active_reservations` — přehled aktuálních rezervací s join na uživatele, pokoje a hotely. |
| **FUNCTION** | `fn_calculate_total_price(room_id, check_in, check_out)` — výpočet celkové ceny z počtu nocí a ceny pokoje. |
| **PROCEDURE** | `sp_cancel_expired_reservations()` — zrušení PENDING rezervací starších než X dní. |
| **TRIGGER** | `trg_reservation_updated_at` — automatická aktualizace `updated_at` při UPDATE záznamu. |
| **Transakce** | Vytvoření rezervace — kontrola dostupnosti + insert v rámci jedné transakce s rollbackem při kolizi. |
| **DB uživatel** | `app_user` s omezenými právy (SELECT, INSERT, UPDATE, DELETE na aplikační tabulky — bez DROP, ALTER, GRANT). |
