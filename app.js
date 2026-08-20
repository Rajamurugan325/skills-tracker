/* ==========================================================================
   Rajamurugan M - Portfolio Logic
   Interactive transitions, scroll animation spy, project filter, form handlers
   ========================================================================== */

// Register PWA Service Worker for Android & PC installability
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered successfully'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Custom Cursor System (Disabled for a cleaner, more professional look)
    // initCustomCursor();

    // Mobile Navbar Menu toggle
    initMobileMenu();

    // Header scroll background modification
    initHeaderScroll();

    // Hero Subtitle Typing effect
    initTypingEffect();

    // About Tab Toggle Handler
    initAboutTabs();

    // Project Cards Filter system
    initProjectFilter();

    // Intersection Observer for scroll reveal animations
    initScrollReveal();

    // Scroll Spy for Navbar links highlight
    initScrollSpy();

    // Scroll to Top action button
    initScrollToTop();

    // Contact Form Submission & Client-side Validation
    initContactForm();
});

/* ==========================================================================
   1. Custom Cursor system
   ========================================================================== */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');

    if (!dot || !outline) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Animate cursor dot
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Smooth outline trailing effect
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 250, fill: 'forwards' });
    });

    // Expand cursor hover states on interactive links
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .filter-btn, .tab-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '50px';
            outline.style.height = '50px';
            outline.style.borderColor = 'var(--color-secondary)';
            outline.style.backgroundColor = 'rgba(6, 182, 212, 0.05)';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.width = '30px';
            outline.style.height = '30px';
            outline.style.borderColor = 'var(--color-primary)';
            outline.style.backgroundColor = 'transparent';
        });
    });
}

/* ==========================================================================
   2. Mobile Navbar Menu Toggle
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    if (!toggle || !menu || !navbar) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        navbar.classList.toggle('menu-open');
    });

    // Close when clicking navlinks
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            navbar.classList.remove('menu-open');
        });
    });
}

/* ==========================================================================
   3. Header background on scroll
   ========================================================================== */
function initHeaderScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   4. Typing text effect (Hero Section)
   ========================================================================== */
function initTypingEffect() {
    const textTarget = document.getElementById('dynamic-subtitle');
    if (!textTarget) return;

    const phrases = [
        'Full-Stack Developer',
        'QA Automation Engineer',
        'Computer Science Engineer',
        'Problem Solver'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textTarget.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Erasing is faster
        } else {
            textTarget.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing speed
        }

        // If phrase is completed
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start effect
    setTimeout(type, 1000);
}

/* ==========================================================================
   5. About Me Sections: Info Tab Switcher
   ========================================================================== */
function initAboutTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            buttons.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active status to clicked one
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   6. Projects Cards Grid filter logic
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Highlight current button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger dynamic fade-in
                    card.animate([
                        { opacity: 0, transform: 'scale(0.95) translateY(10px)' },
                        { opacity: 1, transform: 'scale(1) translateY(0)' }
                    ], {
                        duration: 400,
                        easing: 'ease-out',
                        fill: 'forwards'
                    });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   7. Reveal Elements on viewport scroll (Observer System)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is revealed, there's no need to observe again
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. Scroll Spy navigation system (Active Link highlighting)
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   9. Scroll To Top Button functionality
   ========================================================================== */
function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    // Show/Hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.style.transform = 'translateY(0)';
        } else {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
            btn.style.transform = 'translateY(15px)';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Set initial state
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    btn.style.transform = 'translateY(15px)';
    btn.style.transition = 'var(--transition-normal)';
}

/* ==========================================================================
   10. Interactive Contact Form with Validation & Feedback State
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success');
    const successName = document.getElementById('success-name');
    const dismissBtn = document.getElementById('close-success-btn');

    if (!form || !successOverlay) return;

    const fields = [
        { id: 'name', errorId: 'name-error', validate: val => val.trim().length > 0 },
        { id: 'email', errorId: 'email-error', validate: val => {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(val);
        }},
        { id: 'subject', errorId: 'subject-error', validate: val => val.trim().length > 0 },
        { id: 'message', errorId: 'message-error', validate: val => val.trim().length > 0 }
    ];

    // Real-time validation styling removal on user typing
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('input', () => {
                const parent = input.parentElement;
                if (field.validate(input.value)) {
                    parent.classList.remove('invalid');
                }
            });
            input.addEventListener('blur', () => {
                const parent = input.parentElement;
                if (field.validate(input.value)) {
                    parent.classList.remove('invalid');
                } else {
                    parent.classList.add('invalid');
                }
            });
        }
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const parent = input.parentElement;

            if (!field.validate(input.value)) {
                parent.classList.add('invalid');
                isFormValid = false;
            } else {
                parent.classList.remove('invalid');
            }
        });

        if (isFormValid) {
            // Trigger processing visual states
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.btn-spinner');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const nameVal = document.getElementById('name').value;

            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            if (btnIcon) btnIcon.classList.add('hidden');
            if (spinner) spinner.classList.remove('hidden');

            // Simulate server delivery
            setTimeout(() => {
                // Restore button state
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                if (btnIcon) btnIcon.classList.remove('hidden');
                if (spinner) spinner.classList.add('hidden');

                // Render success modal
                successName.textContent = nameVal;
                successOverlay.classList.remove('id-hidden');

                // Clear input values
                form.reset();
            }, 1800);
        }
    });

    // Modal Close
    dismissBtn.addEventListener('click', () => {
        successOverlay.classList.add('id-hidden');
    });
}
