// Application state and configuration
const App = {
  currentSection: "home",
  mobileMenuOpen: false,

  // Initialize the application
  init() {
    this.setupEventListeners();
    this.setupScrollIndicator();
    this.setupIntersectionObserver();
    this.setupMobileMenu();
    this.setupProjectFiltering();
    this.setupSkillBars();
    this.setupContactForm();
    this.setupTypingAnimation();
    this.animateCounters();
    this.updateDateTime();

    // Update date time every second
    setInterval(() => this.updateDateTime(), 1000);
  },

  // Setup event listeners
  setupEventListeners() {
    // Navigation links
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("nav-link") ||
        e.target.classList.contains("mobile-nav-link")
      ) {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        this.navigateToSection(targetId);

        // Close mobile menu if open
        if (this.mobileMenuOpen) {
          this.toggleMobileMenu(false);
        }
      }
    });

    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.scrollToTop();
      });
    }

    // Show/hide back to top button based on scroll position
    window.addEventListener("scroll", () => {
      const backToTopBtn = document.getElementById("backToTop");
      if (backToTopBtn) {
        if (window.pageYOffset > 300) {
          backToTopBtn.style.opacity = "1";
          backToTopBtn.style.transform = "translateY(0)";
        } else {
          backToTopBtn.style.opacity = "0.7";
          backToTopBtn.style.transform = "translateY(0)";
        }
      }
    });

    // Smooth scroll for internal links
    document.addEventListener("click", (e) => {
      if (
        e.target.tagName === "A" &&
        e.target.getAttribute("href")?.startsWith("#")
      ) {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && this.mobileMenuOpen) {
        this.toggleMobileMenu(false);
      }
    });

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.mobileMenuOpen) {
        this.toggleMobileMenu(false);
      }
    });
  },

  // Scroll to top function
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Update navigation to show home section as active
    setTimeout(() => {
      this.updateActiveNavLink("home");
    }, 100);
  },

  // Navigate to a specific section
  navigateToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offsetTop =
        targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      this.currentSection = sectionId;
      this.updateActiveNavLink(sectionId);
    }
  },

  // Update active navigation link
  updateActiveNavLink(sectionId) {
    // Remove active classes from all nav links
    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
      link.classList.remove("text-blue-400", "font-semibold");
      link.classList.add("text-gray-300");
    });

    // Add active classes to current section link
    document.querySelectorAll(`[href="#${sectionId}"]`).forEach((link) => {
      link.classList.add("text-blue-400", "font-semibold");
      link.classList.remove("text-gray-300");
    });
  },

  // Setup scroll progress indicator
  setupScrollIndicator() {
    const indicator = document.getElementById("scrollIndicator");

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
      indicator.style.width = scrollPercent + "%";
    });
  },

  // Setup intersection observer for section visibility
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Update active nav link based on visible section
            if (entry.intersectionRatio > 0.3) {
              this.updateActiveNavLink(entry.target.id);
              this.currentSection = entry.target.id;
            }
          }
        });
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    // Observe all sections
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });
  },

  // Setup mobile menu functionality
  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const closeMobileMenu = document.getElementById("closeMobileMenu");

    mobileMenuBtn.addEventListener("click", () => {
      this.toggleMobileMenu(true);
    });

    closeMobileMenu.addEventListener("click", () => {
      this.toggleMobileMenu(false);
    });
  },

  // Toggle mobile menu
  toggleMobileMenu(forceState) {
    const mobileMenu = document.getElementById("mobileMenu");

    // Determine the new state
    const willOpen =
      typeof forceState === "boolean" ? forceState : !this.mobileMenuOpen;

    this.mobileMenuOpen = willOpen;

    // console.log("Toggling menu. Current state:", willOpen);

    if (willOpen) {
      mobileMenu.classList.remove("-translate-x-full");
      mobileMenu.classList.add("translate-x-0");
      document.body.style.overflow = "hidden";
      mobileMenuBtn.innerHTML = "";
    } else {
      mobileMenu.classList.add("-translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
      document.body.style.overflow = "";
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    }
  },

  // Setup project filtering
  setupProjectFiltering() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        // Update active filter button
        filterButtons.forEach((btn) => {
          btn.classList.remove("active", "bg-blue-600", "text-white");
          btn.classList.add("bg-gray-700", "text-gray-300");
        });
        button.classList.add("active", "bg-blue-600", "text-white");
        button.classList.remove("bg-gray-700", "text-gray-300");

        // Filter projects with animation
        projectCards.forEach((card, index) => {
          const category = card.dataset.category;

          if (filter === "all" || category === filter) {
            // Show card with delay for stagger effect
            card.style.display = "block";
            card.style.opacity = "0";
            card.style.transform = "scale(0.8) translateY(20px)";

            setTimeout(() => {
              card.style.transition = "all 0.4s ease";
              card.style.opacity = "1";
              card.style.transform = "scale(1) translateY(0)";
            }, index * 100);
          } else {
            // Hide card
            card.style.transition = "all 0.3s ease";
            card.style.opacity = "0";
            card.style.transform = "scale(0.8) translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  },

  // Setup skill bars animation
  setupSkillBars() {
    const skillBars = document.querySelectorAll(".skill-bar");
    let skillsAnimated = false;

    const animateSkillBars = () => {
      if (skillsAnimated) return;

      skillBars.forEach((bar, index) => {
        const targetWidth = bar.dataset.width;
        if (targetWidth) {
          setTimeout(() => {
            bar.style.width = targetWidth;
            bar.classList.add("animate");
          }, index * 200);
        }
      });
      skillsAnimated = true;
    };

    // Animate when skills section is visible
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              animateSkillBars();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(skillsSection);
    }
  },

  // Setup contact form
  setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Validate form
      if (!this.validateContactForm(data)) {
        return;
      }

      try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<div class="spinner mr-2"></div>Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual endpoint)
        await this.simulateFormSubmission(data);

        // Show success message
        this.showMessage(
          "Message sent successfully! I'll get back to you soon.",
          "success"
        );
        form.reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      } catch (error) {
        console.error("Form submission error:", error);
        this.showMessage(
          "Failed to send message. Please try again later.",
          "error"
        );

        // Reset button
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
      }
    });

    // Add real-time validation
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });

      input.addEventListener("input", () => {
        this.clearFieldError(input);
      });
    });
  },

  // Validate contact form
  validateContactForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push("Message must be at least 10 characters long");
    }

    if (errors.length > 0) {
      this.showMessage(errors.join("<br>"), "error");
      return false;
    }

    return true;
  },

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    switch (field.type) {
      case "email":
        if (value && !this.isValidEmail(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "text":
        if (field.required && value.length < 2) {
          isValid = false;
          errorMessage = "This field must be at least 2 characters long";
        }
        break;
      default:
        if (field.required && value.length < 10) {
          isValid = false;
          errorMessage = "This field must be at least 10 characters long";
        }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  },

  // Show field error
  showFieldError(field, message) {
    this.clearFieldError(field);

    field.classList.add("border-red-500");
    const errorDiv = document.createElement("div");
    errorDiv.className = "text-red-500 text-sm mt-1 field-error";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  },

  // Clear field error
  clearFieldError(field) {
    field.classList.remove("border-red-500");
    const errorDiv = field.parentNode.querySelector(".field-error");
    if (errorDiv) {
      errorDiv.remove();
    }
  },

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Simulate form submission
  async simulateFormSubmission(data) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // console.log("Form submitted:", data);

    if (Math.random() > 0.1) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Simulated network error"));
    }
  },

  showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector(".message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type} p-4 rounded-lg border mb-6`;
    messageDiv.innerHTML = message;

    // Insert message
    const form = document.getElementById("contactForm");
    form.parentNode.insertBefore(messageDiv, form);

    // Animate in
    setTimeout(() => messageDiv.classList.add("show"), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      messageDiv.classList.remove("show");
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  },

  // Setup typing animation
  setupTypingAnimation() {
    const typingElement = document.getElementById("typingText");
    if (!typingElement) return;

    const texts = [
      "Tolu",
      "a Frontend Developer",
      "a Creative Coder",
      "a Problem Solver",
      "a UI/UX Enthusiast",
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    const typeText = () => {
      if (isWaiting) return;

      const currentText = texts[textIndex];

      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 100 : 150;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
        isWaiting = true;
        setTimeout(() => {
          isWaiting = false;
        }, typeSpeed);
        typeSpeed = 100;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before next word
      }

      setTimeout(typeText, typeSpeed);
    };

    // Start typing animation after a brief delay
    setTimeout(typeText, 1000);
  },

  // Animate counters
  animateCounters() {
    const projectsCounter = document.getElementById("projectsCount");
    const yearsCounter = document.getElementById("yearsCount");
    let countersAnimated = false;

    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + "+";
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + "+";
        }
      }, 50);
    };

    // Animate when about section is visible
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio > 0.3 &&
              !countersAnimated
            ) {
              if (projectsCounter) animateCounter(projectsCounter, 35);
              if (yearsCounter) animateCounter(yearsCounter, 5);
              countersAnimated = true;
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(aboutSection);
    }
  },

  // Update date and time
  updateDateTime() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Africa/Lagos",
    };

    const dateTimeElement = document.getElementById("currentDateTime");
    const yearElement = document.getElementById("currentYear");

    if (dateTimeElement) {
      dateTimeElement.textContent = now.toLocaleDateString("en-US", options);
    }

    if (yearElement) {
      yearElement.textContent = now.getFullYear();
    }
  },

  // Utility function to throttle function calls
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Utility function to debounce function calls
  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
};

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// Handle page visibility change
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    App.updateDateTime();
  }
});

// Handle online/offline status
window.addEventListener("online", () => {
  console.log("Connection restored");
});

window.addEventListener("offline", () => {
  console.log("Connection lost");
});

// Export App for potential use in other scripts
window.PortfolioApp = App;