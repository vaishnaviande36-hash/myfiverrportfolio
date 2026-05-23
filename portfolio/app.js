/* ==========================================================================
   Vaishnavi's Premium Freelancer Portfolio - JS Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // 1. Custom Cursor Follower
  // ----------------------------------------------------
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');
  
  let mouseX = 0, mouseY = 0; // Mouse position
  let ringX = 0, ringY = 0;   // Interpolated ring position
  const speed = 0.15;         // Interpolation speed multiplier
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    
    if (!document.body.classList.contains('cursor-active')) {
      document.body.classList.add('cursor-active');
    }
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
  });

  // Smooth animation loop for the trailing ring
  function animateCursor() {
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;
    
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover scale effect on interactive items
  const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .filter-btn, .theme-toggle-btn, .social-circle-btn, input, textarea');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    elem.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // ----------------------------------------------------
  // 2. Preloader Screen
  // ----------------------------------------------------
  const loaderScreen = document.getElementById('loader-screen');
  window.addEventListener('load', () => {
    // Small delay to ensure a smooth transition
    setTimeout(() => {
      loaderScreen.style.opacity = '0';
      loaderScreen.style.visibility = 'hidden';
      // Trigger scroll checks once loaded
      checkScroll();
    }, 1000);
  });

  // Fallback in case load event takes too long
  setTimeout(() => {
    if (loaderScreen.style.visibility !== 'hidden') {
      loaderScreen.style.opacity = '0';
      loaderScreen.style.visibility = 'hidden';
    }
  }, 3500);

  // ----------------------------------------------------
  // 3. Theme Toggler (Dark / Light Mode)
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Set theme from local storage or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = 'dark';
    
    if (activeTheme === 'dark') {
      targetTheme = 'light';
    }
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  });

  // ----------------------------------------------------
  // 4. Sticky Header & Active Nav Links
  // ----------------------------------------------------
  const header = document.querySelector('.header-main');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function checkScroll() {
    const scrollY = window.scrollY;
    
    // Sticky Header
    if (scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
    
    // Active Link Highlighting
    let currentActive = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 150;
      const sectionHeight = sec.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentActive = sec.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', checkScroll);

  // ----------------------------------------------------
  // 5. Responsive Mobile Menu
  // ----------------------------------------------------
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // ----------------------------------------------------
  // 6. Scroll Reveal System (Intersection Observer)
  // ----------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep layout performant
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  // ----------------------------------------------------
  // 7. Animated Statistics Counter
  // ----------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const countStats = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const speed = 1000; // time in ms
    let startTime = null;
    
    const countStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(Math.floor((progress / speed) * target), target);
      
      element.textContent = current + suffix;
      
      if (current < target) {
        requestAnimationFrame(countStep);
      } else {
        element.textContent = target + suffix;
      }
    };
    
    requestAnimationFrame(countStep);
  };
  
  const statsSection = document.getElementById('about');
  let statsTriggered = false;
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statNumbers.forEach(num => countStats(num));
        statsTriggered = true; // only trigger once
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ----------------------------------------------------
  // 8. Portfolio Category Filter & Modals
  // ----------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          // Small animation delay trigger
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Modal Configuration & Data mapping
  const modal = document.getElementById('portfolio-modal');
  const modalClose = document.getElementById('modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  const projectData = {
    '1': {
      title: 'Luxury Restaurant Website',
      category: 'Website Design & Development',
      desc: 'A gorgeous, interactive website built for a premium Michelin-star restaurant. Showcases high-end typography, seamless booking forms, dynamic CSS menus, and ambient background video assets for an immersive luxury feel.',
      client: 'Le Parisien Dining',
      date: 'April 2026',
      tech: ['HTML5', 'Vanilla CSS', 'JavaScript', 'Glassmorphism', 'Responsive UI'],
      img: 'assets/project_restaurant.png'
    },
    '2': {
      title: 'Digital Freelancer Portfolio',
      category: 'UI/UX & Web Development',
      desc: 'An ultra-modern, cinematic landing page designed for content creators and freelancers. Built with optimized performance metrics, dark/light theme switching, interactive hover maps, and a smooth cursor trailing effect.',
      client: 'Personal Branding',
      date: 'May 2026',
      tech: ['HTML5', 'CSS Variables', 'ES6 Javascript', 'SEO Optimized', 'Intersection Observer'],
      img: 'assets/project_portfolio.png'
    },
    '3': {
      title: 'Fashion Brand Landing Page',
      category: 'UI/UX Design',
      desc: 'A minimal, elegant, high-converting digital storefront layout for an international boutique brand. Focuses on premium white-space grids, editorial layouts, custom font sets, and responsive fashion lookbooks.',
      client: 'AURA Boutique',
      date: 'February 2026',
      tech: ['Figma Design', 'CSS Grid', 'Typography System', 'Responsive Mockups', 'Brand Identity'],
      img: 'assets/project_fashion.png'
    },
    '5': {
      title: 'AI Generated Creative Ads',
      category: 'AI Content Creation',
      desc: 'A digital collection of marketing visuals generated using Midjourney and Stable Diffusion, combined with premium brand typography for social media campaigns. Significantly lowers production costs while doubling conversions.',
      client: 'NovaTech Devices',
      date: 'January 2026',
      tech: ['Midjourney v6', 'Stable Diffusion', 'Photoshop CC', 'Ad Copywriting', 'Conversion Optimization'],
      img: 'assets/project_ads.png'
    }
  };

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const projId = item.getAttribute('data-project');
      const data = projectData[projId];
      
      if (!data) return;
      
      // Inject details into the modal
      modal.querySelector('.modal-proj-title').textContent = data.title;
      modal.querySelector('.modal-info-value.category').textContent = data.category;
      modal.querySelector('.modal-proj-desc').textContent = data.desc;
      modal.querySelector('.modal-info-value.client').textContent = data.client;
      modal.querySelector('.modal-info-value.date').textContent = data.date;
      modal.querySelector('.modal-img-box img').src = data.img;
      modal.querySelector('.modal-img-box img').alt = data.title;
      
      // Populate tech badges
      const techBox = modal.querySelector('.modal-info-value.tech-tags');
      techBox.innerHTML = '';
      data.tech.forEach(t => {
        const badge = document.createElement('span');
        badge.className = 'modal-tech-tag';
        badge.textContent = t;
        techBox.appendChild(badge);
      });
      
      // Open modal
      modal.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // restore scrolling
  };

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // ----------------------------------------------------
  // 9. Testimonials Slider (Carousel)
  // ----------------------------------------------------
  const track = document.getElementById('testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('slider-dots');
  
  let activeIndex = 0;
  const slideCount = cards.length;
  
  // Create navigation dots
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  }
  
  const dots = document.querySelectorAll('.slider-dot');
  
  function goToSlide(index) {
    activeIndex = index;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }
  
  // Auto-play timer
  let autoPlayTimer = setInterval(() => {
    let nextIndex = (activeIndex + 1) % slideCount;
    goToSlide(nextIndex);
  }, 6000);
  
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      let nextIndex = (activeIndex + 1) % slideCount;
      goToSlide(nextIndex);
    }, 6000);
  }

  // ----------------------------------------------------
  // 10. Contact Form Submission Simulation
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }
    
    // Simulate loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
    
    setTimeout(() => {
      showStatus('Thank you! Your message was sent successfully. Vaishnavi will reach out shortly.', 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1500);
  });
  
  function showStatus(text, type) {
    formStatus.textContent = text;
    formStatus.className = `form-status ${type}`;
    
    // Clear status after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }
});
