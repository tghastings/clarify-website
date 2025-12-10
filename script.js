// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for # only links
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
// Using smaller threshold and margins for better mobile support
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to elements
const addFadeInAnimation = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const elements = document.querySelectorAll('.feature-card, .step, .solution-card, .testimonial-card, .pricing-card');

    elements.forEach((el, index) => {
        if (prefersReducedMotion) {
            // Skip animations for users who prefer reduced motion
            el.style.opacity = '1';
            return;
        }

        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        // Limit stagger delay to avoid long waits on mobile
        const delay = Math.min(index * 0.08, 0.4);
        el.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
        observer.observe(el);
    });
};

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');

    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = entry.target;
                const text = target.textContent;
                const hasPercent = text.includes('%');
                const hasX = text.includes('x');
                const number = parseInt(text.replace(/\D/g, ''));

                if (isNaN(number)) {
                    // Handle special cases like "24/7"
                    target.classList.add('counted');
                    return;
                }

                let current = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        target.textContent = number + (hasPercent ? '%' : hasX ? 'x' : '');
                        clearInterval(timer);
                        target.classList.add('counted');
                    } else {
                        target.textContent = Math.floor(current) + (hasPercent ? '%' : hasX ? 'x' : '');
                    }
                }, 30);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observerStats.observe(stat));
};

// Mobile menu toggle
const addMobileMenuToggle = () => {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (!mobileMenuBtn || !mobileNav) return;

    const closeMenu = () => {
        mobileNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        mobileNav.classList.add('active');
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileNav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking any navigation link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Don't handle # only links, mailto links, or external links
            if (!href || href === '#' || href.startsWith('mailto:') || href.startsWith('http')) {
                return;
            }

            // For hash links on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();

                // Close the menu first
                closeMenu();

                // Wait for menu close animation and layout to settle before scrolling
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target) {
                        const navHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 450); // Wait slightly longer than the 0.4s menu transition
            }
            // For cross-page navigation (like index.html#features from privacy.html)
            else {
                // Just close the menu and let the browser handle the navigation
                closeMenu();
            }
        });
    });

    // Close menu when clicking the overlay background
    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on window resize (if transitioning to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
};

// Placeholder image hover effect
const addPlaceholderEffects = () => {
    const placeholders = document.querySelectorAll('.placeholder-image, .feature-placeholder, .step-placeholder');

    placeholders.forEach(placeholder => {
        placeholder.addEventListener('mouseenter', () => {
            placeholder.style.borderColor = '#2C5F2D';
            placeholder.style.transform = 'scale(1.02)';
            placeholder.style.transition = 'all 0.3s ease';
        });

        placeholder.addEventListener('mouseleave', () => {
            placeholder.style.borderColor = '#2C5F2D';
            placeholder.style.transform = 'scale(1)';
        });
    });
};

// Early Access Modal
const addModalFunctionality = () => {
    const modal = document.getElementById('early-access-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const copyBtn = document.getElementById('copy-email-btn');

    if (!modal) return;

    // Find all "Request Early Access" buttons (exclude the one inside the modal)
    const openModalBtns = document.querySelectorAll('a[href*="mailto:hello@clarify.re"]');

    const openModal = (e) => {
        // Don't intercept the mailto link inside the modal
        if (e.target.closest('.modal')) return;

        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Open modal when clicking any mailto link (except inside modal)
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // Close modal
    closeBtn?.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Copy email functionality
    copyBtn?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('hello@clarify.re');
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = 'hello@clarify.re';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    });
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addFadeInAnimation();
    animateStats();
    addMobileMenuToggle();
    addPlaceholderEffects();
    addModalFunctionality();
});

// Add smooth reveal on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
