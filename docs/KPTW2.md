# Algone Reservations — Dokumentace KPTW2

Stručná uživatelská i vývojářská dokumentace frontendové části hotelového rezervačního systému **Algone Reservations**.

---

## Obsah

1. [Architektonický popis](#1-architektonický-popis)
2. [Business entity](#2-business-entity)
3. [Stavové automaty](#3-stavové-automaty)
4. [Role a scénáře](#4-role-a-scénáře)
5. [Práce s kontraktem (REST API)](#5-práce-s-kontraktem-rest-api)
6. [Testovací scénáře](#6-testovací-scénáře)

---

## 1. Architektonický popis

Frontend je **vanilla JS SPA** (Single Page Application) bez frameworku, postavená na vlastním unidirekcionálním datovém toku inspirovaném Redux/Flux architekturou. Komunikuje s backendem (Spring Boot REST API) přes JSON přes `fetch()`.

### Klíčové vlastnosti

- **Žádný framework** — pouze nativní DOM API + ES modules.
- **Jediný zdroj pravdy** — globální `store` se stavem celé aplikace.
- **Immutabilní stav** — každá změna vytváří nový stavový objekt.
- **Jednosměrný tok dat** — `Action → Store → Render → View → Handler → Action`.
- **Hash-based routing** — `#/hotels`, `#/hotels/:id/rooms`, `#/admin/...`.
- **JWT autentizace** — token uložený v `state.auth`, posílaný v hlavičce `Authorization: Bearer ...`.

### Struktura projektu

```
reservations-front/
├── index.html              # vstupní HTML s <div id="app">
├── css/style.css           # styly (Tailwind + vlastní)
├── assets/                 # obrázky
└── js/
    ├── app.js              # entry point — drátuje store, dispatcher, render
    ├── state/state.js      # výchozí stav aplikace
    ├── infrastructure/
    │   ├── createStore.js  # generický store (getState / setState / subscribe)
    │   └── apiClient.js    # fetch wrapper (get/post/put/patch/del)
    ├── router/router.js    # URL hash → akce
    ├── dispatcher/         # centrální switch akcí → action funkce
    ├── actions/            # logika akcí (API + state update)
    ├── selectors/          # state → viewState
    ├── handlers/           # viewState + dispatch → callbacky pro view
    └── views/
        ├── render.js       # orchestrátor renderu
        ├── pages/          # stránky (HotelListView, ReservationCreateView, …)
        └── components/     # znovupoužitelné prvky (Layout, ErrorView, …)
```

### Tok dat

```
Uživatel klikne / změní URL
        │
        ▼
    Router       ── URL → akce
        │
        ▼
    Dispatcher   ── routuje akci na action funkci
        │
        ▼
    Action       ── volá API, mění stav přes store.setState
        │
        ▼
    Store        ── notifikuje subscribery (render)
        │
        ▼
    Selectors    ── stav → viewState (čistá data pro UI)
        │
        ▼
    Handlers     ── viewState + dispatch → onClick/onSubmit callbacky
        │
        ▼
    Views        ── viewState + handlers → DOM
```

### Hlavní vrstvy

| Vrstva | Role |
|---|---|
| **Store** | Globální stav + subscribe/notify (`infrastructure/createStore.js`). |
| **State** | Definice výchozí struktury stavu (`state/state.js`). |
| **Router** | Mapuje URL na akce typu `ENTER_*`. |
| **Dispatcher** | Tenký switch — přijme akci a deleguje na action funkci. |
| **Actions** | Logika — volá API, mění stav, dispatchuje další akce. |
| **Selectors** | Čisté funkce — extrahují z globálního stavu data pro konkrétní view (`viewState`). |
| **Handlers** | Vytváří callbacky, které při interakci dispatchují akce. |
| **Views** | Funkce vytvářející DOM — bez logiky, bez API volání, bez znalosti store. |
| **API Client** | Wrapper nad `fetch()` — jediné místo komunikace se serverem. |

Detailní popis každé vrstvy je v [`FRONTEND_STRUCTURE.md`](FRONTEND_STRUCTURE.md).

---

## 2. Business entity

Frontend pracuje s následujícími doménovými entitami (autoritativní popis viz [`ARCHITECTURE.md`](ARCHITECTURE.md)):

| Entita | Popis | Klíčová pole na FE |
|---|---|---|
| **Hotel** | Hotel v systému (název, adresa, kontakty, časy check-in/out). | `id`, `name`, `description`, `addressLine`, `city`, `checkInFrom`, `checkOutUntil` |
| **User** | Registrovaný uživatel s rolí (USER / ADMIN). | `id`, `email`, `firstName`, `lastName`, `phone`, `role` |
| **RoomType** | Typ pokoje per hotel (Single, Double, Suite, …). | `id`, `name`, `maxCapacity`, `basePrice` |
| **Room** | Konkrétní pokoj v hotelu. | `id`, `roomNumber`, `capacity`, `pricePerNight`, `isActive`, `amenities[]` |
| **Amenity** | Vybavení pokoje (WIFI, AC, PARKING, …). | `id`, `code`, `name` |
| **Reservation** | Rezervace pokoje uživatelem. **Entita se stavovým automatem.** | `id`, `userId`, `roomId`, `checkIn`, `checkOut`, `status`, `totalPrice`, `note` |
| **Payment** | Platba k rezervaci. **Entita se stavovým automatem.** | `id`, `reservationId`, `amount`, `method`, `status`, `paidAt` |
| **SpecialRequestType** | Číselník typů speciálních požadavků (EXTRA_BED, LATE_CHECKOUT, …). | `id`, `code`, `name` |
| **ReservationSpecialRequest** | Speciální požadavek navázaný na rezervaci. | `id`, `reservationId`, `specialRequestTypeId`, `note` |

### Mapování entit do stavu

Globální stav (`state/state.js`) drží entity v těchto klíčích:

```javascript
{
  hotels: [],                  // všechny hotely
  selectedHotel: null,         // detail aktuálně otevřeného hotelu
  rooms: [],                   // pokoje aktuálního hotelu (výsledek filtru)
  availableRoomTypes: [],      // typy pokojů odvozené z aktuálního výsledku
  userProfile: null,           // profil přihlášeného uživatele
  myReservations: [],          // rezervace přihlášeného uživatele
  reservationDraft: null,      // rozpracovaná rezervace (formulář)
  selectedReservationPayments: [],
  selectedReservationId: null,

  admin: {
    reservations: [],          // všechny rezervace (admin)
    users: [],                 // všichni uživatelé (admin)
    rooms: [],                 // pokoje napříč hotely (admin)
    selectedRoom: null,        // pokoj v admin formuláři
    roomTypes: [],
    amenities: [],
    roomFormMode: 'CREATE',    // CREATE | EDIT
    roomHotelFilter: 'ALL',
    reservationStatusFilter: 'ALL',
  },

  auth: { role, userId, token, email, firstName, lastName },

  ui: {
    mode,         // aktuální "stránka" (HOTEL_LIST, ROOM_LIST, …)
    status,       // LOADING | READY | ERROR
    selectedHotelId, errorMessage, notification, loginError, registerError,
    isSubmitting, returnAction, roomsLoading, roomsError, adminError,
    roomFilters: { checkIn, checkOut, capacity, maxPrice, roomTypeId, amenityCodes },
  },
}
```

---

## 3. Stavové automaty

Frontend vizualizuje a respektuje dva business stavové automaty (autoritativní vynucení je na backendu):

### 3.1 Stavový automat rezervace

```
                         ┌──────────────┐
                         │   PENDING    │  ← Vytvořena uživatelem
                         └──────┬───────┘
                                │
                   ┌────────────┼────────────┐
                   │                         │
                   ▼                         ▼
          ┌────────────────┐       ┌─────────────────┐
          │   CONFIRMED    │       │    CANCELLED    │
          └───────┬────────┘       └─────────────────┘
                  │                         ▲
                  ▼                         │
          ┌────────────────┐                │
          │   CHECKED_IN   │ ───────────────┘  (předčasné ukončení)
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │   COMPLETED    │  ← Pobyt ukončen
          └────────────────┘
```

**Povolené přechody:**

| Z | Na | Kdo | Kdy |
|---|---|---|---|
| PENDING | CONFIRMED | Admin | Potvrzení rezervace |
| PENDING | CANCELLED | User / Admin | Zrušení před potvrzením |
| CONFIRMED | CHECKED_IN | Admin | Host se ubytoval |
| CONFIRMED | CANCELLED | User / Admin | Zrušení potvrzené rezervace |
| CHECKED_IN | COMPLETED | Admin | Host se odhlásil |
| CHECKED_IN | CANCELLED | Admin | Předčasné ukončení |

**Koncové stavy:** `COMPLETED`, `CANCELLED`.

**Projevy na FE:**
- Uživateli zobrazuje tlačítko *Zrušit rezervaci* pouze pro stavy `PENDING` / `CONFIRMED` (akce `CANCEL_RESERVATION`).
- Admin v `AdminReservationsView` volí další stav z povolené množiny → `CHANGE_RESERVATION_STATUS`.

### 3.2 Stavový automat platby

```
    ┌──────────────┐
    │   PENDING    │  ← Vytvořena
    └──────┬───────┘
           │
      ┌────┴────┐
      ▼         ▼
 ┌─────────┐  ┌─────────┐
 │  PAID   │  │ FAILED  │
 └────┬────┘  └─────────┘
      │
      ▼
 ┌──────────┐
 │ REFUNDED │
 └──────────┘
```

**Povolené přechody:**

| Z | Na | Kdy |
|---|---|---|
| PENDING | PAID | Platba úspěšně provedena |
| PENDING | FAILED | Platba se nezdařila |
| PAID | REFUNDED | Vrácení peněz (např. při zrušení rezervace) |

**Projevy na FE:**
- `ReservationPaymentsView` zobrazuje stavy plateb, uživatel tvoří novou platbu přes `CREATE_PAYMENT` (vždy začíná v `PENDING`).
- Admin přepíná stavy plateb přes `CHANGE_PAYMENT_STATUS`.

### 3.3 UI stavový automat (status obrazovky)

Každá stránka prochází třemi UI stavy:

```
LOADING ──► READY ──► (uživatelská interakce)
   │
   └──► ERROR (zobrazí ErrorView s tlačítkem „Pokračovat")
```

`ui.mode` přepíná mezi stránkami (`HOTEL_LIST`, `HOTEL_DETAIL`, `ROOM_LIST`, `LOGIN`, `REGISTER`, `MY_RESERVATIONS`, `RESERVATION_CREATE`, `RESERVATION_PAYMENTS`, `USER_DETAIL`, `USER_EDIT_*`, `ADMIN_DASHBOARD`, `ADMIN_RESERVATIONS`, `ADMIN_USERS`, `ADMIN_ROOMS`, `ADMIN_ROOM_FORM`).

---

## 4. Role a scénáře

### Role v aplikaci

| Role | Popis | Typické akce |
|---|---|---|
| **ANONYMOUS** | Nepřihlášený návštěvník. | Prohlížení hotelů a pokojů, registrace, přihlášení. |
| **USER** | Přihlášený host. | Vytváření a zrušení vlastních rezervací, platby, úprava profilu/hesla/emailu. |
| **ADMIN** | Administrátor. | Správa všech rezervací, uživatelů, pokojů; změna stavů rezervací i plateb. Nemůže rezervovat (`RULE_ADMIN_CANNOT_RESERVE`). |

Role je držena v `state.auth.role` a aktivuje se po úspěšném loginu — autoritativně rozhoduje server (token), FE pouze přizpůsobuje UI.

### Hlavní scénáře

#### S1 — Vyhledání pokoje a rezervace (USER)

1. Otevře `#/hotels` → vidí seznam hotelů.
2. Klikne na detail → `#/hotels/:id` → načte se `HOTEL_DETAIL` se sidebarem filtrů.
3. Vyplní filtry (datumy, kapacita, typ, vybavení) → odeslání spustí akci `ENTER_ROOM_LIST` s filtry.
4. V `ROOM_LIST` vidí dostupné pokoje. Může filtry dál upravovat (`ROOM_SEARCH`).
5. U pokoje klikne *Rezervovat* → pokud není přihlášený, redirect na `#/login` s uloženým `returnAction`.
6. Po loginu pokračuje na `RESERVATION_CREATE` (formulář s předvyplněnými daty).
7. Submit → `SUBMIT_RESERVATION` → `POST /api/reservations` → rezervace vytvořena ve stavu `PENDING`.
8. Přesměrování do `MY_RESERVATIONS`.

#### S2 — Platba rezervace (USER)

1. V `MY_RESERVATIONS` klikne na *Platby* u konkrétní rezervace.
2. `ENTER_RESERVATION_PAYMENTS` → načte platby přes `GET /api/reservations/{id}/payments`.
3. Vyplní novou platbu (částka, metoda) → `CREATE_PAYMENT` → `POST /api/reservations/{id}/payments`.
4. Platba je vytvořena ve stavu `PENDING`; admin ji následně přepne na `PAID`/`FAILED`.

#### S3 — Zrušení rezervace (USER)

1. V `MY_RESERVATIONS` u rezervace ve stavu `PENDING` nebo `CONFIRMED` klikne *Zrušit*.
2. `CANCEL_RESERVATION` → `PATCH /api/reservations/{id}/cancel`.
3. Stav rezervace přejde na `CANCELLED`, seznam se aktualizuje.

#### S4 — Registrace + přihlášení

1. `#/register` → vyplní email, heslo, jméno, příjmení → `REGISTER_SUBMIT`.
2. Po úspěchu auto-login → token uložen do `state.auth`, redirect na `#/hotels` (nebo `returnAction`).
3. Alternativně `#/login` → `LOGIN_SUBMIT` → načte profil.

#### S5 — Správa profilu (USER)

1. Z menu *Profil* → `USER_DETAIL` (`GET /api/users/me`).
2. Editace přes podstránky `USER_EDIT_PROFILE` / `USER_EDIT_EMAIL` / `USER_EDIT_PASSWORD`.
3. Submit → `UPDATE_PROFILE` / `UPDATE_EMAIL` / `UPDATE_PASSWORD` → `PUT /api/users/me*`.

#### S6 — Admin: změna stavu rezervace

1. Admin → `#/admin/reservations` → `ENTER_ADMIN_RESERVATIONS` (`GET /api/reservations`).
2. Filtr podle stavu (`reservationStatusFilter`).
3. U rezervace vybere nový stav z povolené množiny dle stavového automatu → `CHANGE_RESERVATION_STATUS` → `PATCH /api/reservations/{id}/status`.

#### S7 — Admin: správa pokojů

1. `#/admin/rooms` → seznam s filtrem podle hotelu.
2. Nový pokoj: `#/admin/rooms/new` → `ADMIN_ROOM_FORM` (mode CREATE).
3. Úprava: `#/admin/rooms/:id/edit` → `ADMIN_ROOM_FORM` (mode EDIT) — formulář předvyplněný.
4. Submit → `SUBMIT_ROOM` → `POST /api/rooms` / `PUT /api/rooms/{id}`.
5. Deaktivace pokoje (např. pro údržbu) → `TOGGLE_ROOM_ACTIVE` → `PATCH /api/rooms/{id}/active`.

#### S8 — Admin: správa uživatelů a plateb

1. `#/admin/users` → seznam, smazání uživatele (`DELETE_USER` → `DELETE /api/users/{id}`).
2. Na platbách rezervace (`#/admin/payments/:reservationId`) admin přepíná stav → `CHANGE_PAYMENT_STATUS` → `PATCH /api/payments/{id}/status`.

---

## 5. Práce s kontraktem (REST API)

Frontend a backend jsou vázány **REST kontraktem** popsaným v [`ARCHITECTURE.md`](ARCHITECTURE.md) (sekce *API endpointy*). Backend je **autoritativní zdroj pravdy** — FE pouze duplikuje business pravidla pro lepší UX.

### Princip komunikace

- Veškerá komunikace prochází přes **jediný modul** [`infrastructure/apiClient.js`](../reservations-front/js/infrastructure/apiClient.js).
- Base URL je centralizovaná: `const API_BASE_URL = 'http://localhost:8080/api'`.
- API client poskytuje pět metod: `get`, `post`, `put`, `patch`, `del` — vše vrací stejně tvarovaný objekt.

### Tvar odpovědi (Response Pattern)

Kontrakt s backendem je definován jednoduchým pravidlem:

| Vrstva | Co posílá / co dostává |
|---|---|
| **Backend** | Čistá data přes `ResponseEntity`. HTTP status kód je zdroj pravdy (200/201/404/...). Chyby jako body `{ "message": "..." }`. |
| **API Client** | Z HTTP odpovědi vytvoří objekt `{ status: 'SUCCESS', ...data }` nebo `{ status: 'REJECTED', reason: '...' }`. |
| **Actions** | Vždy kontrolují `result.status`. Při `SUCCESS` aktualizují stav, při `REJECTED` nastaví chybový stav v `ui`. |

Příklad volání v action funkci:

```javascript
const result = await api.get('/hotels');

if (result.status !== 'SUCCESS') {
  store.setState(state => ({
    ...state,
    ui: { ...state.ui, status: 'ERROR', errorMessage: result.reason },
  }));
  return;
}

store.setState(state => ({
  ...state,
  hotels: result.hotels,   // kolekce přichází v pojmenovaném poli
  ui: { ...state.ui, status: 'READY' },
}));
```

### Konvence kontraktu

| Co | Jak |
|---|---|
| **Kolekce** | Balené v pojmenovaném objektu — `{ "hotels": [...] }`, `{ "rooms": [...] }`. |
| **Jednotlivá entita** | Holé DTO — `{ "id": 1, "name": "...", ... }`. |
| **Chyba** | HTTP 4xx/5xx + body `{ "message": "popis" }`. |
| **Autentizace** | JWT v hlavičce `Authorization: Bearer <token>`, token v `state.auth.token`. |
| **Query parametry** | Stavějí se v action funkci přes `URLSearchParams`, pole jako `?amenities=WIFI&amenities=AC`. |

### Hlavní endpointy používané frontendem

| Endpoint | Metoda | Akce na FE | Role |
|---|---|---|---|
| `/api/auth/register` | POST | `REGISTER_SUBMIT` | Veřejný |
| `/api/auth/login` | POST | `LOGIN_SUBMIT` | Veřejný |
| `/api/hotels` | GET | `APP_INIT` | Veřejný |
| `/api/hotels/{id}` | GET | `ENTER_HOTEL_DETAIL` | Veřejný |
| `/api/rooms` | GET | `ENTER_ROOM_LIST`, `ROOM_SEARCH` | Veřejný |
| `/api/rooms` | POST/PUT | `SUBMIT_ROOM` | Admin |
| `/api/rooms/{id}/active` | PATCH | `TOGGLE_ROOM_ACTIVE` | Admin |
| `/api/reservations` | POST | `SUBMIT_RESERVATION` | User |
| `/api/reservations/my` | GET | `ENTER_MY_RESERVATIONS` | User |
| `/api/reservations/{id}/cancel` | PATCH | `CANCEL_RESERVATION` | User/Admin |
| `/api/reservations` | GET | `ENTER_ADMIN_RESERVATIONS` | Admin |
| `/api/reservations/{id}/status` | PATCH | `CHANGE_RESERVATION_STATUS` | Admin |
| `/api/reservations/{id}/payments` | GET/POST | `ENTER_RESERVATION_PAYMENTS`, `CREATE_PAYMENT` | User/Admin |
| `/api/payments/{id}/status` | PATCH | `CHANGE_PAYMENT_STATUS` | Admin |
| `/api/users/me` | GET/PUT | `ENTER_USER_DETAIL`, `UPDATE_PROFILE` | User |
| `/api/users/me/password` | PUT | `UPDATE_PASSWORD` | User |
| `/api/users` | GET | `ENTER_ADMIN_USERS` | Admin |
| `/api/users/{id}` | DELETE | `DELETE_USER` | Admin |

### Vrstva business pravidel

FE duplikuje vybraná pravidla z `RULE_*` kontraktu (viz `ARCHITECTURE.md`) přímo ve formulářích — např.:

- `RULE_CHECKIN_BEFORE_CHECKOUT`, `RULE_CHECKIN_NOT_IN_PAST` — validace v `ReservationCreateView`.
- `RULE_PASSWORD_MIN_LENGTH` — validace v registračním a změna-hesla formuláři.
- `RULE_CANCEL_ONLY_PENDING_OR_CONFIRMED` — FE nezobrazí tlačítko *Zrušit* mimo tyto stavy.

Pokud FE validace selže, akce se nevolá. Pokud projde, ale BE pravidlo zamítne, vrátí se `REJECTED` s `reason` → uživateli zobrazí chybovou hlášku.

---

## 6. Testovací scénáře

Frontend nemá samostatnou test suite — testování probíhá **manuálně** přes scénáře proti běžícímu BE + DB (Docker Compose). Níže jsou hlavní akceptační scénáře (golden path + edge cases).

### TC-01 — Načtení seznamu hotelů (anonymní uživatel)

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | Otevři `http://localhost:3000/#/hotels` | LOADING → READY, zobrazí se seznam hotelů |
| 2 | Klikni na hotel | Přejde na `#/hotels/:id`, zobrazí detail + sidebar s filtry |

**Edge case:** Backend down → zobrazí se `ErrorView` s tlačítkem *Pokračovat*.

### TC-02 — Vyhledávání pokojů s filtry

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | Na `HOTEL_DETAIL` vyplň `checkIn` < `checkOut`, kapacitu 2, vybavení WIFI | Po submit přechod na `ROOM_LIST` se seznamem volných pokojů |
| 2 | Na `ROOM_LIST` změň filtry a klikni *Hledat* | `roomsLoading: true` → výsledek se aktualizuje bez změny stránky |
| 3 | Nastav `maxPrice` velmi nízko | Prázdný seznam + hláška *Žádné pokoje neodpovídají filtrům* |

**Edge case:** `checkIn` v minulosti → FE validace zabrání submitu.

### TC-03 — Registrace nového uživatele

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | `#/register`, vyplň všechny pole, heslo ≥ 8 znaků | Submit → server vrátí token, FE auto-login, redirect na `#/hotels` |
| 2 | Pokus o registraci s existujícím emailem | BE vrátí 409 + `message` → `registerError` zobrazí v UI |
| 3 | Heslo kratší než 8 znaků | FE validace zablokuje submit |

### TC-04 — Vytvoření rezervace (USER)

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | Vyhledej pokoj a klikni *Rezervovat* (přihlášený) | Přechod na `RESERVATION_CREATE` s předvyplněnými daty |
| 2 | Klikni *Potvrdit* | `POST /api/reservations` → rezervace ve stavu PENDING, redirect na `MY_RESERVATIONS` |
| 3 | Pokus o rezervaci stejného pokoje na překrývající se termín | BE vrátí chybu (`RULE_ROOM_NOT_DOUBLE_BOOKED`) → zobrazí se hláška |

**Edge case:** *Rezervovat* z anonymní role → uloží se `returnAction`, redirect na login, po loginu pokračuje.

### TC-05 — Zrušení rezervace

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | V `MY_RESERVATIONS` u rezervace ve stavu PENDING klikni *Zrušit* | Stav přejde na CANCELLED, řádek se aktualizuje |
| 2 | U rezervace ve stavu COMPLETED | Tlačítko *Zrušit* se nezobrazí (RULE_CANCEL_ONLY_PENDING_OR_CONFIRMED) |

### TC-06 — Vytvoření platby

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | V `MY_RESERVATIONS` klikni *Platby* | Načte se `RESERVATION_PAYMENTS` se seznamem |
| 2 | Vytvoř novou platbu (částka, metoda) | Vytvoří se platba ve stavu PENDING |
| 3 | Záporná částka | FE validace zablokuje submit (`RULE_PAYMENT_AMOUNT_POSITIVE`) |

### TC-07 — Admin: změna stavu rezervace

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | Login jako admin, `#/admin/reservations` | Načte se seznam všech rezervací |
| 2 | U PENDING vyber stav CONFIRMED | Stav se přepne, řádek se aktualizuje |
| 3 | Pokus o nepovolený přechod (CANCELLED → CONFIRMED) | BE vrátí chybu (`RULE_STATUS_TRANSITION_VALID`) |

### TC-08 — Admin: vytvoření / úprava pokoje

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | `#/admin/rooms/new`, vyplň povinná pole | Submit → pokoj vytvořen, redirect na seznam |
| 2 | `#/admin/rooms/:id/edit` | Formulář předvyplněn aktuálními hodnotami |
| 3 | Toggle *Aktivní* off | Pokoj přestane být nabízen v rezervacích (`RULE_ROOM_MUST_BE_ACTIVE`) |

### TC-09 — Admin: nemůže rezervovat

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | Přihlášen jako admin → klikni *Rezervovat* u pokoje | BE odmítne (`RULE_ADMIN_CANNOT_RESERVE`), FE zobrazí chybu |

### TC-10 — Změna emailu a hesla

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | `USER_EDIT_EMAIL` → zadej nový email + heslo | Email se změní, profil i `auth.email` aktualizovány |
| 2 | `USER_EDIT_PASSWORD` → staré + nové heslo | Heslo změněno, redirect zpět na detail |
| 3 | Špatné staré heslo | BE vrátí 400 + zpráva, FE zobrazí v `userEditError` |

### TC-11 — Routování & deep linking

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | Otevři přímo `#/hotels/1/rooms` | Načte se ROOM_LIST pro hotel 1 (router rozpozná 3-dílný pattern dřív než 2-dílný `#/hotels/:id`) |
| 2 | Otevři `#/neznama-stranka` | Router vrátí `UNKNOWN` → fallback `ENTER_HOTEL_LIST` |
| 3 | Stiskni *Zpět* v prohlížeči | `popstate` listener přepne stav podle aktuální URL |

### TC-12 — Auth flow + `returnAction`

| Krok | Akce | Očekávaný výsledek |
|---|---|---|
| 1 | Anonymně klikni *Rezervovat* | Uloží se `ui.returnAction`, redirect na `#/login` |
| 2 | Přihlas se | Po loginu se dispatchne uložený `returnAction` (návrat na `RESERVATION_CREATE`) |
| 3 | Logout | Vyčistí `auth`, redirect na `#/hotels` |

---

## Související dokumenty

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — celková architektura, datový model, business pravidla, API kontrakt.
- [`FRONTEND_STRUCTURE.md`](FRONTEND_STRUCTURE.md) — detailní popis vrstev frontendu, dobré praktiky.
- [`BACKEND_STRUCTURE.md`](BACKEND_STRUCTURE.md) — struktura backendu (Spring Boot).
- [`MIGRATIONS.md`](MIGRATIONS.md) — databázové migrace.
