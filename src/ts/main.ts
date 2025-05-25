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
let stylesheet = document.styleSheets[0];
const navbar_watcher = new ResizeObserver((entries) => {
  // Set nav_height to the blockSize of the first entry (which should be the only one: the last navbar option)
  let nav_height = entries[0].contentBoxSize[0].blockSize;

  // Find the :root rule
  for (const rule of stylesheet.cssRules) {
    if (rule instanceof CSSStyleRule && rule.selectorText == ':root') {
      // Set the css variable --nav_height to nav_height
      rule.style.setProperty("--nav_height", `${nav_height}px`);
      return;
    }
    console.error('Failed to set --nav_height.')
  }
})
let navbar = document.querySelector(".navbar li:last-child");
if (navbar) {
  navbar_watcher.observe(navbar);
}