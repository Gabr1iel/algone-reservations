# Přehled anotací

Přehled anotací používaných v projektu — JPA, Lombok a Spring.

---

## JPA / Jakarta Persistence

Anotace pro mapování Java tříd na databázové tabulky.

| Anotace | Účel | Příklad |
|---|---|---|
| `@Entity` | Označí třídu jako JPA entitu (mapuje se na tabulku v DB) | `@Entity public class Hotel {}` |
| `@Table(name = "...")` | Specifikuje název tabulky (jinak se použije název třídy) | `@Table(name = "hotels")` |
| `@Id` | Označí atribut jako primární klíč | `@Id private Long id;` |
| `@GeneratedValue(strategy = ...)` | Jak se generuje PK — `IDENTITY` = auto-increment v DB | `@GeneratedValue(strategy = GenerationType.IDENTITY)` |
| `@Column(...)` | Konfigurace sloupce — `nullable`, `length`, `columnDefinition`, `updatable`, `name` atd. | `@Column(nullable = false, length = 100)` |

---

## Lombok

Knihovna pro eliminaci boilerplate kódu. Generuje gettery, settery, konstruktory atd. při kompilaci.

| Anotace | Účel | Příklad |
|---|---|---|
| `@Getter` | Generuje gettery. Nad třídou = všechny atributy, nad atributem = jen ten jeden. | `@Getter public class Hotel {}` |
| `@Setter` | Generuje settery. Stejná logika jako `@Getter`. | `@Setter public class Hotel {}` |
| `@NoArgsConstructor` | Generuje prázdný konstruktor (JPA ho vyžaduje). | `@NoArgsConstructor public class Hotel {}` |
| `@AllArgsConstructor` | Generuje konstruktor se všemi atributy jako parametry. | `@AllArgsConstructor public class Hotel {}` |
| `@Builder` | Umožní vytvářet objekty builder patternem. | `Hotel.builder().name("X").build()` |
| `@Data` | Zkratka za `@Getter` + `@Setter` + `@ToString` + `@EqualsAndHashCode` + `@RequiredArgsConstructor`. | `@Data public class HotelDto {}` |
| `@ToString` | Generuje metodu `toString()`. | `@ToString public class Hotel {}` |
| `@EqualsAndHashCode` | Generuje metody `equals()` a `hashCode()`. | `@EqualsAndHashCode public class Hotel {}` |

### Vyloučení atributu

Pokud je anotace nad třídou ale chceme konkrétní atribut vyloučit:

```java
@Getter
public class Hotel {
    private String name;                  // getter SE vygeneruje

    @Getter(AccessLevel.NONE)
    private String secret;                // getter se NEVYGENERUJE
}
```

### Pozor u JPA entit

U entit se vyhni `@Data` — generuje `equals`/`hashCode` nad všemi atributy včetně `id`, což se u JPA entit nechová správně (dvě neuložené entity by si byly "rovny"). Bezpečnější volba je `@Getter` + `@Setter` + `@NoArgsConstructor`.

---

## Spring

Anotace pro konfiguraci Spring komponent, controllerů a dependency injection.

### Vstupní bod aplikace

| Anotace | Účel |
|---|---|
| `@SpringBootApplication` | Hlavní vstupní bod aplikace — kombinuje `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`. |

### Controllery a HTTP mapování

| Anotace | Účel | Příklad |
|---|---|---|
| `@RestController` | Třída obsluhuje HTTP requesty a vrací data (JSON). | `@RestController public class HotelController {}` |
| `@RequestMapping("/...")` | Společný URL prefix pro celý controller. | `@RequestMapping("/api/hotels")` |
| `@GetMapping` | Mapuje metodu na HTTP GET. | `@GetMapping("/{id}")` |
| `@PostMapping` | Mapuje metodu na HTTP POST. | `@PostMapping` |
| `@PutMapping` | Mapuje metodu na HTTP PUT. | `@PutMapping("/{id}")` |
| `@DeleteMapping` | Mapuje metodu na HTTP DELETE. | `@DeleteMapping("/{id}")` |

### Parametry requestu

| Anotace | Účel | Příklad |
|---|---|---|
| `@PathVariable` | Parametr z URL cesty. | `@PathVariable Long id` pro `/hotels/{id}` |
| `@RequestBody` | Deserializuje JSON z těla requestu do objektu. | `@RequestBody CreateHotelRequest request` |
| `@RequestParam` | Parametr z query stringu. | `@RequestParam String city` pro `?city=Praha` |

### Komponenty a dependency injection

| Anotace | Účel |
|---|---|
| `@Service` | Označí třídu jako servisní komponentu (business logika). |
| `@Repository` | Označí třídu jako datovou vrstvu (typicky JPA repository). |
| `@Component` | Obecná Spring komponenta (nadtyp pro `@Service` a `@Repository`). |
| `@Autowired` | Spring automaticky vloží závislost. Preferuje se konstruktorová injekce (kde `@Autowired` není nutné). |
