/**
 * ==========================================================================
 * MOHIT RESTAURANT & CAFE - JAVASCRIPT ENGINE
 * Features:
 * - Glassmorphism Navbar Sticky & ScrollSpy
 * - Mobile Drawer Menu & Backdrop
 * - Menu Filtering & Dynamic Ordering via WhatsApp
 * - Photo Gallery Lightbox & Category Filter
 * - Live Opening Hours & "Open Now" Status Indicator
 * - Table Reservation Form with Instant WhatsApp Booking
 * - Copy-to-Clipboard with Golden Toast Feedback
 * - Scroll-Reveal Animations (Intersection Observer)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initMenuFiltering();
  initGalleryLightbox();
  initReservationForm();
  initLiveHoursStatus();
  initCopyButtons();
  initScrollReveal();
  initNewsletter();
});

/* --- 1. NAVBAR & SCROLL BEHAVIOR --- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link update
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --- 2. MOBILE HAMBURGER & DRAWER --- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-btn');

  if (!hamburger || !drawer || !overlay) return;

  function toggleMenu(isOpen) {
    hamburger.classList.toggle('active', isOpen);
    drawer.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    toggleMenu(!isOpen);
  });

  overlay.addEventListener('click', () => toggleMenu(false));

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* --- 3. MENU FILTERING & ORDER VIA WHATSAPP --- */
function initMenuFiltering() {
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Direct order item buttons
  const orderButtons = document.querySelectorAll('.dish-order-btn');
  orderButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dishTitle = btn.getAttribute('data-dish') || 'Special Dish';
      const dishPrice = btn.getAttribute('data-price') || '';
      const text = encodeURIComponent(
        `Hello Mohit Restaurant & Cafe! 👋\nI would like to order / inquire about: *${dishTitle}* (${dishPrice}). Please let me know the availability.`
      );
      window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
      showToast(`Inquiring about ${dishTitle} on WhatsApp...`);
    });
  });
}

/* --- 4. PHOTO GALLERY & LIGHTBOX --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryTabs = document.querySelectorAll('.gallery-tab-btn');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox) return;

  // Filter gallery photos
  galleryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const title = item.querySelector('.gallery-item-title')?.textContent || 'Mohit Restaurant & Cafe';
      const tag = item.querySelector('.gallery-item-tag')?.textContent || 'Experience';

      lightboxImg.src = img.src;
      lightboxCaption.textContent = `${title} • ${tag}`;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- 5. TABLE RESERVATION FORM --- */
function initReservationForm() {
  const form = document.getElementById('table-reservation-form');
  if (!form) return;

  // Set default date to today or tomorrow
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('res-name').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const guests = document.getElementById('res-guests').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const seating = document.getElementById('res-seating').value;
    const notes = document.getElementById('res-notes').value.trim();

    if (!name || !phone) {
      showToast('Please fill in your name and contact phone number.');
      return;
    }

    const message = 
      `*🌟 TABLE RESERVATION REQUEST - MOHIT RESTAURANT & CAFE 🌟*\n\n` +
      `👤 *Guest Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `👥 *Number of Guests:* ${guests} Person(s)\n` +
      `📅 *Date:* ${date}\n` +
      `⏰ *Time Slot:* ${time}\n` +
      `🪑 *Seating Preference:* ${seating}\n` +
      (notes ? `📝 *Special Requests:* ${notes}\n` : '') +
      `\nKindly confirm our reservation. Thank you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
    showToast('✨ Reservation request created! Opening WhatsApp to confirm...');
    form.reset();
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  });
}

/* --- 6. LIVE STATUS INDICATOR --- */
function initLiveHoursStatus() {
  const statusPills = document.querySelectorAll('.status-indicator-live');
  const now = new Date();
  const currentHour = now.getHours();

  // Operating hours: 10:00 AM to 11:30 PM (23:30)
  const isOpen = currentHour >= 10 && currentHour < 23;

  statusPills.forEach((pill) => {
    if (isOpen) {
      pill.innerHTML = `<span class="status-dot"></span> Open Now • Closes at 11:30 PM`;
      pill.style.color = '#4ade80';
      pill.style.background = 'rgba(34, 197, 94, 0.1)';
      pill.style.borderColor = 'rgba(34, 197, 94, 0.3)';
    } else {
      pill.innerHTML = `<span class="status-dot" style="background: #f59e0b; box-shadow: 0 0 8px #f59e0b;"></span> Opens at 10:00 AM`;
      pill.style.color = '#fcd34d';
      pill.style.background = 'rgba(245, 158, 11, 0.1)';
      pill.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    }
  });
}

/* --- 7. COPY BUTTONS WITH TOAST FEEDBACK --- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-trigger');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else if (textToCopy) {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(`Copied to clipboard: ${text}`);
  }
}

/* --- 8. SCROLL REVEAL OBSERVER --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((r) => r.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* --- 9. NEWSLETTER SUBSCRIPTION --- */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (input && input.value.trim()) {
      showToast('🎉 Welcome to the Mohit VIP Club! Check your inbox for exclusive perks.');
      input.value = '';
    }
  });
}

/* --- TOAST NOTIFICATION HELPER --- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e6b758" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3600);
}
