
/**
 * Unified patterns for Polish orphans with clear categorization
 */
const ORPHAN_PATTERNS = {
	// Spójniki jednoliterowe
	conjunctions: /\b([aiouvwzAIOUVWZ])\s+/g,

	// Przyimki i słowa funkcyjne
	prepositions: /\b(na|do|od|po|ze|we|za|przed|przez|bez|dla|oraz|ale|czy|gdy|jak|pod|nad|przy|lub)\s+/g,

	// Skróty z kropką (bez tytułów, które mają osobny wzorzec)
	abbreviations: /\b(np|tj|itp|itd|tzn|ok|ul|al|pl)\.\s+/g,

	// Tytuły z kropką lub bez
	titles: /\b(Dr|Prof|Mgr|Inż|Pan|Pani)\.?\s+/g,

	// Liczby z jednostkami
	numbers: /\b(\d+)\s+(zł|gr|kg|g|m|cm|mm|km|l|ml|h|min|s|°C|%)/g,

	// Inicjały
	initials: /\b([A-ZĄĆĘŁŃÓŚŹŻ])\.\s+([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)/g
};

/**
 * Orphan fixing function with direct replacement
 */
type OrphanFixer = (originalText: string, fileExtension?: string) => string;

export const fixOrphans: OrphanFixer = (originalText: string, fileExtension?: string): string => {
	const isHtml = fileExtension
		? ['html', 'htm', 'xml', 'jsx', 'tsx', 'vue', 'svelte'].includes(fileExtension.toLowerCase())
		: originalText.includes('<') && originalText.includes('>');

	let result = originalText;

	// Apply all patterns sequentially
	Object.values(ORPHAN_PATTERNS).forEach(pattern => {
		if (isHtml) {
			result = result.replace(pattern, (match, ..._groups) => {
				// Find the position of this match in the current result
				const matchIndex = result.indexOf(match);
				if (matchIndex === -1) {
					return match;
				}

				// Check if the space is followed by an HTML tag
				const afterMatch = result.substring(matchIndex + match.length);
				if (afterMatch.startsWith('<')) {
					return match; // Don't replace if followed by HTML tag
				}

				return match.replace(/\s+/g, '&nbsp;');
			});
		} else {
			// Simple replacement for non-HTML content
			result = result.replace(pattern, match => match.replace(/\s+/g, '&nbsp;'));
		}
	});

	return result;
};
