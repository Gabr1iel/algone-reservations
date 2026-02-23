# Struktura frontendu

Popis jednotlivých vrstev a souborů na frontendu, jejich účel a dobré praktiky.

Frontend je postaven jako **vanilla JS SPA** (Single Page Application) bez frameworku, s vlastním state managementem inspirovaným Reduxem/Fluxem.

---

## Přehled architektury

```
Uživatel klikne / změní URL
        │
        ▼
    Router       ── převede URL na akci
        │
        ▼
    Dispatcher   ── přijme akci, rozhodne co s ní
        │
        ▼
    Action       ── provede logiku (API volání, změna stavu)
        │
        ▼
    Store        ── uloží nový stav, notifikuje listenery
        │
        ▼
    Selectors    ── připraví data pro view (viewState)
        │
        ▼
    Handlers     ── připraví callbacky pro view (onClick atd.)
        │
        ▼
    Render       ── vybere správný view a vykreslí ho do DOM
        │
        ▼
    View         ── vytvoří HTML elementy
```

---

## Tok dat (jednosměrný)

```
Action → Store (setState) → Render → View
  ↑                                    │
  └──── Handler (dispatch) ────────────┘
```

Data tečou jedním směrem: akce změní stav, stav se vykreslí, uživatel interaguje a tím spustí novou akci. Nikdy neměníme stav přímo z view.

---

## 1. Entry point (`index.html` + `app.js`)

### `index.html`

Minimální HTML soubor s jedním `<div id="app">` do kterého se vykresluje celá aplikace.

```html
<div id="app"></div>
<script type="module" src="js/app.js"></script>
```

### `app.js`

Vstupní bod JS aplikace. Inicializuje všechny části:

```javascript
const store = createStore(createInitialState());   // vytvoří store s výchozím stavem
const dispatch = createDispatcher(store, api);      // vytvoří dispatcher
store.subscribe((state) => render(root, state, dispatch)); // při změně stavu překresli
dispatch({ type: 'APP_INIT' });                     // spusť inicializaci
```

### Dobré praktiky
- `app.js` jen drátuje komponenty dohromady — žádná logika
- Všechny závislosti se předávají explicitně (ne globální proměnné)

---

## 2. Store (`infrastructure/createStore.js`)

Centrální úložiště stavu aplikace. Jednoduchá implementace inspirovaná Reduxem.

```javascript
export function createStore(initialState) {
  let state = initialState;
  const listeners = [];

  function getState() { return state; }
  function setState(updateFunction) {
    state = updateFunction(state);
    listeners.forEach((l) => l(state));
  }
  function subscribe(listener) { listeners.push(listener); }

  return { getState, setState, subscribe };
}
```

**Jak funguje:**
- `getState()` — vrátí aktuální stav
- `setState(fn)` — přijme funkci `(oldState) => newState`, uloží nový stav a notifikuje všechny listenery (render)
- `subscribe(fn)` — zaregistruje callback, který se zavolá při každé změně stavu

### Dobré praktiky
- Stav je **immutable** — nikdy neměníme existující objekt, vždy vytváříme nový (`{ ...state, ... }`)
- Store se neimportuje přímo — předává se přes parametry (dependency injection)

---

## 3. State (`state/state.js`)

Definuje výchozí (počáteční) stav aplikace.

```javascript
export function createInitialState() {
  return {
    hotels: [],                           // doménová data
    auth: { role: 'ANONYMOUS', ... },     // stav autentizace
    ui: {
      mode: 'HOTEL_LIST',                // jaká "stránka" se zobrazuje
      status: 'LOADING',                 // LOADING | READY | ERROR
      errorMessage: null,
      notification: null,
    },
  };
}
```

**Struktura stavu:**
- **Doménová data** (`hotels`, budoucí `rooms`, `reservations` atd.) — data z API
- **`auth`** — informace o přihlášeném uživateli
- **`ui`** — stav uživatelského rozhraní (jaká stránka, jestli se načítá, chybové hlášky)

### Dobré praktiky
- Stav je plochý — nepoužívat hluboké zanořování
- UI stav oddělit od doménových dat
- Každý nový "druh" dat přidat jako top-level klíč

---

## 4. Router (`router/router.js`)

Převádí URL (hash) na akci, kterou dispatcher zpracuje.

```javascript
URL: index.html#/hotels
         │
         ▼
urlToRoute()  →  { context: 'HOTEL_LIST' }
         │
         ▼
routeToAction()  →  { type: 'ENTER_HOTEL_LIST' }
```

**Tři kroky:**
1. `urlToRoute(url)` — parsuje hash z URL na route objekt
2. `routeToAction(route)` — převede route na action objekt
3. `urlToAction(url)` — zkratka: URL → action přímo

### Dobré praktiky
- Router nezná store ani API — jen převádí URL na akce
- Při přidání nové stránky: přidat pattern do `parseUrl()` a case do `routeToAction()`
- Neznámé URL přesměrovat na výchozí stránku (fallback)

---

## 5. Dispatcher (`dispatcher/dispatcher.js`)

Centrální rozcestník akcí. Přijme akci a rozhodne, která action funkce ji zpracuje.

```javascript
export function createDispatcher(store, api) {
  return async function dispatch(action) {
    switch (action.type) {
      case 'APP_INIT':
        return appInit({ store, api, dispatch });
      case 'ENTER_HOTEL_LIST':
        return enterHotelList({ store });
    }
  };
}
```

### Dobré praktiky
- Dispatcher je tenký — jen routuje akce na správné action funkce
- Žádná logika v dispatcheru — vše v action funkcích
- Při přidání nové akce: přidat `case` do switche a naimportovat action funkci

---

## 6. Actions (`actions/`)

Action funkce obsahují logiku — volání API, aktualizaci stavu, navigaci. Každá akce je v samostatném souboru.

### `appInit.js` — inicializace aplikace

```javascript
export async function appInit({ store, api, dispatch }) {
  store.setState(state => ({ ...state, ui: { ...state.ui, status: 'LOADING' } }));

  const result = await api.get('/hotels');

  if (result.status !== 'SUCCESS') {
    store.setState(state => ({ ...state, ui: { ...state.ui, status: 'ERROR', ... } }));
    return;
  }

  store.setState(state => ({ ...state, hotels: result.hotels, ui: { ...state.ui, status: 'READY' } }));
  dispatch(urlToAction(window.location.href));  // zpracuj aktuální URL
}
```

### `enterHotelList.js` — přepnutí na seznam hotelů

```javascript
export function enterHotelList({ store }) {
  store.setState(state => ({
    ...state,
    ui: { ...state.ui, mode: 'HOTEL_LIST', status: 'READY' },
  }));
}
```

### Dobré praktiky
- Jeden soubor = jedna akce
- Pojmenování souboru odpovídá akci: `ENTER_HOTEL_LIST` → `enterHotelList.js`
- Akce přijímají `{ store, api, dispatch }` jako parametry — ne globální importy
- Aktualizovat stav immutabilně: `{ ...state, hotels: newHotels }`

---

## 7. Selectors (`selectors/selectors.js`)

Funkce které ze stavu aplikace připraví data pro view. Oddělují logiku "co zobrazit" od samotného renderování.

```javascript
export function selectViewState(state) {
  if (state.ui.status === 'LOADING') return { type: 'LOADING' };
  if (state.ui.status === 'ERROR')   return { type: 'ERROR', message: ... };

  switch (state.ui.mode) {
    case 'HOTEL_LIST': return selectHotelListView(state);
  }
}
```

**Výstup** je `viewState` objekt — čistá data bez logiky, připravená k vykreslení.

### Dobré praktiky
- Selector nikdy nemění stav — jen čte a transformuje
- Každý view dostane přesně ta data, která potřebuje (ne celý stav)
- Při přidání nové stránky: přidat nový selector a case do `selectViewState`

---

## 8. Handlers (`handlers/createHandlers.js`)

Vytváří callback funkce (event handlery) pro view — tlačítka, formuláře, klikání.

```javascript
export function createHandlers(dispatch, viewState) {
  switch (viewState.type) {
    case 'HOTEL_LIST':
      return hotelListHandlers(dispatch, viewState);
    case 'ERROR':
      return { onContinue: () => dispatch({ type: 'ENTER_HOTEL_LIST' }) };
  }
}
```

View pak použije handler takto: `button.addEventListener('click', handlers.onContinue)`

### Dobré praktiky
- Handlery jen dispatchují akce — žádná business logika
- Pojmenování: `onContinue`, `onDelete`, `onSubmit` atd.
- View neví nic o dispatch — dostane hotové callbacky

---

## 9. Render (`views/render.js`)

Hlavní renderovací funkce. Propojuje selectors, handlers a views.

```javascript
export function render(root, state, dispatch) {
  root.replaceChildren();                              // vymaž DOM
  const viewState = selectViewState(state);            // připrav data
  const handlers = createHandlers(dispatch, viewState); // připrav handlery
  const view = HotelListView({ viewState, handlers }); // vytvoř view
  root.appendChild(view);                              // vlož do DOM
}
```

### Dobré praktiky
- Render je tenký — jen orchestruje
- Při přidání nové stránky: přidat case do switche

---

## 10. Views (`views/`)

Funkce které vytvářejí DOM elementy. Rozdělené na **pages** (celé stránky) a **components** (znovupoužitelné části).

### Pages (`views/pages/`)

```javascript
// HotelListView.js
export function HotelListView({ viewState, handlers }) {
  const container = document.createElement('div');
  // ... vytvoří seznam hotelů
  return container;
}
```

### Components (`views/components/`)

```javascript
// LoadingView.js — zobrazí "Načítání…"
// ErrorView.js  — zobrazí chybovou hlášku s tlačítkem "Pokračovat"
```

### Dobré praktiky
- View jen vytváří DOM — žádná logika, žádné API volání
- View přijímá `{ viewState, handlers }` — nikdy přímo store nebo dispatch
- Znovupoužitelné části vyčlenit do `components/`
- Stránky do `pages/`

---

## 11. API Client (`infrastructure/apiClient.js`)

Obaluje `fetch()` pro komunikaci s backendem.

```javascript
export function get(path, token)  { return request('GET', path, null, token); }
export function post(path, body, token) { return request('POST', path, body, token); }
export function put(path, body, token)  { return request('PUT', path, body, token); }
export function del(path, token)  { return request('DELETE', path, null, token); }
```

Každá metoda vrací objekt `{ status: 'SUCCESS', ...data }` nebo `{ status: 'REJECTED', reason: '...' }`.

### Dobré praktiky
- API client nezná store — je nezávislý
- Vždy kontrolovat `result.status` v action funkcích
- Base URL na jednom místě (`API_BASE_URL`)

---

## Shrnutí: kam co patří

| Co potřebuji | Kam to dám |
|---|---|
| Přidat novou stránku | `router/` (nový pattern) + `actions/` (enter akce) + `views/pages/` (nový view) + `selectors/` (nový selector) + case do `dispatcher`, `render`, `createHandlers` |
| Přidat tlačítko/interakci | `handlers/` (nový handler) + `actions/` (nová akce) + case do `dispatcher` |
| Volat API | `actions/` — zavolat `api.get/post/put/del()` |
| Změnit tvar dat pro view | `selectors/` |
| Přidat znovupoužitelnou UI komponentu | `views/components/` |
| Přidat nová data do stavu | `state/` (výchozí hodnota) + `actions/` (naplnění daty) |
