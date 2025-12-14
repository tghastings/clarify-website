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

// Handle hash scroll on page load (for cross-page navigation)
const handleHashScroll = () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            // Small delay to ensure page is fully rendered
            setTimeout(() => {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
};

// Run on page load
window.addEventListener('load', handleHashScroll);

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

    const elements = document.querySelectorAll('.feature-card, .step, .solution-card, .testimonial-card, .pricing-card, .portal-feature');

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

// Client Portal Demo Tab Switching
const addPortalTabFunctionality = () => {
    const portalNavBtns = document.querySelectorAll('.portal-nav-btn');
    const portalTabs = document.querySelectorAll('.portal-tab');

    if (portalNavBtns.length === 0) return;

    portalNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Remove active class from all buttons and tabs
            portalNavBtns.forEach(b => b.classList.remove('active'));
            portalTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked button and corresponding tab
            btn.classList.add('active');
            const targetTab = document.getElementById(`portal-${tabId}`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Auto-cycle through tabs for demo effect (optional - every 5 seconds)
    let currentTabIndex = 0;
    const tabNames = ['dashboard', 'documents', 'calendar', 'tasks', 'team'];

    const autoCycleInterval = setInterval(() => {
        // Check if user has manually interacted
        const portalDemo = document.querySelector('.portal-demo');
        if (portalDemo && portalDemo.dataset.userInteracted === 'true') {
            clearInterval(autoCycleInterval);
            return;
        }

        // Check if portal is in viewport
        const portalWindow = document.querySelector('.portal-window');
        if (!portalWindow) return;

        const rect = portalWindow.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
            currentTabIndex = (currentTabIndex + 1) % tabNames.length;
            const tabName = tabNames[currentTabIndex];
            const btn = document.querySelector(`.portal-nav-btn[data-tab="${tabName}"]`);
            if (btn) {
                btn.click();
            }
        }
    }, 5000);

    // Stop auto-cycling when user interacts with tabs
    portalNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const portalDemo = document.querySelector('.portal-demo');
            if (portalDemo) {
                portalDemo.dataset.userInteracted = 'true';
            }
        });
    });
};

// Video Demo Player with Audio Sync
const addVideoPlayer = () => {
    const videoModal = document.getElementById('video-modal');
    const videoScreen = document.getElementById('video-screen');
    const audio = document.getElementById('demo-audio');
    const playBtn = document.getElementById('video-play-btn');
    const progressFill = document.getElementById('video-progress-fill');
    const progressHandle = document.getElementById('video-progress-handle');
    const progressBar = document.getElementById('video-progress');
    const timeDisplay = document.getElementById('video-time');
    const modalTitle = document.getElementById('video-modal-title');
    const closeBtn = document.querySelector('.video-modal-close');
    const playIcon = playBtn?.querySelector('.play-icon');
    const pauseIcon = playBtn?.querySelector('.pause-icon');

    const featureCards = document.querySelectorAll('.feature-card-video, .solution-card-video');

    if (!videoModal || !audio) return;

    let currentDemo = null;
    let isPlaying = false;

    // Format time as M:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Update progress bar and time
    const updateProgress = () => {
        if (!audio.duration) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        progressHandle.style.left = `${percent}%`;
        timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

        // Update scenes based on audio time
        updateScenes(audio.currentTime);
    };

    // Update which scene is active based on audio time
    const updateScenes = (currentTime) => {
        const scenesContainer = videoScreen.querySelector(`.video-scenes[data-demo="${currentDemo}"]`);
        if (!scenesContainer) return;

        const scenes = scenesContainer.querySelectorAll('.video-scene');
        scenes.forEach(scene => {
            const start = parseFloat(scene.dataset.start);
            const end = parseFloat(scene.dataset.end);
            if (currentTime >= start && currentTime < end) {
                if (!scene.classList.contains('active')) {
                    scenes.forEach(s => s.classList.remove('active'));
                    scene.classList.add('active');
                }
            }
        });
    };

    // Toggle play/pause
    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            audio.play();
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
    };

    let hasAudio = false;
    let manualTime = 0;
    let totalDuration = 0;

    // Get total duration from scenes
    const getTotalDuration = (demoType) => {
        const scenesContainer = videoScreen.querySelector(`.video-scenes[data-demo="${demoType}"]`);
        if (!scenesContainer) return 60;
        const scenes = scenesContainer.querySelectorAll('.video-scene');
        let maxEnd = 0;
        scenes.forEach(scene => {
            const end = parseFloat(scene.dataset.end) || 0;
            if (end > maxEnd) maxEnd = end;
        });
        return maxEnd || 60;
    };

    // Open video modal
    const openVideo = (demoType, audioSrc, title) => {
        currentDemo = demoType;
        hasAudio = audioSrc && audioSrc.length > 0;
        modalTitle.textContent = title;

        // Show correct scenes container
        videoScreen.querySelectorAll('.video-scenes').forEach(container => {
            container.style.display = container.dataset.demo === demoType ? 'block' : 'none';
        });

        // Reset scenes to first one
        const scenesContainer = videoScreen.querySelector(`.video-scenes[data-demo="${demoType}"]`);
        if (scenesContainer) {
            scenesContainer.querySelectorAll('.video-scene').forEach((scene, i) => {
                scene.classList.toggle('active', i === 0);
            });
        }

        // Reset progress
        progressFill.style.width = '0%';
        progressHandle.style.left = '0%';
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        isPlaying = false;
        manualTime = 0;

        // Show modal
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (hasAudio) {
            audio.src = audioSrc;
            audio.load();
            timeDisplay.textContent = '0:00 / 0:00';
            // Auto-play when audio is ready
            audio.oncanplay = () => {
                audio.play().then(() => {
                    isPlaying = true;
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                }).catch(err => {
                    console.log('Auto-play blocked, click play to start');
                });
            };
        } else {
            // No audio - setup manual navigation
            totalDuration = getTotalDuration(demoType);
            timeDisplay.textContent = `0:00 / ${formatTime(totalDuration)}`;
            // Hide play button for no-audio demos
            playBtn.style.opacity = '0.5';
            playBtn.style.pointerEvents = 'none';
        }
    };

    // Close video modal
    const closeVideo = () => {
        if (hasAudio) {
            audio.pause();
            audio.currentTime = 0;
            audio.oncanplay = null; // Clear the auto-play handler
        }
        isPlaying = false;
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset play button state
        playBtn.style.opacity = '1';
        playBtn.style.pointerEvents = 'auto';
    };

    // Seeking disabled - users can only pause/resume
    // Progress bar is read-only

    // Event listeners
    playBtn?.addEventListener('click', togglePlay);
    closeBtn?.addEventListener('click', closeVideo);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
    });
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });

    // Close on overlay click
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideo();
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideo();
        }
        // Space to toggle play
        if (e.key === ' ' && videoModal.classList.contains('active')) {
            e.preventDefault();
            togglePlay();
        }
    });

    // Feature card click handlers
    featureCards.forEach(card => {
        const playVideoBtn = card.querySelector('.play-video-btn');
        const openHandler = () => {
            const demoType = card.dataset.video;
            const audioSrc = card.dataset.audio;
            const title = card.dataset.title;
            openVideo(demoType, audioSrc, title);
        };

        card.addEventListener('click', openHandler);
        playVideoBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            openHandler();
        });
    });

    // URL hash deep linking for demo modals
    const hashToDemo = {
        // Feature demos
        'demo-compliance': { video: 'compliance', audio: 'audio/compliance_flow.wav', title: 'Compliance Flow Demo' },
        'demo-email-to-transaction': { video: 'email', audio: 'audio/email_to_transaction.wav', title: 'Transaction Automation Demo' },
        'demo-playbooks': { video: 'playbooks', audio: 'audio/playbooks.wav', title: 'Smart Playbooks Demo' },
        'demo-client-portal': { video: 'portal', audio: 'audio/c_portal_demo.wav', title: 'Client Portal Demo' },
        'demo-team-analytics': { video: 'analytics', audio: 'audio/team-analytics.wav', title: 'Team Analytics Demo' },
        // Solution learn more modals
        'learn-more-agents': { video: 'agents', audio: 'audio/agents_learn_more.wav', title: 'For Agents - See How It Works' },
        'learn-more-tc': { video: 'tc', audio: 'audio/tc_learn_more.wav', title: 'For Transaction Coordinators - See How It Works' },
        'learn-more-brokerage': { video: 'brokerage', audio: 'audio/brokerage_learn_more.wav', title: 'For Team Leaders & Brokerage Owners - See How It Works' }
    };

    const openDemoFromHash = () => {
        const hash = window.location.hash.slice(1); // Remove the #
        const demo = hashToDemo[hash];
        if (demo) {
            // Small delay to ensure page is ready
            setTimeout(() => {
                openVideo(demo.video, demo.audio, demo.title);
            }, 100);
        }
    };

    // Check hash on page load
    openDemoFromHash();

    // Listen for hash changes
    window.addEventListener('hashchange', openDemoFromHash);

    // Clear hash when modal is closed (listen for modal becoming inactive)
    const clearHashOnClose = () => {
        if (window.location.hash && hashToDemo[window.location.hash.slice(1)]) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    };

    // Observer to detect modal close
    const modalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && !videoModal.classList.contains('active')) {
                clearHashOnClose();
            }
        });
    });
    modalObserver.observe(videoModal, { attributes: true });
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addFadeInAnimation();
    animateStats();
    addMobileMenuToggle();
    addPlaceholderEffects();
    addModalFunctionality();
    addPortalTabFunctionality();
    addVideoPlayer();
});

// Add smooth reveal on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
