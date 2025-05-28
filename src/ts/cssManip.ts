export function getStyleSheet(selector_zero: RegExp): CSSStyleSheet | undefined {
	for (const sheet of document.styleSheets) {
		for (const index in sheet.cssRules) {
			const rule = sheet.cssRules.item(parseInt(index));
			if (rule instanceof CSSStyleRule && rule.selectorText.search(selector_zero) >= 0) {
				return sheet;
			}
		}
	}
	console.error("Couldn't find the stylesheet with " + selector_zero + " as a selector");
}

// Replace the CSS rule with one with new declarations
export function replaceCSSRule(stylesheet: CSSStyleSheet, selector: string, newRule: string) {
	// Find the requested rule
	for (const index in stylesheet.cssRules) {
		// Replace the old with the new
		const rule = stylesheet.cssRules[index]
		if (rule.cssText && rule.cssText.search(selector) >= 0) {
			stylesheet.deleteRule(parseInt(index));
			stylesheet.insertRule(selector + '{ ' + newRule + ' }', parseInt(index));
			return;
		}
	}
	console.log("Couldn't find the rule");
}