/* ===========================================================
   ACHINT — PORTFOLIO  ·  main.js
   1. laptop-opening intro (GSAP timeline)
   2. OS interface: menubar, clock, dock magnification
   3. hero: split text, swinging ID-card (pendulum physics)
   4. scroll animations (ScrollTrigger + Lenis smooth scroll)
   Everything degrades gracefully if the CDN scripts fail.
   =========================================================== */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);

  const intro = $("#intro");
  const menubar = $("#menubar");
  const dockWrap = $("#dockWrap");

  /* ---------- helpers that work with or without GSAP ---------- */
  const fmtClock = (withDate) => {
    const d = new Date();
    const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
    if (!withDate) return time;
    const day = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }).replace(/,/g, "");
    return `${day}  ${time}`;
  };
  const tickClock = () => {
    const a = $("#mbClock"); if (a) a.textContent = fmtClock(true);
    const b = $("#deskClock"); if (b) b.textContent = fmtClock(false);
  };
  tickClock(); setInterval(tickClock, 15000);

  // mobile menu
  const toggle = $("#menuToggle"), links = $("#mbLinks");
  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  /* ---------- fallback: no GSAP or reduced motion ---------- */
  function showEverything() {
    document.documentElement.classList.remove("js");
    document.body.classList.remove("is-intro");
    intro?.remove();
    $$(".reveal,.rv").forEach(el => { el.style.opacity = 1; });
    const s = $("#scrollProgress"); if (s) s.style.display = "none";
    basicAnchors();
    basicCarousel();
    basicActiveSection();
  }
  function basicAnchors() {
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const t = $(a.getAttribute("href")); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      links?.classList.remove("open"); toggle?.setAttribute("aria-expanded", "false");
    }));
  }
  function basicCarousel() {
    const c = $("#projectCarousel"); if (!c) return;
    $("#prevProject")?.addEventListener("click", () => c.scrollBy({ left: -450, behavior: "smooth" }));
    $("#nextProject")?.addEventListener("click", () => c.scrollBy({ left: 450, behavior: "smooth" }));
    const upd = () => {
      const max = c.scrollWidth - c.clientWidth, r = max > 0 ? c.scrollLeft / max : 0;
      const p = $("#carouselProgress"); if (p) p.style.transform = `scaleX(${Math.max(.25, r)})`;
      const cards = $$(".project-card", c); let a = 0;
      cards.forEach((k, i) => { if (k.offsetLeft - c.offsetLeft <= c.scrollLeft + 80) a = i; });
      const n = $("#carouselCount"); if (n) n.textContent = `${String(a + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    };
    c.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  }
  function basicActiveSection() {
    const ids = ["home", "about", "approach", "work", "journey", "contact"];
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) $$(".dock-item").forEach(d => d.classList.toggle("active", d.dataset.sec === e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach(id => { const el = document.getElementById(id); el && io.observe(el); });
  }

  if (!hasGSAP || reduce) { showEverything(); return; }

  /* =========================================================
     GSAP SETUP
     ========================================================= */
  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const barH = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) || 38;
  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: -barH() - 14, duration: 1.5, easing: t => 1 - Math.pow(1 - t, 4) });
    else target.scrollIntoView({ behavior: "smooth" });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const href = a.getAttribute("href"); if (href.length < 2) return;
    const t = $(href); if (!t) return;
    e.preventDefault();
    if (document.body.classList.contains("is-intro")) return;
    links?.classList.remove("open"); toggle?.setAttribute("aria-expanded", "false");
    if (href === "#home") (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }));
    else scrollToTarget(t);
  }));

  /* ---------- split words into masked spans ---------- */
  function splitWords(el) {
    const label = el.textContent.replace(/\s+/g, " ").trim();
    const words = [];
    const build = (src, dst) => {
      src.childNodes.forEach(n => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { dst.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const i = document.createElement("span"); i.className = "wi"; i.textContent = tok;
            w.appendChild(i); dst.appendChild(w); words.push(i);
          });
        } else if (n.nodeName === "BR") dst.appendChild(n.cloneNode());
        else { const c = n.cloneNode(false); build(n, c); dst.appendChild(c); }
      });
    };
    const frag = document.createDocumentFragment();
    build(el, frag);
    el.textContent = ""; el.appendChild(frag);
    el.setAttribute("aria-label", label);
    return words;
  }

  /* ---------- keyboard for the laptop deck ---------- */
  (function buildKeys() {
    const keys = $("#keys"); if (!keys) return;
    const rows = [
      [1.4, ...Array(13).fill(1)],
      Array(14).fill(1),
      [1.6, ...Array(12).fill(1), 1.6],
      [2, ...Array(11).fill(1), 2],
      [2.4, ...Array(10).fill(1), 2.4],
      [1, 1, 1, 1.3, 5.5, 1.3, 1, 1, 1]
    ];
    rows.forEach(r => {
      const row = document.createElement("div"); row.className = "row";
      row.style.gridTemplateColumns = r.map(v => v + "fr").join(" ");
      r.forEach(() => row.appendChild(document.createElement("i")));
      keys.appendChild(row);
    });
  })();

  /* ---------- initial hidden states (intro covers the page) ---------- */
  gsap.set(menubar, { yPercent: -100 });
  gsap.set(dockWrap, { yPercent: 160 });
  const heroTitle = $("#heroTitle");
  const heroWords = splitWords(heroTitle);
  gsap.set(heroWords, { yPercent: 118 });
  const heroRv = $$(".hero .rv");
  gsap.set(heroRv, { opacity: 0, y: 30 });
  gsap.set(".note-top", { rotation: 5 });
  gsap.set(".note-bottom", { rotation: -5 });
  gsap.set(".hero-orbit", { opacity: 0, scale: .85 });
  gsap.set("#swing", { opacity: 0 });

  /* =========================================================
     LAPTOP-OPENING INTRO
     ========================================================= */
  const loaded = new Promise(res => {
    const done = () => (document.fonts && document.fonts.ready ? document.fonts.ready.then(res, res) : res());
    document.readyState === "complete" ? done() : addEventListener("load", done, { once: true });
    setTimeout(res, 8000); // never hang
  });
  let siteStarted = false, introTL = null;

  function runIntro() {
    const wrap = $("#laptopWrap"), lid = $("#lid"), deckLight = $("#deckLight"), keysEl = $("#keys");
    const boot = $("#boot"), desk = $("#desk"), glow = $(".intro-glow"), skip = $("#introSkip");
    const fill = $("#bootFill"), pct = $("#bootPct"), txt = $("#bootText");
    const w = wrap.offsetWidth, h = wrap.offsetHeight, bz = w * .022;
    const vw = innerWidth, vh = innerHeight;
    const sw = w - bz * 2, sh = h - bz * 2;
    let zoom = Math.max(vw / sw, vh / sh) * 1.02;
    if (vh > vw) zoom = (vw / sw) * 1.2;           // portrait phones: fit width, fade covers the rest

    // starting pose: laptop closed, viewed from above-left
    gsap.set(wrap, { rotationX: -30, rotationY: -16, scale: .7, y: -.60 * h, transformOrigin: "50% 50%" });
    gsap.set(lid, { rotationX: -90, transformOrigin: "50% 100%" });
    gsap.set(".desk-bar", { yPercent: -100 });
    gsap.set(".desk-win", { opacity: 0, y: 26, scale: .92 });
    gsap.set(".desk-dock i", { opacity: 0, y: 22 });
    gsap.set(".boot-mark", { opacity: 0, scale: .9 });

    const stages = [
      [0, "STARTING UP"], [.22, "LOADING FONTS"], [.45, "COMPILING IDEAS"], [.72, "BUILDING INTERFACE"], [.97, "READY"]
    ];
    const prog = { v: 0 };

    const tl = introTL = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finishIntro });

    // 1 — stage fades in, closed laptop settles
    tl.to(glow, { opacity: 1, duration: 1.4 }, 0)
      .to("#introVeil", { opacity: 0, duration: 1.2, ease: "power2.out" }, .1)
      .to(wrap, { scale: .86, duration: .9 }, .1)
      .fromTo(".lid-sheen", { xPercent: -60 }, { xPercent: 60, duration: 1.2, ease: "power2.inOut" }, .35)
      .to(skip, { opacity: 1, duration: .6 }, .6);

    // 2 — lid opens, camera lowers
    tl.addLabel("open", 1.0)
      .to(lid, { rotationX: 7, duration: 2.0, ease: "power3.inOut" }, "open")
      .to(wrap, { rotationX: -13, rotationY: 0, scale: 1, y: -.17 * h, duration: 2.2, ease: "power2.inOut" }, "open")
      .to(deckLight, { opacity: 1, duration: 1.2, ease: "power1.inOut" }, "open+=1.1")
      .add(() => keysEl.classList.add("lit"), "open+=1.3");

    // 3 — screen wakes, boot / loading
    tl.to(boot, { opacity: 1, duration: .5, ease: "power1.out" }, "open+=1.6")
      .to(".boot-mark", { opacity: 1, scale: 1, duration: .8 }, "open+=1.7")
      .to(prog, {
        v: 1, duration: 2.1, ease: "power1.inOut",
        onUpdate() {
          const v = prog.v;
          fill.style.transform = `scaleX(${v})`;
          pct.textContent = Math.round(v * 100) + "%";
          for (let i = stages.length - 1; i >= 0; i--) if (v >= stages[i][0]) { if (txt.textContent !== stages[i][1]) txt.textContent = stages[i][1]; break; }
        }
      }, "open+=1.9")
      .add(() => { // wait for the real page load if it hasn't finished
        let ready = false; loaded.then(() => (ready = true));
        Promise.resolve().then(() => { if (!ready) { tl.pause(); loaded.then(() => tl.resume()); } });
      });

    // 4 — desktop appears inside the screen
    tl.to(boot, { opacity: 0, duration: .4, ease: "power1.in" }, ">+.2")
      .to(desk, { opacity: 1, duration: .7, ease: "power1.out" }, "<+.1")
      .to(".desk-bar", { yPercent: 0, duration: .7 }, "<+.1")
      .to(".desk-win", { opacity: 1, y: 0, scale: 1, duration: .9, ease: "back.out(1.5)" }, "<+.1")
      .to(".desk-dock i", { opacity: 1, y: 0, duration: .6, stagger: .07, ease: "back.out(2)" }, "<+.25");

    // 5 — camera pushes into the screen
    tl.addLabel("zoom", ">+.55")
      .to(lid, { rotationX: 0, duration: 1.5, ease: "power3.inOut" }, "zoom")
      .to(wrap, { rotationX: 0, rotationY: 0, y: 0, scale: zoom, duration: 1.65, ease: "power3.inOut" }, "zoom")
      .to(glow, { opacity: 0, duration: .8 }, "zoom")
      .to(skip, { opacity: 0, duration: .3 }, "zoom");

    // 6 — hand over to the real site
    tl.add(startSite, "zoom+=1.15")
      .to(intro, { opacity: 0, duration: .85, ease: "power2.inOut" }, "zoom+=1.2");
  }

  function finishIntro() {
    if (!intro.isConnected) return;
    intro.style.display = "none";
    intro.remove();
    document.body.classList.remove("is-intro");
    ScrollTrigger.refresh();
  }

  $("#introSkip")?.addEventListener("click", () => {
    if (!introTL) return;
    introTL.kill();
    startSite();
    gsap.to(intro, { opacity: 0, duration: .55, ease: "power2.out", onComplete: finishIntro });
  });

  /* =========================================================
     SITE START (after intro)
     ========================================================= */
  function startSite() {
    if (siteStarted) return; siteStarted = true;
    document.body.classList.remove("is-intro");
    lenis?.start();
    ScrollTrigger.refresh();

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(menubar, { yPercent: 0, duration: 1, ease: "power3.out" }, 0)
      .to(".hero-orbit", { opacity: 1, scale: 1, duration: 1.8, stagger: .15, ease: "power3.out" }, .1)
      .to(heroWords, { yPercent: 0, duration: 1.25, stagger: .075 }, .15)
      .to(heroRv, { opacity: 1, y: 0, duration: 1, stagger: .1, ease: "power3.out" }, .35)
      .to(dockWrap, { yPercent: 0, duration: 1.1, ease: "back.out(1.5)" }, .9)
      .add(() => { startLanyard(); document.body.classList.add("cursor-ready"); }, .5);
  }

  /* =========================================================
     LANYARD — pendulum physics + drag
     ========================================================= */
  let lanyardStarted = false;
  function startLanyard() {
    if (lanyardStarted) return; lanyardStarted = true;
    const swing = $("#swing"), card = $("#idCard"), anchor = $(".anchor");
    if (!swing || !card || !anchor) return;
    const small = innerWidth < 680;
    const maxA = small ? .5 : .8;
    let ang = small ? .4 : .55, vel = 0, dragging = false, offset = 0, lastP = 0, lastT = 0, inView = true;
    const K = 8.5, C = .85;                       // gravity/length, damping
    gsap.fromTo(swing, { opacity: 0 }, { opacity: 1, duration: .5, ease: "power1.out" });

    new IntersectionObserver(es => { inView = es[0].isIntersecting; }, { threshold: 0 }).observe($("#home"));
    let prev = performance.now();
    gsap.ticker.add(() => {
      const now = performance.now();
      const dt = Math.min((now - prev) / 1000, .033); prev = now;
      if (!inView && !dragging) return;
      if (!dragging) {
        const wind = Math.sin(now / 1350) * .22 + Math.sin(now / 770) * .08;
        const acc = -K * Math.sin(ang) - C * vel + wind;
        vel += acc * dt; ang += vel * dt;
      }
      swing.style.transform = `rotate(${(ang * 180 / Math.PI).toFixed(3)}deg)`;
    });

    const pointerAngle = (e) => {
      const r = anchor.getBoundingClientRect();
      return -Math.atan2(e.clientX - r.left, Math.max(40, e.clientY - r.top));
    };
    card.addEventListener("pointerdown", e => {
      dragging = true; card.setPointerCapture(e.pointerId);
      offset = ang - pointerAngle(e); lastP = ang; lastT = performance.now(); vel = 0;
    });
    card.addEventListener("pointermove", e => {
      if (!dragging) return;
      const a = Math.max(-maxA, Math.min(maxA, pointerAngle(e) + offset));
      const t = performance.now(), dt = Math.max(.001, (t - lastT) / 1000);
      vel = vel * .6 + ((a - lastP) / dt) * .4; lastP = a; lastT = t; ang = a;
    });
    const release = () => { if (!dragging) return; dragging = false; vel = Math.max(-9, Math.min(9, vel)); };
    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);

    // 3D face tilt + holographic shine on hover
    gsap.set(card, { transformPerspective: 800 });
    const rx = gsap.quickTo(card, "rotationX", { duration: .6, ease: "power3.out" });
    const ry = gsap.quickTo(card, "rotationY", { duration: .6, ease: "power3.out" });
    const shine = $(".id-shine", card);
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      rx((.5 - y) * 14); ry((x - .5) * 16);
      if (shine) { shine.style.setProperty("--sx", x * 100 + "%"); shine.style.setProperty("--sy", y * 100 + "%"); }
    });
    card.addEventListener("pointerleave", () => { rx(0); ry(0); });
  }

  /* =========================================================
     CURSOR + MAGNETIC BUTTONS
     ========================================================= */
  if (finePointer) {
    document.body.classList.add("has-cursor");
    const dot = $("#cursorDot"), ring = $("#cursorRing");
    const dx = gsap.quickTo(dot, "x", { duration: .08, ease: "none" }), dy = gsap.quickTo(dot, "y", { duration: .08, ease: "none" });
    const rxq = gsap.quickTo(ring, "x", { duration: .5, ease: "power3.out" }), ryq = gsap.quickTo(ring, "y", { duration: .5, ease: "power3.out" });
    addEventListener("pointermove", e => { dx(e.clientX); dy(e.clientY); rxq(e.clientX); ryq(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", e => { ring.classList.toggle("hot", !!e.target.closest("a,button,.id-card,.project-card,.dock-item,.skill-cloud span")); });

    $$(".magnetic").forEach(b => {
      const mx = gsap.quickTo(b, "x", { duration: .5, ease: "power3.out" }), my = gsap.quickTo(b, "y", { duration: .5, ease: "power3.out" });
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * .3); my((e.clientY - (r.top + r.height / 2)) * .4);
      });
      b.addEventListener("pointerleave", () => { gsap.to(b, { x: 0, y: 0, duration: .9, ease: "elastic.out(1,.45)", overwrite: true }); });
    });

    // hero parallax on mouse
    const hero = $("#home");
    const orbs = $$(".hero-orbit").map(el => ({ d: parseFloat(el.dataset.depth) || 10, x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }) }));
    hero.addEventListener("pointermove", e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      orbs.forEach(o => { o.x(nx * o.d * 3); o.y(ny * o.d * 3); });
    });
  }

  /* =========================================================
     DOCK — macOS-style magnification
     ========================================================= */
  (function dock() {
    const dockEl = $("#dock"); if (!dockEl) return;
    const kids = [...dockEl.children];
    gsap.set(kids, { transformOrigin: "50% 100%" });
    if (!finePointer) return;
    let cache = null;
    const measure = () => {
      cache = kids.map(k => {
        const r = k.getBoundingClientRect(), s = gsap.getProperty(k, "scale") || 1, x = gsap.getProperty(k, "x") || 0;
        const w = r.width / s;
        return { l: r.left + r.width / 2 - w / 2 - x, w };
      });
    };
    dockEl.addEventListener("pointerenter", measure);
    dockEl.addEventListener("pointermove", e => {
      if (!cache) measure();
      const MAX = 1.6, SIG = 66;
      const sc = cache.map((c, i) => kids[i].classList.contains("dock-sep") ? 1 : 1 + (MAX - 1) * Math.exp(-Math.pow((e.clientX - (c.l + c.w / 2)) / SIG, 2)));
      const sumS = cache.reduce((a, c, i) => a + c.w * sc[i], 0), sumB = cache.reduce((a, c) => a + c.w, 0);
      let cursor = cache[0].l - (sumS - sumB) / 2;
      kids.forEach((k, i) => {
        const c = cache[i], S = c.w * sc[i];
        gsap.to(k, { x: cursor + S / 2 - (c.l + c.w / 2), scale: sc[i], duration: .25, ease: "power3.out", overwrite: "auto" });
        const nx = cache[i + 1]; cursor += S + (nx ? nx.l - (c.l + c.w) : 0);
      });
    });
    dockEl.addEventListener("pointerleave", () => { cache = null; gsap.to(kids, { x: 0, scale: 1, duration: .55, ease: "elastic.out(1,.6)", overwrite: "auto" }); });
  })();

  /* =========================================================
     SCROLL ANIMATIONS
     ========================================================= */
  gsap.to("#scrollProgress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: .3 } });

  // active section → dock
  ["home", "about", "approach", "work", "journey", "contact"].forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: "top 55%", end: "bottom 55%",
      onToggle: self => { if (self.isActive) $$(".dock-item").forEach(d => d.classList.toggle("active", d.dataset.sec === id)); }
    });
  });

  // parallax: hero + wallpaper blobs
  gsap.to(".hero-visual", { y: -70, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-copy", { y: -40, opacity: .35, ease: "none", scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: true } });
  [[".b1", 260], [".b2", -200], [".b3", 160]].forEach(([s, y]) =>
    gsap.to(s, { y, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.2 } }));

  // marquee — reacts to scroll speed + direction
  const track = $("#loopTrack");
  if (track) {
    const loop = gsap.to(track, { xPercent: -33.3333, duration: 24, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: self => {
        const dir = self.direction, boost = 1 + Math.min(Math.abs(self.getVelocity()) / 260, 7);
        gsap.to(loop, { timeScale: dir * boost, duration: .25, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.3, ease: "power2.out" }) });
      }
    });
  }

  // section headings — masked word reveal
  $$(".split").forEach(h => {
    const words = splitWords(h);
    gsap.from(words, { yPercent: 118, duration: 1.2, stagger: .07, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 88%", once: true } });
  });

  // windows rise in
  $$(".reveal").forEach(el => {
    gsap.fromTo(el, { y: 80, opacity: 0, scale: .965 }, {
      y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true }
    });
  });

  // small elements inside sections — batched stagger
  const rvEls = $$("main .rv").filter(el => !el.closest(".hero"));
  gsap.set(rvEls, { y: 32 });
  ScrollTrigger.batch(rvEls, {
    start: "top 92%", once: true,
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: .09, ease: "power3.out", overwrite: true })
  });

  // graduation count-up
  $$("[data-count]").forEach(el => {
    const to = +el.dataset.count, from = +el.dataset.from || 0, o = { v: from };
    el.textContent = from;
    ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) })
    });
  });

  // approach pipeline — line draws on scroll, steps light up
  const steps = $$(".pipeline-step");
  gsap.from(steps, { y: 46, opacity: 0, duration: 1, stagger: .15, ease: "power3.out", scrollTrigger: { trigger: "#pipeline", start: "top 82%", once: true } });
  gsap.to("#pipeLine", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#pipeline", start: "top 72%", end: "bottom 60%", scrub: .6 } });
  steps.forEach(s => ScrollTrigger.create({ trigger: s, start: "top 74%", onEnter: () => s.classList.add("on"), onLeaveBack: () => s.classList.remove("on") }));

  // project cards entrance + tilt
  const carousel = $("#projectCarousel");
  const cards = $$(".project-card");
  if (carousel) {
    gsap.from(cards, { x: 120, opacity: 0, rotation: 2, duration: 1.2, stagger: .13, ease: "power3.out", scrollTrigger: { trigger: carousel, start: "top 88%", once: true } });
  }
  function addTilt(el, strength = 8) {
    if (!el || !finePointer) return;
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: .5, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: .5, ease: "power3.out" });
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      rx((.5 - y) * strength); ry((x - .5) * strength);
      el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%"); el.style.setProperty("--glare-opacity", ".9");
    });
    el.addEventListener("pointerleave", () => { rx(0); ry(0); el.style.setProperty("--glare-opacity", "0"); });
  }
  cards.forEach(c => addTilt(c, 7));
  addTilt($("#profileCard"), 6);

  // carousel: arrows, mouse-drag with inertia, progress
  if (carousel) {
    const prog = $("#carouselProgress"), count = $("#carouselCount");
    const update = () => {
      const max = carousel.scrollWidth - carousel.clientWidth, r = max > 0 ? carousel.scrollLeft / max : 0;
      if (prog) gsap.to(prog, { scaleX: Math.max(.25, r), duration: .25, ease: "power2.out", overwrite: true });
      let a = 0; cards.forEach((k, i) => { if (k.offsetLeft - carousel.offsetLeft <= carousel.scrollLeft + 80) a = i; });
      if (count) count.textContent = `${String(a + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    };
    carousel.addEventListener("scroll", update, { passive: true }); addEventListener("resize", update); update();
    const stepW = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 450);
    $("#prevProject")?.addEventListener("click", () => carousel.scrollBy({ left: -stepW(), behavior: "smooth" }));
    $("#nextProject")?.addEventListener("click", () => carousel.scrollBy({ left: stepW(), behavior: "smooth" }));

    let down = false, sx = 0, sl = 0, moved = 0, lastX = 0, v = 0;
    carousel.addEventListener("pointerdown", e => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = 0; sx = lastX = e.clientX; sl = carousel.scrollLeft; v = 0;
    });
    addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) carousel.classList.add("dragging");
      carousel.scrollLeft = sl - dx; v = v * .7 + (lastX - e.clientX) * .3; lastX = e.clientX;
    });
    const up = () => {
      if (!down) return; down = false;
      if (!carousel.classList.contains("dragging")) return;
      const target = carousel.scrollLeft + v * 18;
      let best = 0, bd = Infinity;
      cards.forEach((k, i) => { const d = Math.abs(k.offsetLeft - carousel.offsetLeft - target); if (d < bd) { bd = d; best = i; } });
      carousel.scrollTo({ left: cards[best].offsetLeft - carousel.offsetLeft, behavior: "smooth" });
      setTimeout(() => carousel.classList.remove("dragging"), 650);
    };
    addEventListener("pointerup", up); addEventListener("pointercancel", up);
    carousel.addEventListener("click", e => { if (moved > 6) e.preventDefault(); }, true);
  }

  // contact: email "types itself"
  const typed = $("#mailTyped");
  if (typed) {
    const full = typed.dataset.text || "", o = { n: 0 };
    ScrollTrigger.create({
      trigger: ".mail-to", start: "top 92%", once: true,
      onEnter: () => gsap.to(o, { n: full.length, duration: 1.6, ease: "none", delay: .5, onUpdate: () => (typed.textContent = full.slice(0, Math.round(o.n))) })
    });
  }

  loaded.then(() => ScrollTrigger.refresh());

  /* =========================================================
     GO
     ========================================================= */
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", runIntro, { once: true });
  else runIntro();
})();
