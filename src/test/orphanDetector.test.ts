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
				{ input: 'Mieszkam przy ulicy', expected: 'Mieszkam przy&nbsp;ulicy' }
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
				{ input: 'Dr. Smith prowadzi', expected: 'Dr.&nbsp;Smith prowadzi' }
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

	suite('Initials (Inicjały)', () => {
		test('should fix initials with names', () => {
			const testCases = [
				{ input: 'Dr J. Kowalski', expected: 'Dr&nbsp;J.&nbsp;Kowalski' },
				{ input: 'Prof A. Nowak', expected: 'Prof&nbsp;A.&nbsp;Nowak' },
				{ input: 'Mgr B. Wiśniewski', expected: 'Mgr&nbsp;B.&nbsp;Wiśniewski' }
			];

			testCases.forEach(({ input, expected }) => {
				const result = fixOrphans(input);
				assert.strictEqual(result, expected, `Failed for: "${input}"`);
			});
		});
	});

	suite('Complex Sentences', () => {
		test('should fix multiple orphan types in one sentence', () => {
			const input = 'Dr J. Kowalski mieszka w Warszawie i waży 75 kg';
			const expected = 'Dr&nbsp;J.&nbsp;Kowalski mieszka w&nbsp;Warszawie i&nbsp;waży 75&nbsp;kg';
			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});

		test('should handle long complex text', () => {
			const input = 'To jest długi tekst z wieloma spójnikami i przyimkami. '
				+ 'Dr A. Nowak mieszka w domu o powierzchni 100 m. '
				+ 'Temperatura wynosi 20 °C i wszystko jest w porządku.';

			const expected = 'To jest długi tekst z&nbsp;wieloma spójnikami i&nbsp;przyimkami. '
				+ 'Dr&nbsp;A.&nbsp;Nowak mieszka w&nbsp;domu o&nbsp;powierzchni 100&nbsp;m. '
				+ 'Temperatura wynosi 20&nbsp;°C i&nbsp;wszystko jest w&nbsp;porządku.';

			const result = fixOrphans(input);
			assert.strictEqual(result, expected);
		});
	});

	suite('HTML Context', () => {
		test('should not add nbsp before HTML tags (safe behavior)', () => {
			const input = '<p>To jest tekst a <strong>pogrubiony</strong> tekst</p>';
			const expected = '<p>To jest tekst a <strong>pogrubiony</strong> tekst</p>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should not add nbsp before multiple HTML elements (safe behavior)', () => {
			const input = '<div>Idę do <span>sklepu</span> na <em>zakupy</em></div>';
			const expected = '<div>Idę do <span>sklepu</span> na <em>zakupy</em></div>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should detect HTML from content and fix orphans inside tags', () => {
			const input = '<p>To jest a tekst</p>';
			const expected = '<p>To jest a&nbsp;tekst</p>';
			const result = fixOrphans(input); // No fileExtension, should auto-detect
			assert.strictEqual(result, expected);
		});

		test('should fix orphans inside HTML content but not before tags', () => {
			const input = '<div><p>To jest a tekst</p> i <span>to jest o czymś</span></div>';
			const expected = '<div><p>To jest a&nbsp;tekst</p> i <span>to jest o&nbsp;czymś</span></div>';
			const result = fixOrphans(input, 'html');
			assert.strictEqual(result, expected);
		});

		test('should handle mixed content correctly', () => {
			const input = 'Tekst a <strong>pogrubiony</strong> oraz o <em>kursywie</em>';
			const expected = 'Tekst a <strong>pogrubiony</strong> oraz&nbsp;o <em>kursywie</em>';
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
