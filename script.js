// ==============================
// Portfolio Website Interactions
// Professional Responsive + Animation Version
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
  const submitBtn = contactForm?.querySelector('button[type="submit"]');
  const year = document.getElementById("year");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isMobile = window.matchMedia("(max-width: 760px)").matches;

  const EMAILJS_PUBLIC_KEY = "STmq8AT68-XTyw6Fe";
  const EMAILJS_SERVICE_ID = "service_n05pses";
  const EMAILJS_TEMPLATE_ID = "template_451ur3v";

  if (window.emailjs) {
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (error) {
      console.error("EmailJS init error:", error);
    }
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  let ticking = false;
  let lastScrollY = window.scrollY;

  const updateHeaderState = () => {
    if (header) {
      header.classList.toggle("scrolled", lastScrollY > 16);
    }
    ticking = false;
  };

  const onScroll = () => {
    lastScrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeaderState);
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMobileMenu = () => {
    if (!navToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const openMobileMenu = () => {
    if (!navToggle || !siteNav) return;
    siteNav.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    if (window.innerWidth <= 760) {
      document.body.style.overflow = "hidden";
    }
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.contains("is-open");
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu, { passive: true });
    });

    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 760 &&
        siteNav.classList.contains("is-open") &&
        !siteNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    window.addEventListener(
      "resize",
      () => {
        isMobile = window.matchMedia("(max-width: 760px)").matches;
        if (window.innerWidth > 760) {
          closeMobileMenu();
        }
      },
      { passive: true }
    );
  }

  skillCards.forEach((card) => {
    const fill = card.querySelector(".skill-progress-fill");
    const level = card.dataset.level || 0;
    if (fill) {
      fill.style.width = prefersReducedMotion ? `${level}%` : "0%";
    }
  });

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    skillCards.forEach((card) => {
      const fill = card.querySelector(".skill-progress-fill");
      const level = card.dataset.level || 0;
      if (fill) fill.style.width = `${level}%`;
    });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target;
          el.classList.add("is-visible");

          if (el.classList.contains("skill-card")) {
            const level = el.dataset.level;
            const fill = el.querySelector(".skill-progress-fill");
            if (fill && level) {
              fill.style.width = `${level}%`;
            }
          }

          observer.unobserve(el);
        }
      },
      {
        threshold: isMobile ? 0.08 : 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    skillCards.forEach((card) => {
      const fill = card.querySelector(".skill-progress-fill");
      const level = card.dataset.level || 0;
      if (fill) fill.style.width = `${level}%`;
    });
  }

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    let activeId = "";

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const currentId = entry.target.getAttribute("id");
          if (!currentId || currentId === activeId) continue;

          activeId = currentId;

          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
          });
        }
      },
      {
        threshold: isMobile ? 0.22 : 0.35,
        rootMargin: isMobile ? "-70px 0px -55% 0px" : "-80px 0px -45% 0px",
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!window.emailjs) {
        formMessage.textContent = "Email service failed to load.";
        formMessage.style.color = "#ef4444";
        return;
      }

      const userName = nameInput ? nameInput.value.trim() : "";
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";

      formMessage.textContent = "Sending your message...";
      formMessage.style.color = "#d7b5ff";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;
        submitBtn.style.opacity = "0.8";
        submitBtn.style.cursor = "not-allowed";
      }

      try {
        const response = await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          contactForm,
          EMAILJS_PUBLIC_KEY
        );

        console.log("EmailJS Success:", response);

        formMessage.textContent = userName
          ? `Thanks, ${userName}. Your message was sent successfully!`
          : "Your message was sent successfully!";
        formMessage.style.color = "#22c55e";

        contactForm.reset();
      } catch (error) {
        console.error("EmailJS Error:", error);
        formMessage.textContent = "Failed to send message. Please try again.";
        formMessage.style.color = "#ef4444";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.style.opacity = "1";
          submitBtn.style.cursor = "pointer";
        }
      }
    });
  }
});
