# Struktura backendu

Popis jednotlivých vrstev a tříd na backendu, jejich účel a dobré praktiky.

---

## Přehled vrstev

```
HTTP Request
    │
    ▼
Controller  ── přijímá requesty, vrací response
    │
    ▼
Service     ── business logika
    │
    ▼
Repository  ── komunikace s databází
    │
    ▼
Entity      ── mapování na DB tabulku
```

Každá vrstva komunikuje jen s vrstvou přímo pod ní. Controller nikdy nepřistupuje k Repository přímo.

---

## 1. Entity (`entity/`)

**Příklad:** `Hotel.java`

Třída označená `@Entity`, která mapuje tabulku v databázi. Každý atribut odpovídá sloupci.

```java
@Entity
@Table(name = "hotels")
@Getter @Setter @NoArgsConstructor
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
```

### Dobré praktiky
- Používat `@Getter` + `@Setter` + `@NoArgsConstructor` (ne `@Data`, viz [ANNOTATIONS.md](ANNOTATIONS.md))
- Atributy jsou `private`
- Pojmenování tabulky explicitně přes `@Table(name = "...")` — nespoléhat na výchozí název
- Pro časové značky (`createdAt`, `updatedAt`) použít `@PrePersist` / `@PreUpdate` callbacky nebo Hibernate `@CreationTimestamp`

---

## 2. Repository (`repository/`)

**Příklad:** `HotelRepository.java`

Interface rozšiřující `JpaRepository<Entity, TypId>`. Spring automaticky vygeneruje implementaci — není třeba psát žádný kód.

```java
public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
```

Zdarma dostáváme metody jako `findAll()`, `findById()`, `save()`, `deleteById()` atd.

### Vlastní dotazy

Můžeme přidat vlastní metody pomocí konvence pojmenování:

```java
List<Hotel> findByCity(String city);
List<Hotel> findByCountryAndCity(String country, String city);
Optional<Hotel> findByEmail(String email);
```

Spring z názvu metody automaticky odvodí SQL dotaz.

### Dobré praktiky
- Repository je jen interface — nikdy nepsat implementaci ručně
- Pro složitější dotazy použít `@Query` anotaci s JPQL
- Jedna entita = jedno repository

---

## 3. Service (`service/`)

**Příklad:** `HotelService.java`

Třída s `@Service` anotací obsahující business logiku. Stojí mezi controllerem a repository.

```java
@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }
}
```

### Dobré praktiky
- **Veškerá business logika patří sem** — ne do controlleru ani do repository
- Používat **konstruktorovou injekci** (Spring automaticky injektuje závislosti přes konstruktor)
- Metody vracejí **entity**, ne DTO — konverzi na DTO dělá controller
- Validace dat a kontrola oprávnění patří do service vrstvy
- Pro operace měnící více záznamů používat `@Transactional`

---

## 4. Controller (`controller/`)

**Příklad:** `HotelController.java`

Třída s `@RestController` — přijímá HTTP requesty a vrací JSON response.

```java
@RestController
@RequestMapping("/api")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping("/hotels")
    public Map<String, Object> getAllHotels() {
        List<HotelResponse> hotels = hotelService.getAllHotels()
                .stream()
                .map(HotelResponse::fromEntity)
                .toList();
        return Map.of("status", "SUCCESS", "hotels", hotels);
    }
}
```

### Dobré praktiky
- Controller je **tenký** — jen přijme request, zavolá service, vrátí response
- **Žádná business logika** v controlleru
- Konverze entity → DTO (response) se dělá zde
- Jeden controller na entitu / doménu
- Vracet vhodné HTTP status kódy (`ResponseEntity<>`)

---

## 5. DTO (`dto/`)

**Příklad:** `HotelResponse.java`

Data Transfer Object — objekt, který definuje tvar dat posílaných klientovi (response) nebo přijímaných od klienta (request).

```java
@Getter
public class HotelResponse {
    private Long id;
    private String name;

    public static HotelResponse fromEntity(Hotel hotel) {
        HotelResponse response = new HotelResponse();
        response.id = hotel.getId();
        response.name = hotel.getName();
        return response;
    }
}
```

### Proč neposílat entity přímo?
- **Bezpečnost** — entity mohou obsahovat citlivá data (hesla, interní ID), DTO odesílá jen to co chceme
- **Flexibilita** — response může mít jiný tvar než DB tabulka
- **Stabilita API** — změna entity nemusí rozbít API, pokud DTO zůstane stejné

### Dobré praktiky
- Oddělit **request** a **response** DTO (`dto/request/`, `dto/response/`)
- Request DTO by mělo mít validace (`@NotNull`, `@Size`, `@Email` atd.)
- Response DTO nepotřebuje settery — plní se interně přes `fromEntity()` nebo konstruktor
- Konvence pojmenování: `CreateHotelRequest`, `UpdateHotelRequest`, `HotelResponse`

---

## 6. Config (`config/`)

**Příklad:** `WebConfig.java`

Konfigurační třídy s `@Configuration` — nastavení chování aplikace (CORS, security, vlastní beany atd.).

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

### Dobré praktiky
- Každý config do vlastní třídy — `WebConfig`, `SecurityConfig`, `SwaggerConfig` atd.
- CORS nastavení zpřísnit na produkci (nepoužívat `*` pro origins)

---

## 7. Application (`ReservationsApplication.java`)

Vstupní bod celé aplikace. Obsahuje `main` metodu a anotaci `@SpringBootApplication`.

```java
@SpringBootApplication
public class ReservationsApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservationsApplication.class, args);
    }
}
```

Tuto třídu obvykle neupravujeme.

---

## Shrnutí: kam co patří

| Co potřebuji | Kam to dám |
|---|---|
| Přidat novou tabulku | `entity/` — nová třída s `@Entity` |
| Číst/zapisovat do DB | `repository/` — nový interface extending `JpaRepository` |
| Implementovat logiku (kalkulace, validace) | `service/` — nová/existující service třída |
| Vytvořit API endpoint | `controller/` — nová/existující controller třída |
| Definovat tvar requestu/response | `dto/request/` nebo `dto/response/` |
| Nastavit chování aplikace | `config/` — nová konfigurační třída |
