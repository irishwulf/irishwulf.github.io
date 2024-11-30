const yearEl = document.querySelector(".year");

const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

///////////////////////////////////////////////////////////
// Mobile navigation
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");
btnNavEl.addEventListener("click", function (e) {
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// Animated scrolling

document.addEventListener("click", function (e) {
  const linkEl = e.target.closest("a");
  const href = linkEl.getAttribute("href");
  console.log(href);
  if (!href || !href.startsWith("#")) return;

  e.preventDefault();

  // Close mobile navigation
  if (linkEl.classList.contains("nav-link")) {
    const headerEl = document.querySelector(".header");
    headerEl.classList.remove("nav-open");
  }

  // Smooth scrolling
  if (href === "#") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    const sectionEl = document.querySelector(href);
    sectionEl.scrollIntoView({
      behavior: "smooth",
    });
  }
});

///////////////////////////////////////////////////////////
// Sticky navigation
const sectionHeroEl = document.querySelector(".section-hero");

const observer = new IntersectionObserver(stickyNav, {
  // In the viewport
  root: null,
  threshold: 0,
  rootMargin: "-80px",
});
observer.observe(sectionHeroEl);

function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    document.body.classList.add("sticky");
  } else {
    document.body.classList.remove("sticky");
  }
}

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();
