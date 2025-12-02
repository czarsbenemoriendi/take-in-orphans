# Take in Orphans - Rozszerzenie VS Code

## 📝 Opis

"Take in Orphans" to rozszerzenie VS Code, które automatycznie wykrywa i naprawia sieroty typograficzne w tekście polskim, zastępując zwykłe spacje nietłukącymi się spacjami (`&nbsp;`) w odpowiednich miejscach.

## ✨ Funkcjonalności

### Automatyczne wykrywanie sierot typograficznych:
- **Spójniki jednoliterowe**: a, i, o, u, w, z
- **Przyimki**: na, do, od, po, ze, we, za
- **Skróty**: np., tj., itp., itd., tzn., ok., ul., al., pl.
- **Liczby z jednostkami**: 25 °C, 10 km, 2 kg, 100 zł, 500 ml, etc.

### Wsparcie dla różnych formatów:
- Zwykły tekst
- HTML/XML
- Markdown
- JSX/TSX
- Vue, Svelte

## 🚀 Użycie

### Skrót klawiszowy:
- **Windows/Linux**: `Ctrl + Shift + Space`
- **macOS**: `Cmd + Shift + Space`

### Komenda z palety:
1. Otwórz paletę komend (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Wpisz "Napraw sieroty typograficzne"
3. Naciśnij Enter

### Zakres działania:
- **Zaznaczony tekst**: Naprawia tylko zaznaczony fragment
- **Brak zaznaczenia**: Naprawia cały dokument

## 🛠️ Rozwój

### Wymagania:
- Node.js 18+
- npm 8+
- VS Code 1.105.0+

### Instalacja zależności:
```bash
npm install
```

### Kompilacja:
```bash
npm run compile
```

### Uruchomienie w trybie deweloperskim:
```bash
npm run watch
```

Następnie naciśnij `F5` aby uruchomić Extension Development Host.

### Testowanie:
```bash
npm test
```

## 📁 Struktura projektu

```
take-in-orphans/
├── .vscode/
│   ├── extensions.json         # Zalecane rozszerzenia
│   ├── launch.json             # Konfiguracja debugowania
│   ├── settings.json           # Ustawienia workspace
│   └── tasks.json              # Zadania VS Code
├── src/
│   ├── test/
│   │   ├── extension.test.ts   # Testy integracyjne rozszerzenia
│   │   └── orphanDetector.test.ts # Testy jednostkowe logiki
│   ├── extension.ts            # Główny plik rozszerzenia
│   └── orphanDetector.ts       # Logika wykrywania sierot
├── eslint.config.mjs          # Konfiguracja ESLint
├── package.json               # Konfiguracja rozszerzenia i npm
├── tsconfig.json              # Konfiguracja TypeScript
└── webpack.config.js          # Konfiguracja Webpack

```

## 🔧 Konfiguracja

Rozszerzenie nie wymaga dodatkowej konfiguracji i działa od razu po instalacji.

## 📖 Przykłady użycia

### Przed:
```
To jest tekst z spójnikiem a potem dalszy tekst.
Idę do sklepu na zakupy.
Temperatura wynosi 25 °C i wszystko w porządku.
Mamy np. 100 zł w kasie.
```

### Po:
```
To jest tekst z spójnikiem a&nbsp;potem dalszy tekst.
Idę do&nbsp;sklepu na&nbsp;zakupy.
Temperatura wynosi 25&nbsp;°C i&nbsp;wszystko w&nbsp;porządku.
Mamy np.&nbsp;100&nbsp;zł w&nbsp;kasie.
```

## 🐛 Zgłaszanie błędów

Jeśli znajdziesz błąd lub masz sugestię, utwórz issue w repozytorium projektu.

## 📄 Licencja

MIT License - zobacz plik LICENSE dla szczegółów.

---

**Miłego używania! 🎉**
