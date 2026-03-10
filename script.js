// ==============================
// Portfolio Website Interactions
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  // Header and navigation elements
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");

  // Reveal animation elements
  const revealItems = document.querySelectorAll(".reveal");
  const skillCards = document.querySelectorAll(".skill-card");

  // Contact form elements
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const nameInput = document.getElementById("name");

  // Footer year
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Add visual state to the header when the page is scrolled
  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState);

  // Mobile navigation toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Reset mobile menu state on larger screens
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        siteNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Prepare skill bars before animation starts
  skillCards.forEach((card) => {
    const fill = card.querySelector(".skill-progress-fill");
    if (fill) {
      fill.style.width = "0%";
    }
  });

  // Scroll reveal observer
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        // Animate skill progress bars when cards appear
        if (entry.target.classList.contains("skill-card")) {
          const level = entry.target.dataset.level;
          const fill = entry.target.querySelector(".skill-progress-fill");

          if (fill && level) {
            fill.style.width = `${level}%`;
          }
        }

        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => observer.observe(item));

  // Simple form feedback
  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const userName = nameInput ? nameInput.value.trim() : "";

      formMessage.textContent = userName
        ? `Thanks, ${userName}. Your message has been captured. Connect this form to your email service or backend to receive real submissions.`
        : "Your message has been captured. Connect this form to your email service or backend to receive real submissions.";

      contactForm.reset();
    });
  }
});