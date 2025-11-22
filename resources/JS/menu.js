// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const nav = document.querySelector('.nav');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      
      // Close language dropdown if open
      languageDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
        const toggle = dropdown.closest('.language-selector')?.querySelector('.language-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle aria-expanded
      navToggle.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle active classes
      navToggle.classList.toggle('active');
      navList.classList.toggle('active');
      nav.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        nav.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = nav.contains(event.target);
      const isMenuOpen = navList.classList.contains('active');
      
      if (!isClickInsideNav && isMenuOpen) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        nav.classList.remove('menu-open');
      }
    });
  }

  // Language selector functionality
  const languageToggles = document.querySelectorAll('.language-toggle');
  const languageDropdowns = document.querySelectorAll('.language-dropdown');
  
  languageToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const selector = this.closest('.language-selector');
      const dropdown = selector.querySelector('.language-dropdown');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close hamburger menu if open (on mobile)
      if (navToggle && window.innerWidth <= 768) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        nav.classList.remove('menu-open');
      }
      
      // Close all other language dropdowns
      languageDropdowns.forEach(dd => {
        if (dd !== dropdown) {
          dd.classList.remove('active');
          const otherToggle = dd.closest('.language-selector').querySelector('.language-toggle');
          if (otherToggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
      
      // Toggle current dropdown
      this.setAttribute('aria-expanded', !isExpanded);
      dropdown.classList.toggle('active');
    });
  });

  // Close language dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.language-selector')) {
      languageDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
        const toggle = dropdown.closest('.language-selector').querySelector('.language-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Handle language selection
  document.addEventListener('click', function(e) {
    const languageLink = e.target.closest('.language-dropdown a');
    if (languageLink) {
      const href = languageLink.getAttribute('href');
      
      // If href is valid, navigate
      if (href && href !== '#' && href !== '') {
        e.preventDefault();
        e.stopPropagation();
        
        // Close all dropdowns
        languageDropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
          const toggle = dropdown.closest('.language-selector')?.querySelector('.language-toggle');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Navigate
        window.location.href = href;
      }
    }
  });
});

