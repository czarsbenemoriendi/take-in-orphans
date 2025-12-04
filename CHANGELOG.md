# Change Log

All notable changes to the "take-in-orphans" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.2.1] - 2025-12-04

### Fixed
- Fixed issue where `<a` pattern in HTML tags was incorrectly treated as conjunction
- Improved pattern matching using negative lookbehind to prevent false positives in HTML tags
- Added tests to verify HTML tag names are not confused with conjunctions

## [0.2.0] - 2025-12-02

### Added
- Intelligent HTML attribute detection and exclusion during processing
- HTML parser protecting all attribute content (class, data-*, aria-*, style, href, alt, title, etc.)
- Support for mixed quotes (single and double) in HTML attributes
- Comprehensive unit and integration test suite (40 tests)

### Changed
- Simplified orphan patterns to essential set:
  - Conjunctions: a, i, o, u, w, z
  - Prepositions: na, do, od, po, ze, we, za
  - Abbreviations: np., tj., itp., itd., tzn., ok., ul., al., pl.
  - Numbers with units: zł, gr, kg, g, m, cm, mm, km, l, ml, h, min, s, °C, %

### Removed
- Removed support for extended prepositions (przed, przez, bez, dla, oraz, ale, czy, gdy, jak, pod, nad, przy, lub)
- Removed title detection (Dr., Prof., Mgr., Inż.)
- Removed initial support

## [0.1.0] - 2025-12-02

### Added
- Initial release
- Fix orphans in selected text or entire document
- Keyboard shortcut: Ctrl+Shift+Space (Windows/Linux) / Cmd+Shift+Space (macOS)
- Support for formats: text, HTML, Markdown, JSX/TSX, Vue, Svelte
