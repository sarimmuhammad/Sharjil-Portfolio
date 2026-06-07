// =========================================
//  NAVBAR — scroll state + active link
// =========================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled state
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// =========================================
//  HAMBURGER MENU
// =========================================
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close menu on link click
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

// =========================================
//  SCROLL REVEAL — IntersectionObserver
// =========================================
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings inside same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      siblings.forEach((el, idx) => {
        setTimeout(() => el.classList.add('visible'), idx * 80);
      });
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => observer.observe(el));

// =========================================
//  SMOOTH SCROLL for anchor links
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    const offset = 80;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

// =========================================
//  CONTACT FORM — simple UX
// =========================================
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", async (e) => {
e.preventDefault(); // 🔥 BLOCKS ALL REDIRECTS
  const btn = form.querySelector("button");
  btn.disabled = true;
  btn.textContent = "Sending...";

  const response = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: {
      Accept: "application/json"
    }
  });

  if (response.ok) {
    form.style.display = "none";
    successMessage.classList.add("show");
    form.reset();
  } else {
    btn.disabled = false;
    btn.textContent = "Send Message";
    alert("Something went wrong. Please try again.");
  }
});
// =========================================
//  HERO — subtle parallax on scroll
// =========================================
const heroText = document.querySelector('.hero-text');
const heroPhoto = document.querySelector('.hero-photo');

window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    const y = window.scrollY;
    if (heroText) heroText.style.transform = `translateY(${y * 0.08}px)`;
    if (heroPhoto) heroPhoto.style.transform = `translateY(${y * 0.05}px)`;
  }
}, { passive: true });

// =========================================
//  SKILL TAGS — hover ripple effect
// =========================================
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.25s ease';
  });
});

// =========================================
//  EXP CARDS — subtle hover glow
// =========================================
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

// =========================================
//  YEAR COUNTER ANIMATION (stats)
// =========================================
function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const strongs = entry.target.querySelectorAll('.stat strong');
      strongs.forEach(el => {
        const raw = el.textContent;
        const num = parseInt(raw);
        if (!isNaN(num)) {
          el.dataset.suffix = raw.replace(String(num), '');
          animateCount(el, num);
        }
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(el => statObserver.observe(el));
