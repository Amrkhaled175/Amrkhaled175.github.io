// ==============================
// Portfolio Website Interactions
// Optimized Version with EmailJS
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const sections = document.querySelectorAll("main section[id]");
  const revealItems = document.querySelectorAll(".reveal");
  const skillCards = document.querySelectorAll(".skill-card");
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const nameInput = document.getElementById("name");
  const year = document.getElementById("year");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Header scroll state
  let ticking = false;
  const updateHeaderState = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  };
  updateHeaderState();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile navigation
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen && window.innerWidth <= 760 ? "hidden" : "";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        siteNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // Skill bars initial state
  skillCards.forEach((card) => {
    const fill = card.querySelector(".skill-progress-fill");
    if (fill) {
      fill.style.width = prefersReducedMotion ? `${card.dataset.level || 0}%` : "0%";
    }
  });

  // Reveal animations
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          if (entry.target.classList.contains("skill-card")) {
            const level = entry.target.dataset.level;
            const fill = entry.target.querySelector(".skill-progress-fill");
            if (fill && level) {
              fill.style.width = `${level}%`;
            }
          }

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Active nav link on section view
  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const isMatch = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("active", isMatch);
          });
        });
      },
      {
        threshold: 0.45,
        rootMargin: "-80px 0px -35% 0px",
      }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Contact form submission with EmailJS
  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const userName = nameInput ? nameInput.value.trim() : "";

      // Local feedback before sending
      formMessage.textContent = "Sending your message...";

      // Send via EmailJS
      emailjs
        .sendForm(service_n05pses, __ejs-test-mail-service, contactForm)
        .then(
          () => {
            formMessage.textContent = userName
              ? `Thanks, ${userName}. Your message was sent successfully!`
              : "Your message was sent successfully!";
            contactForm.reset();
          },
          () => {
            formMessage.textContent = "Failed to send message. Please try again.";
          }
        );
    });
  }
});
