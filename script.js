(() => {
  // Responsive navigation
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  // Keep the footer year current.
  document.querySelectorAll('[data-year]').forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  // Live project destinations.
  const projectUrls = {
    hillside: 'https://stans-schools.vercel.app/',
    weather: 'https://weatherapp-frontend-dusky.vercel.app/'
  };

  document.querySelectorAll('[data-project-link]').forEach((link) => {
    const key = link.getAttribute('data-project-link');
    const url = projectUrls[key];
    if (!url) return;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.remove('is-unavailable');
  });

  // Add a two-layer crossfade slideshow to each project gallery.
  // The active image changes every 3,000 ms (three seconds).
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-slideshow]').forEach((gallery) => {
    const images = (gallery.dataset.images || '').split('|').map((path) => path.trim()).filter(Boolean);
    const labels = (gallery.dataset.labels || '').split('|').map((label) => label.trim());
    const currentLabel = gallery.querySelector('[data-slide-label]');
    const currentCount = gallery.querySelector('[data-slide-count]');
    const previousButton = gallery.querySelector('[data-slide-prev]');
    const nextButton = gallery.querySelector('[data-slide-next]');
    const toggleButton = gallery.querySelector('[data-slide-toggle]');
    let activeIndex = 0;
    let currentImage = gallery.querySelector('.slide-image');
    let nextImage = null;
    let intervalId = null;
    let paused = reducedMotion;

    if (!currentImage || images.length < 2) {
      if (gallery.querySelector('.slideshow-controls')) gallery.querySelector('.slideshow-controls').hidden = true;
      return;
    }

    nextImage = document.createElement('img');
    nextImage.className = 'slide-image';
    nextImage.alt = '';
    nextImage.setAttribute('aria-hidden', 'true');
    gallery.insertBefore(nextImage, currentLabel ? currentLabel.parentElement : null);

    const updateStatus = () => {
      if (currentLabel) currentLabel.textContent = labels[activeIndex] || `Screenshot ${activeIndex + 1}`;
      if (currentCount) currentCount.textContent = `${activeIndex + 1} / ${images.length}`;
    };

    const showSlide = (nextIndex) => {
      const safeIndex = (nextIndex + images.length) % images.length;
      if (safeIndex === activeIndex) return;

      const preload = new Image();
      preload.onload = () => {
        nextImage.src = images[safeIndex];
        nextImage.alt = `${labels[safeIndex] || `Screenshot ${safeIndex + 1}`} — project screenshot`;
        nextImage.removeAttribute('aria-hidden');
        requestAnimationFrame(() => {
          nextImage.classList.add('is-active');
          currentImage.classList.remove('is-active');
          currentImage.setAttribute('aria-hidden', 'true');
          [currentImage, nextImage] = [nextImage, currentImage];
          activeIndex = safeIndex;
          updateStatus();
        });
      };
      preload.onerror = () => {
        // Skip an unavailable file rather than leaving the gallery stuck.
        activeIndex = safeIndex;
        updateStatus();
      };
      preload.src = images[safeIndex];
    };

    const stopTimer = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const startTimer = () => {
      stopTimer();
      if (!paused && !document.hidden) {
        intervalId = window.setInterval(() => showSlide(activeIndex + 1), 3000);
      }
    };

    const updateToggle = () => {
      if (!toggleButton) return;
      toggleButton.textContent = paused ? '▶' : 'Ⅱ';
      toggleButton.setAttribute('aria-pressed', String(paused));
      toggleButton.setAttribute('aria-label', paused ? 'Resume slideshow' : 'Pause slideshow');
    };

    if (previousButton) {
      previousButton.addEventListener('click', () => {
        showSlide(activeIndex - 1);
        startTimer();
      });
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        showSlide(activeIndex + 1);
        startTimer();
      });
    }
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        paused = !paused;
        updateToggle();
        startTimer();
      });
    }

    document.addEventListener('visibilitychange', startTimer);
    updateStatus();
    updateToggle();
    startTimer();
  });

  // Public contact details used by the Contact page.
  const contactEmail = 'stanleymaingi94@gmail.com';
  const contactPhone = '+254740572829';
  document.querySelectorAll('[data-contact-email]').forEach((link) => {
    link.href = `mailto:${contactEmail}`;
  });
  document.querySelectorAll('[data-contact-phone]').forEach((link) => {
    link.href = `tel:${contactPhone}`;
  });

  // Subtle reveal-on-scroll transitions. Content stays visible when reduced
  // motion is requested or IntersectionObserver is unavailable.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelector = [
    '#explore-portfolio .section-heading',
    '#explore-portfolio .shortcut-card',
    '#explore-portfolio .home-contact-strip',
    '.page-about .about-hero-copy',
    '.page-about .about-hero-visual',
    '.page-about .about-hero-bottom > div',
    '.page-about .about-story-grid',
    '.page-about .about-principle-card',
    '.page-about .about-work-panel',
    '.page-about .about-contact-inner',
    '.page-projects .section-heading',
    '.page-projects .project-card-page',
    '.page-projects .project-note',
    '.page-skills .skills-heading',
    '.page-skills .skill-card',
    '.page-skills .toolkit-grid',
    '.page-skills .skills-cta',
    '.page-contact .contact-page-card',
    '.page-contact .contact-info-card'
  ].join(',');

  const revealItems = Array.from(document.querySelectorAll(revealSelector));
  if (!reduceMotion && revealItems.length) {
    revealItems.forEach((item, index) => {
      item.classList.add('will-reveal');
      item.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('is-revealed'));
    }
  }

  // Lightweight page reading progress indicator.
  const progress = document.createElement('div');
  progress.className = 'page-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const progressBar = progress.querySelector('span');
  let progressFrame = 0;
  const updateProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, amount))}%`;
      progressFrame = 0;
    });
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

})();
