# Databázové migrace — Flyway

Flyway je nástroj pro správu verzí databáze. Funguje podobně jako Git, ale pro schéma databáze — každá změna je uložena jako číslovaný SQL soubor a Flyway zajistí, že se všechny změny aplikují ve správném pořadí.

---

## Kde jsou migrace uloženy

```
reservations-server/src/main/resources/db/migration/
├── V1__create_hotels_table.sql
├── V2__create_room_types_table.sql
└── ...
```

---

## Pojmenování souborů

```
V{číslo}__{popis}.sql
```

- `V` musí být velké
- číslo verze je celé číslo (1, 2, 3, ...)
- **dvě** podtržítka `__` (ne jedno)
- popis snake_case
- přípona `.sql`

Příklady:
```
V3__create_rooms_table.sql
V4__create_room_images_table.sql
V13__add_rating_to_hotels.sql
```

---

## Jak Flyway funguje

Při každém spuštění aplikace Flyway:

1. Podívá se do složky `db/migration`
2. Porovná soubory s tabulkou `flyway_schema_history` v databázi
3. Spustí všechny migrace, které ještě nebyly aplikovány (v pořadí podle čísla)

Tabulka `flyway_schema_history` si pamatuje pro každou migraci její **checksum** (hash obsahu souboru).

---

## Zlaté pravidlo

> **Nikdy neupravuj soubor migrace, která už byla spuštěna.**

Pokud soubor změníš, Flyway při příštím startu detekuje rozdílný checksum a aplikace **spadne**:

```
FlywayException: Validate failed: Migration checksum mismatch for migration version 2
```

### Chceš změnit něco v existující tabulce? → Nová migrace

```sql
-- V13__add_rating_to_hotels.sql
ALTER TABLE hotels ADD COLUMN rating TINYINT UNSIGNED NULL;
```

---

## Práce ve dvou — jak se vyhnout konfliktům

Největší past při práci ve dvou je kolize čísel verzí — oba vytvoříte `V5__...sql` a vznikne problém.

**Řešení — domluvený rozsah čísel:**

| Developer | Rozsah |
|---|---|
| Dev 1 (Room catalog) | V2 – V6 |
| Dev 2 (Booking flow) | V7 – V12 |

Přidávejte vždy do svého rozsahu. Pokud jeden z rozsahů dojde, domluvte se na rozšíření.

---

## Pořadí migrací v tomto projektu

Tabulky s cizím klíčem (FK) musí být vytvořeny **po** tabulkách, na které odkazují.

```
V1  hotels                    ← žádné závislosti
V2  room_types                ← FK → hotels
V3  rooms                     ← FK → hotels, room_types
V4  room_images               ← FK → rooms
V5  amenities                 ← žádné závislosti
V6  room_amenities            ← FK → rooms, amenities
V7  users                     ← žádné závislosti
V8  guests                    ← žádné závislosti
V9  reservations              ← FK → users, rooms
V10 payments                  ← FK → reservations
V11 reservation_guests        ← FK → reservations, guests
V12 views_functions_procedures
```

---

## Lokální vývoj — reset databáze

Pokud ještě nemáte sdílenou databázi na serveru a potřebuješ upravit již spuštěnou migraci, lze databázi smazat a nechat Flyway vše aplikovat znovu od začátku. Checksum se tím resetuje.

**Pozor:** Toto funguje pouze lokálně. Jakmile databázi používá i někdo jiný nebo běží na serveru, reset není možný bez ztráty dat.

---

## Struktura SQL souboru

Vzor pro vytvoření tabulky:

```sql
CREATE TABLE IF NOT EXISTS nazev_tabulky (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nazev_fk    BIGINT          NOT NULL,
    text_pole   VARCHAR(100)    NOT NULL,
    volitelne   TEXT            NULL,
    cislo       TINYINT UNSIGNED NOT NULL,
    cena        DECIMAL(10,2)   NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_nazev       UNIQUE (nazev_fk, text_pole),
    CONSTRAINT fk_nazev_table FOREIGN KEY (nazev_fk) REFERENCES jina_tabulka(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Cizí klíče (FK) — syntaxe

FK se **nedefinuje inline** na sloupci, ale jako samostatný `CONSTRAINT` na konci tabulky:

```sql
-- ❌ Špatně (neplatná MySQL syntaxe)
hotel_id BIGINT FOREIGN KEY,

-- ✅ Správně
hotel_id BIGINT NOT NULL,
CONSTRAINT fk_room_types_hotels FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
```

**ON DELETE akce:**

| Akce | Chování |
|---|---|
| `CASCADE` | smaže závislé záznamy automaticky |
| `RESTRICT` | zakáže smazání rodiče pokud má potomky |
| `SET NULL` | nastaví FK na NULL (sloupec musí být nullable) |
