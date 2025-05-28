export function getStyleSheet(): CSSStyleSheet | undefined {
	for (const sheet of document.styleSheets) {
		const result = sheet.cssRules.item(0)?.cssText.search(/#post_selector/);
		if (result != undefined && result >= 0) {
			return sheet;
		}
	}
}

// Replace the CSS rule with one with new declarations
export function replaceCSSRule(stylesheet: CSSStyleSheet, selector: string, newRule: string) {
	// Find the requested rule
	for (const index in stylesheet.cssRules) {
		// Replace the old with the new
		if (stylesheet.cssRules[index].cssText.search(selector) >= 0) {
			stylesheet.deleteRule(parseInt(index));
			stylesheet.insertRule(selector + '{ ' + newRule + ' }', parseInt(index));
			return;
		}
	}
}