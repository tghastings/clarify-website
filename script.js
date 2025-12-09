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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to elements
const addFadeInAnimation = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .benefit, .trust-item');

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
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

// Mobile menu toggle (if you add a mobile menu button later)
const addMobileMenuToggle = () => {
    const navLinks = document.querySelector('.nav-links');

    // Check if mobile menu button exists
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
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

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addFadeInAnimation();
    animateStats();
    addMobileMenuToggle();
    addPlaceholderEffects();
});

// Add smooth reveal on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
