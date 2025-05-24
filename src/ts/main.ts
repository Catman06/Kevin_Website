import kevinLogo from '/kevinFavicon.png'

// Use kevinLogo for all instances of logo classed elements
for (const element of document.getElementsByClassName("logo")) {
  element.setAttribute("src", kevinLogo);
}

// Keep the variable for the height of the navbar up to date for the logo
function getStylesheet(title: String) {
  for (const sheet of document.styleSheets) {
    if (sheet.title === title) {
      return sheet;
    }
  }
}
let stylesheet = getStylesheet("style");
const navbar_watcher = new ResizeObserver((entries) => {
  for (const navbar of entries) {
    if (typeof stylesheet === "undefined") {
      stylesheet = document.styleSheets[document.styleSheets.length-1];
    }
    if (navbar.contentBoxSize && document.documentElement instanceof HTMLElement) {
      // Get current height of the navbar from the home button
      let nav_height = navbar.contentBoxSize[0].blockSize;
      for (const index in stylesheet.cssRules) {
        let rule = stylesheet.cssRules[index]
        // If the rule is a style rule and has the selector of :root, set the new nav_height
        if (rule instanceof CSSStyleRule && rule.selectorText == ':root') {
          rule.style.setProperty("--nav_height", `${nav_height}px`)
        }
      }
    }
  }
})
let navbar = document.querySelector(".navbar li:last-child");
if (navbar) {
  navbar_watcher.observe(navbar);
}