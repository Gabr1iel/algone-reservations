# Zadání semestrálního projektu — Hotelový rezervační systém

Václav Gabriel, Jitka Čabelická

## Popis prostředí

Systém je vyvíjen pro fiktivní malý hotel, který dosud spravuje rezervace manuálně — telefonicky, e-mailem a v tabulkovém procesoru. Hotel nabízí desítky pokojů různých typů a kategorií. Cílem projektu je nahradit ruční evidenci webovou aplikací s centrální relační databází (MySQL), která umožní hostům vytvářet rezervace online a správci hotelu efektivně řídit obsazenost, platby a speciální požadavky hostů.

Technická realizace: Spring Boot REST API (backend), vanilla JavaScript SPA (frontend), MySQL 8 (databáze). Schéma je spravováno migračními SQL skripty (Flyway); ORM (Hibernate) databázi pouze validuje, nevytváří.

## Sledované údaje

Datový model obsahuje 11 tabulek:

- **hotels** — základní údaje o hotelu (název, adresa, kontakty, časy check-in / check-out).
- **users** — registrovaní uživatelé systému s rolemi USER a ADMIN.
- **room_types** — číselník typů pokojů (Single, Double, Suite, Deluxe) s výchozí kapacitou a cenou za noc.
- **rooms** — konkrétní pokoje v hotelu (číslo pokoje, kapacita, cena za noc, příznak aktivity).
- **room_images** — fotografie přiřazené k pokojům.
- **amenities** — globální číselník vybavení pokojů (WIFI, AC, PARKING, MINIBAR apod.).
- **room_amenities** — vazební tabulka M:N mezi pokoji a vybavením.
- **reservations** — rezervace pokojů se stavovým automatem (PENDING → CONFIRMED → CHECKED_IN → COMPLETED / CANCELLED).
- **payments** — platby k rezervacím s vlastním stavovým automatem (PENDING → PAID / FAILED; PAID → REFUNDED).
- **special_request_types** — číselník typů speciálních požadavků (EXTRA_BED, LATE_CHECKOUT, EARLY_CHECKIN apod.).
- **reservation_special_requests** — speciální požadavky přiřazené ke konkrétním rezervacím.

## Vstupy a výstupy

**Vstupy:** registrace a přihlášení uživatele, vytvoření rezervace (výběr pokoje, termínu, speciálních požadavků), zadání platby, administrace pokojů (vytvoření, úprava, aktivace/deaktivace), změna stavů rezervací a plateb.

**Výstupy:** katalog dostupných pokojů s filtrováním dle termínu a kapacity, přehled vlastních rezervací uživatele (aktuální i historie), administrátorský přehled všech rezervací, kalendářový pohled obsazenosti pokojů, přehled plateb k rezervaci.

## Přístupová práva

Systém rozlišuje tři úrovně přístupu:

- **Veřejný (nepřihlášený uživatel)** — prohlížení pokojů a jejich dostupnosti, zobrazení číselníků, registrace a přihlášení.
- **USER (přihlášený host)** — vytvoření rezervace, správa vlastních rezervací a plateb, přidání speciálních požadavků, úprava profilu a změna hesla.
- **ADMIN (správce hotelu)** — správa pokojů (vytváření, úpravy, aktivace), potvrzování a změna stavů rezervací, správa plateb, přehled všech uživatelů a rezervací.

Na úrovni databáze je vytvořen aplikační uživatel s omezenými právy (SELECT, INSERT, UPDATE, DELETE na aplikační tabulky — bez práv DROP, ALTER a GRANT).
