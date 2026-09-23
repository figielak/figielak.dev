import katex from 'katex';

/**
 * Renders Sätteri's `math` and `inlineMath` nodes with KaTeX.
 *
 * Sätteri parses the nodes itself (`features: { math: true }`), so this only
 * handles rendering. `mdxExpressions: false` keeps KaTeX's braces literal
 * instead of letting MDX read them as expressions.
 */
const render = (value, displayMode) => ({
	raw: katex.renderToString(value, { displayMode, throwOnError: false }),
	mdxExpressions: false,
});

export function katexPlugin() {
	return {
		name: 'katex',
		math: (node) => render(node.value, true),
		inlineMath: (node) => render(node.value, false),
	};
}
