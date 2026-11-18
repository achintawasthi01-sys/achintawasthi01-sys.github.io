
const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


// LOADER
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loader")?.classList.add("done");
  }, 550);
});


// SCROLL REVEAL
if ("IntersectionObserver" in window) {

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);

      }

    });

  }, {
    threshold: 0.12
  });

  $$(".reveal").forEach(element => {
    observer.observe(element);
  });

} else {

  $$(".reveal").forEach(element => {
    element.classList.add("visible");
  });

}


// MOBILE NAVIGATION
$("#menuToggle")?.addEventListener("click", () => {

  $(".nav-links")?.classList.toggle("open");

});

$$(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {

    $(".nav-links")?.classList.remove("open");

  });

});


// 3D TILT EFFECT
function addTilt(element, strength = 9) {

  if (!element) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  element.addEventListener("pointermove", event => {

    const rect = element.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;

    const y = (event.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * strength;

    const rotateY = (x - 0.5) * strength;

    element.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-3px)
    `;

    element.style.setProperty("--mx", `${x * 100}%`);

    element.style.setProperty("--my", `${y * 100}%`);

    element.style.setProperty("--glare-opacity", ".9");

  });

  element.addEventListener("pointerleave", () => {

    element.style.transform = "";

    element.style.setProperty("--glare-opacity", "0");

  });

}


// APPLY TILT TO PROJECT CARDS
$$("[data-holo]").forEach(card => {

  addTilt(card, 7);

});


// PROFILE CARD TILT
addTilt($("#profileCard"), 5);


// DRAGGABLE LANYARD
const idCard = $("#idCard");

if (idCard) {

  let dragging = false;

  let startX = 0;
  let startY = 0;

  let moveX = 0;
  let moveY = 0;

  idCard.addEventListener("pointerdown", event => {

    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    idCard.setPointerCapture(event.pointerId);

    idCard.style.transition = "none";

  });

  idCard.addEventListener("pointermove", event => {

    if (!dragging) return;

    moveX = (event.clientX - startX) * 0.45;

    moveY = (event.clientY - startY) * 0.22;

    moveX = Math.max(-65, Math.min(65, moveX));

    moveY = Math.max(-25, Math.min(25, moveY));

    const rotateY = moveX * 0.12;

    const rotateX = -moveY * 0.08;

    idCard.style.transform = `
      translate(${moveX}px, ${moveY}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      rotate(3deg)
    `;

  });

  function resetCard() {

    dragging = false;

    idCard.style.transition =
      "transform .7s cubic-bezier(.2,.8,.2,1)";

    idCard.style.transform = "rotate(3deg)";

  }

  idCard.addEventListener("pointerup", resetCard);

  idCard.addEventListener("pointercancel", resetCard);

}


// PROJECT CAROUSEL
const carousel = $("#projectCarousel");

const progress = $("#carouselProgress");

const count = $("#carouselCount");


function updateCarousel() {

  if (!carousel) return;

  const maxScroll =
    carousel.scrollWidth - carousel.clientWidth;

  const ratio = maxScroll > 0
    ? carousel.scrollLeft / maxScroll
    : 0;

  if (progress) {

    progress.style.width =
      `${Math.max(25, ratio * 100)}%`;

  }

  const cards = $$(".project-card", carousel);

  let active = 0;

  cards.forEach((card, index) => {

    if (
      card.offsetLeft - carousel.offsetLeft
      <= carousel.scrollLeft + 80
    ) {

      active = index;

    }

  });

  if (count) {

    count.textContent =
      `${String(active + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;

  }

}


$("#prevProject")?.addEventListener("click", () => {

  carousel?.scrollBy({
    left: -460,
    behavior: "smooth"
  });

});


$("#nextProject")?.addEventListener("click", () => {

  carousel?.scrollBy({
    left: 460,
    behavior: "smooth"
  });

});


carousel?.addEventListener("scroll", updateCarousel);

window.addEventListener("resize", updateCarousel);

updateCarousel();


// INTERACTIVE HERO TYPOGRAPHY
const title = $("#pressureTitle");

if (title) {

  title.addEventListener("pointermove", event => {

    const rect = title.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;

    const y = (event.clientY - rect.top) / rect.height;

    title.style.textShadow = `
      ${(x - 0.5) * 5}px
      ${(y - 0.5) * 5}px
      0 rgba(216,169,184,.13)
    `;

  });

  title.addEventListener("pointerleave", () => {

    title.style.textShadow = "";

  });

}
