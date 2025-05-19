import '../css/index.css'
import kevinLogo from '/kevinFavicon.png'

// Use kevinLogo for all instances of logo classed elements
for (const element of document.getElementsByClassName("logo")) {
  element.setAttribute("src", kevinLogo);
}

// Keep the variable for the height of the navbar up to date for the logo
const navbar_watcher = new ResizeObserver((entries) => {
  const root = document.querySelector(':root');
  for (const navbar of entries) {
    if (navbar.contentBoxSize && root instanceof HTMLElement) {
      let nav_height = navbar.contentBoxSize[0].blockSize;
      root.style.setProperty('--nav_height', `${nav_height}px`);
      root.style.setProperty('--nav_height_logo', `${nav_height * .8}px`);
      console.debug(`Changed --nav_height to ${nav_height}`);
    }
  }
})
var navbar = document.querySelector(".navbar li:last-child");
if (navbar) {
  navbar_watcher.observe(navbar);
}