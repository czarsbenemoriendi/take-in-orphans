type HtmlSegments = {
	type: "tag" | "text";
	content: string;
}[];

type FixOrphans = (originalText: string, fileExtension?: string) => string;

const ORPHAN_PATTERNS = {
	conjunctions: /(?<![<\w])([aiouvwzAIOUVWZ])\s+/g,

	prepositions: /(?<![<\w])(na|do|od|po|ze|we|za)\s+/g,

	abbreviations: /\b(np|tj|itp|itd|tzn|ok|ul|al|pl)\.\s+/g,

	numbers: /\b(\d+)\s+(zł|gr|kg|g|m|cm|mm|km|l|ml|h|min|s|°C|%)/g,
};

const applyOrphanFixes = (text: string): string => {
	let result = text;

	Object.values(ORPHAN_PATTERNS).forEach((pattern) => {
		result = result.replace(pattern, (match) =>
			match.replace(/\s+/g, "&nbsp;"),
		);
	});

	return result;
};

const parseHtmlSegments = (html: string): HtmlSegments => {
	const segments: HtmlSegments = [];
	let currentPos = 0;
	let i = 0;

	while (i < html.length) {
		if (html[i] === "<") {
			if (i > currentPos) {
				segments.push({
					type: "text",
					content: html.substring(currentPos, i),
				});
			}

			let tagEnd = i + 1;
			let inQuote = false;
			let quoteChar = "";

			while (tagEnd < html.length) {
				const char = html[tagEnd];

				if (
					(char === '"' || char === "'")
					&& html[tagEnd - 1] !== "\\"
				) {
					if (!inQuote) {
						inQuote = true;
						quoteChar = char;
					} else if (char === quoteChar) {
						inQuote = false;
						quoteChar = "";
					}
				}

				// End of tag (when not inside quotes)
				if (char === ">" && !inQuote) {
					tagEnd++;
					break;
				}

				tagEnd++;
			}

			segments.push({
				type: "tag",
				content: html.substring(i, tagEnd),
			});

			currentPos = tagEnd;
			i = tagEnd;
		} else {
			i++;
		}
	}

	if (currentPos < html.length) {
		segments.push({
			type: "text",
			content: html.substring(currentPos),
		});
	}

	return segments;
};

/**
 * Orphan fixing function with direct replacement
 */

export const fixOrphans: FixOrphans = (
	originalText: string,
	fileExtension?: string,
): string => {
	const isHtml = fileExtension
		? ["html", "htm", "xml", "jsx", "tsx", "vue", "svelte"].includes(
				fileExtension.toLowerCase(),
			)
		: originalText.includes("<") && originalText.includes(">");

	if (!isHtml) {
		return applyOrphanFixes(originalText);
	}

	const segments = parseHtmlSegments(originalText);

	return segments
		.map((segment) => {
			if (segment.type === "text") {
				return applyOrphanFixes(segment.content);
			}
			return segment.content;
		})
		.join("");
};
