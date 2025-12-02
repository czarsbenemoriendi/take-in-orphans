import * as assert from 'assert';
import { fixOrphans } from '../orphanDetector';

suite('Orphan Detector Test Suite', () => {

	suite('Polish Conjunctions (Spójniki)', () => {
		test('should fix single letter conjunctions', () => {
			const input = 'To jest tekst a potem dalszy tekst';
			const expected = 'To jest tekst a&nbsp;potem dalszy tekst';
			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});

		test('should fix multiple conjunctions', () => {
			const input = 'Lubię czytać i pisać o różnych rzeczach';
			const expected = 'Lubię czytać i&nbsp;pisać o&nbsp;różnych rzeczach';
			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});

		test('should handle all single letter conjunctions', () => {
			const conjunctions = ['a', 'i', 'o', 'u', 'w', 'z'];
			conjunctions.forEach(conj => {
				const input = `Tekst ${conj} dalszy tekst`;
				const expected = `Tekst ${conj}&nbsp;dalszy tekst`;
				const result = fixOrphans(input);
				assert.strictEqual(result, expected, `Failed for conjunction: ${conj}`);
			});
		});
	});

	suite('Polish Prepositions (Przyimki)', () => {
		test('should fix common prepositions', () => {
			const testCases = [
				{ input: 'Idę do sklepu', expected: 'Idę do&nbsp;sklepu' },
				{ input: 'Książka na stole', expected: 'Książka na&nbsp;stole' },
				{ input: 'Wyszedł za rogiem', expected: 'Wyszedł za&nbsp;rogiem' },
				{ input: 'Wyszedł od domu', expected: 'Wyszedł od&nbsp;domu' }
			];

			testCases.forEach(({ input, expected }) => {
				const result = fixOrphans(input);
				assert.strictEqual(result, expected, `Failed for: "${input}"`);
			});
		});

		test('should fix multiple prepositions in one sentence', () => {
			const input = 'Idę do sklepu na zakupy';
			const expected = 'Idę do&nbsp;sklepu na&nbsp;zakupy';
			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});
	});

	suite('Abbreviations (Skróty)', () => {
		test('should fix common abbreviations', () => {
			const testCases = [
				{ input: 'To znaczy np. że musimy', expected: 'To znaczy np.&nbsp;że musimy' },
				{ input: 'Lista zawiera itp. różne elementy', expected: 'Lista zawiera itp.&nbsp;różne elementy' },
				{ input: 'Professor tj. Jan Kowalski', expected: 'Professor tj.&nbsp;Jan Kowalski' },
				{ input: 'Mamy ok. 100 osób', expected: 'Mamy ok.&nbsp;100 osób' }
			];

			testCases.forEach(({ input, expected }) => {
				const result = fixOrphans(input);
				assert.strictEqual(result, expected, `Failed for: "${input}"`);
			});
		});
	});

	suite('Numbers with Units (Liczby z jednostkami)', () => {
		test('should fix numbers with units', () => {
			const testCases = [
				{ input: 'Temperatura 25 °C', expected: 'Temperatura 25&nbsp;°C' },
				{ input: 'Odległość 10 km', expected: 'Odległość 10&nbsp;km' },
				{ input: 'Waga 2 kg', expected: 'Waga 2&nbsp;kg' },
				{ input: 'Cena 100 zł', expected: 'Cena 100&nbsp;zł' },
				{ input: 'Pojemność 500 ml', expected: 'Pojemność 500&nbsp;ml' }
			];

			testCases.forEach(({ input, expected }) => {
				const result = fixOrphans(input);
				assert.strictEqual(result, expected, `Failed for: "${input}"`);
			});
		});
	});

	suite('Prepositions with Ze/We variants', () => {
		test('should fix ze and we variants', () => {
			const testCases = [
				{ input: 'Rozmawiam ze znajomym', expected: 'Rozmawiam ze&nbsp;znajomym' },
				{ input: 'Rozmawiałem we wtorek', expected: 'Rozmawiałem we&nbsp;wtorek' },
				{ input: 'Idę po zakupy', expected: 'Idę po&nbsp;zakupy' }
			];

			testCases.forEach(({ input, expected }) => {
				const result = fixOrphans(input);
				assert.strictEqual(result, expected, `Failed for: "${input}"`);
			});
		});
	});

	suite('Complex Sentences', () => {
		test('should fix multiple orphan types in one sentence', () => {
			const input = 'Jan Kowalski mieszka w Warszawie i waży 75 kg';
			const expected = 'Jan Kowalski mieszka w&nbsp;Warszawie i&nbsp;waży 75&nbsp;kg';
			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});

		test('should handle long complex text', () => {
			const input = 'To jest długi tekst z wieloma spójnikami i przyimkami. '
				+ 'Jan Nowak mieszka w domu o powierzchni 100 m. '
				+ 'Temperatura wynosi 20 °C i wszystko jest w porządku.';

			const expected = 'To jest długi tekst z&nbsp;wieloma spójnikami i&nbsp;przyimkami. '
				+ 'Jan Nowak mieszka w&nbsp;domu o&nbsp;powierzchni 100&nbsp;m. '
				+ 'Temperatura wynosi 20&nbsp;°C i&nbsp;wszystko jest w&nbsp;porządku.';

			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});
	});

	suite('HTML Context', () => {
		test('should fix orphans in text but not in attributes', () => {
			const input = '<p>To jest tekst a <strong>pogrubiony</strong> tekst</p>';
			const expected = '<p>To jest tekst a&nbsp;<strong>pogrubiony</strong> tekst</p>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should fix orphans in all text segments between tags', () => {
			const input = '<div><p>To jest a tekst</p> i <span>to jest o czymś</span></div>';
			const expected = '<div><p>To jest a&nbsp;tekst</p> i&nbsp;<span>to jest o&nbsp;czymś</span></div>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should detect HTML from content and fix orphans inside tags', () => {
			const input = '<p>To jest a tekst</p>';
			const expected = '<p>To jest a&nbsp;tekst</p>';
			const result = fixOrphans(input); // No fileExtension, should auto-detect
			assert.strictEqual(result, expected);
		});

		test('should fix orphans inside HTML content but not in attributes', () => {
			const input = '<div><p>To jest a tekst</p> i <span>to jest o czymś</span></div>';
			const expected = '<div><p>To jest a&nbsp;tekst</p> i&nbsp;<span>to jest o&nbsp;czymś</span></div>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should handle mixed content correctly', () => {
			const input = 'Tekst a <strong>pogrubiony</strong> i o <em>kursywie</em>';
			const expected = 'Tekst a&nbsp;<strong>pogrubiony</strong> i&nbsp;o&nbsp;<em>kursywie</em>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});
	});

	suite('File Extension Detection', () => {
		test('should handle different file extensions', () => {
			const input = 'To jest tekst a dalszy tekst';
			const expected = 'To jest tekst a&nbsp;dalszy tekst';

			const extensions = ['html', 'htm', 'xml', 'jsx', 'tsx', 'vue', 'svelte'];
			extensions.forEach(ext => {
				const result = fixOrphans(input, ext);
				assert.strictEqual(result, expected, `Failed for extension: ${ext}`);
			});
		});

		test('should handle plain text extensions', () => {
			const input = 'To jest tekst a dalszy tekst';
			const expected = 'To jest tekst a&nbsp;dalszy tekst';

			const extensions = ['txt', 'md', 'js', 'ts', 'css'];
			extensions.forEach(ext => {
				const result = fixOrphans(input, ext);
				assert.strictEqual(result, expected, `Failed for extension: ${ext}`);
			});
		});
	});

	suite('HTML Attributes Safety', () => {
		test('should not add nbsp inside HTML attribute values', () => {
			const input = '<a href="/link" title="To jest o czymś">Link</a>';
			const expected = '<a href="/link" title="To jest o czymś">Link</a>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should not add nbsp in class attributes', () => {
			const input = '<div class="button w full">Tekst w elemencie</div>';
			const expected = '<div class="button w full">Tekst w&nbsp;elemencie</div>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should not add nbsp in data attributes', () => {
			const input = '<div data-text="To jest a test" data-value="o czymś">Content</div>';
			const expected = '<div data-text="To jest a test" data-value="o czymś">Content</div>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should not add nbsp in alt attributes', () => {
			const input = '<img src="test.jpg" alt="To jest obrazek o naturze" />';
			const expected = '<img src="test.jpg" alt="To jest obrazek o naturze" />';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should not add nbsp in placeholder attributes', () => {
			const input = '<input type="text" placeholder="Wpisz coś i zatwierdź" />';
			const expected = '<input type="text" placeholder="Wpisz coś i zatwierdź" />';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should fix orphans in content but not in style attributes', () => {
			const input = '<p style="margin: 0 auto">To jest tekst a więcej</p>';
			const expected = '<p style="margin: 0 auto">To jest tekst a&nbsp;więcej</p>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should not add nbsp in href with query parameters', () => {
			const input = '<a href="page.html?param=a b">Link</a>';
			const expected = '<a href="page.html?param=a b">Link</a>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should handle multiple attributes on single element', () => {
			const input = '<button class="btn w primary" data-action="do something" title="To jest o akcji">Kliknij</button>';
			const expected = '<button class="btn w primary" data-action="do something" title="To jest o akcji">Kliknij</button>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should not add nbsp in aria attributes', () => {
			const input = '<button aria-label="To jest przycisk do zamknięcia">X</button>';
			const expected = '<button aria-label="To jest przycisk do zamknięcia">X</button>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should handle mixed single and double quotes in attributes', () => {
			const input = `<div title='To jest o czymś' data-text="Tekst a więcej">Content</div>`;
			const expected = `<div title='To jest o czymś' data-text="Tekst a więcej">Content</div>`;
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});
	});

	suite('Edge Cases', () => {
		test('should handle empty string', () => {
			const result = fixOrphans('');
			assert.strictEqual(result, '');
		});

		test('should handle text without orphans', () => {
			const input = 'This is English text without Polish orphans.';
			const result = fixOrphans(input);
			assert.strictEqual(result, input);
		});

		test('should handle text with only spaces', () => {
			const input = '   ';
			const result = fixOrphans(input);
			assert.strictEqual(result, input);
		});

		test('should handle already fixed orphans', () => {
			const input = 'To jest tekst a&nbsp;już naprawiony';
			const result = fixOrphans(input);
			// Should not double-fix
			assert.strictEqual(result, input);
		});

		test('should handle mixed case', () => {
			const input = 'To jest tekst A dalszy tekst';
			const expected = 'To jest tekst A&nbsp;dalszy tekst';
			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});
	});

	suite('Performance Tests', () => {
		test('should handle large text efficiently', () => {
			const largeText = 'To jest długi tekst a bardzo długi. '.repeat(1000);
			const start = Date.now();
			const result = fixOrphans(largeText);
			const end = Date.now();

			// Should complete in reasonable time (less than 1 second)
			assert.ok(end - start < 1000, `Performance test failed: took ${end - start}ms`);
			assert.ok(result.includes('&nbsp;'), 'Should contain fixed orphans');
		});
	});
});
