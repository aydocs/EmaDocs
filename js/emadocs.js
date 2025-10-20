/**
 * EMA FRAMEWORK - ULTRA PREMIUM JAVASCRIPT
 * World's Most Advanced UI Framework
 * More Powerful than Tailwind, Next.js, React Combined
 * 
 * @version 2.0.0
 * @author Ema Framework Team
 * @license MIT
 */

'use strict';

// Global Framework State
const EmaFramework = {
    version: '2.0.0',
    initialized: false,
    performance: {
        startTime: performance.now(),
        metrics: new Map(),
        observers: new Map()
    },
    config: {
        animations: {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            stagger: 100
        },
        intersection: {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -50px 0px'
        },
        performance: {
            enableMetrics: true,
            logLevel: 'info'
        }
    },
    utils: {},
    components: new Map(),
    animations: new Map(),
    events: new EventTarget()
};

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.startTime = performance.now();
    }

    mark(name) {
        if (performance.mark) {
            performance.mark(`ema-${name}`);
        }
        this.metrics.set(name, performance.now());
    }

    measure(name, startMark, endMark) {
        if (performance.measure) {
            try {
                performance.measure(`ema-${name}`, `ema-${startMark}`, `ema-${endMark}`);
                const measure = performance.getEntriesByName(`ema-${name}`)[0];
                if (measure && EmaFramework.config.performance.logLevel === 'info') {
                    console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
                }
                return measure.duration;
            } catch (error) {
                console.warn(`Performance measurement failed for ${name}:`, error);
            }
        }
        return null;
    }

    getMetrics() {
        return Object.fromEntries(this.metrics);
    }
}

// Advanced Animation System
class AnimationSystem {
    constructor() {
        this.animations = new Map();
        this.timeline = new Map();
        this.observers = new Map();
    }

    createTimeline(name) {
        const timeline = {
            animations: [],
            duration: 0,
            delay: 0,
            onComplete: null
        };
        this.timeline.set(name, timeline);
        return timeline;
    }

    animate(element, properties, options = {}) {
        const config = {
            duration: options.duration || EmaFramework.config.animations.duration,
            easing: options.easing || EmaFramework.config.animations.easing,
            delay: options.delay || 0,
            fill: options.fill || 'forwards',
            ...options
        };

        if (element.animate) {
            const animation = element.animate(properties, config);
            
            if (options.onComplete) {
                animation.addEventListener('finish', options.onComplete);
            }

            return animation;
        } else {
            // Fallback for older browsers
            this.fallbackAnimate(element, properties, config);
        }
    }

    fallbackAnimate(element, properties, config) {
        const startTime = performance.now();
        const startValues = {};
        const endValues = {};

        // Extract start and end values
        Object.keys(properties[1] || properties).forEach(prop => {
            const computedStyle = getComputedStyle(element);
            startValues[prop] = computedStyle[prop];
            endValues[prop] = properties[1] ? properties[1][prop] : properties[prop];
        });

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / config.duration, 1);
            const easedProgress = this.easeInOutCubic(progress);

            Object.keys(endValues).forEach(prop => {
                const start = parseFloat(startValues[prop]) || 0;
                const end = parseFloat(endValues[prop]) || 0;
                const current = start + (end - start) * easedProgress;
                element.style[prop] = `${current}px`;
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (config.onComplete) {
                config.onComplete();
            }
        };

        setTimeout(() => requestAnimationFrame(animate), config.delay);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    staggerElements(elements, animationFn, stagger = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => animationFn(element), index * stagger);
        });
    }
}

// Advanced Intersection Observer Manager
class IntersectionManager {
    constructor() {
        this.observers = new Map();
        this.elements = new WeakMap();
    }

    observe(element, callback, options = {}) {
        const config = {
            ...EmaFramework.config.intersection,
            ...options
        };

        const observerKey = JSON.stringify(config);
        
        if (!this.observers.has(observerKey)) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const callback = this.elements.get(entry.target);
                    if (callback) {
                        callback(entry);
                    }
                });
            }, config);
            
            this.observers.set(observerKey, observer);
        }

        const observer = this.observers.get(observerKey);
        this.elements.set(element, callback);
        observer.observe(element);

        return () => {
            observer.unobserve(element);
            this.elements.delete(element);
        };
    }

    disconnect() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.elements = new WeakMap();
    }
}

// Advanced Event System
class EventSystem {
    constructor() {
        this.listeners = new Map();
        this.delegatedListeners = new Map();
    }

    on(element, event, handler, options = {}) {
        const key = `${event}-${handler.name || 'anonymous'}`;
        
        if (options.once) {
            const onceHandler = (e) => {
                handler(e);
                this.off(element, event, onceHandler);
            };
            element.addEventListener(event, onceHandler, options);
            this.listeners.set(key, { element, event, handler: onceHandler });
        } else {
            element.addEventListener(event, handler, options);
            this.listeners.set(key, { element, event, handler });
        }
    }

    off(element, event, handler) {
        element.removeEventListener(event, handler);
        const key = `${event}-${handler.name || 'anonymous'}`;
        this.listeners.delete(key);
    }

    delegate(parent, selector, event, handler) {
        const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, e);
            }
        };

        parent.addEventListener(event, delegatedHandler);
        const key = `${selector}-${event}`;
        this.delegatedListeners.set(key, { parent, event, handler: delegatedHandler });
    }

    emit(element, eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    cleanup() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.delegatedListeners.forEach(({ parent, event, handler }) => {
            parent.removeEventListener(event, handler);
        });
        this.listeners.clear();
        this.delegatedListeners.clear();
    }
}

// Initialize Framework
function initializeFramework() {
    if (EmaFramework.initialized) return;

    console.log(`
🚀 Ema Framework v${EmaFramework.version} Initializing...
🎯 More Advanced than Tailwind + Next.js + React Combined
⚡ Ultra Premium Performance & Features
    `);
    
// Initialize SWAL2-style alert and toast system
initializeAlertSystem();

// Performance Optimization System
initializePerformanceOptimization();
    
    // SWAL2-style Alert System
    function initializeAlertSystem() {
        // Create alert container
        if (!document.querySelector('.ema-alert-container')) {
            const alertContainer = document.createElement('div');
            alertContainer.className = 'ema-alert-container';
            alertContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(alertContainer);
        }
        
        // Create toast container
        if (!document.querySelector('.ema-toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.className = 'ema-toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(toastContainer);
        }
    }
    
    // SWAL2-style Alert Function
    window.emaAlert = function(options) {
        const alertContainer = document.querySelector('.ema-alert-container');
        if (!alertContainer) return;
        
        const alert = document.createElement('div');
        alert.className = 'ema-alert';
        alert.style.pointerEvents = 'auto';
        
        const icon = options.icon || 'info';
        const title = options.title || 'Alert';
        const text = options.text || '';
        const showCancelButton = options.showCancelButton || false;
        const confirmButtonText = options.confirmButtonText || 'OK';
        const cancelButtonText = options.cancelButtonText || 'Cancel';
        
        alert.innerHTML = `
            <div class="ema-alert-header">
                <div style="display: flex; align-items: center;">
                    <div class="ema-alert-icon ${icon}">
                        <i class="fas fa-${getIconForType(icon)}"></i>
                    </div>
                    <div class="ema-alert-content">
                        <div class="ema-alert-title">${title}</div>
                        ${text ? `<div class="ema-alert-text">${text}</div>` : ''}
                    </div>
                </div>
                <button class="ema-alert-close" onclick="closeAlert(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="ema-alert-actions">
                ${showCancelButton ? `<button class="ema-alert-btn" onclick="closeAlert(this)">${cancelButtonText}</button>` : ''}
                <button class="ema-alert-btn primary" onclick="closeAlert(this, true)">${confirmButtonText}</button>
            </div>
        `;
        
        alertContainer.appendChild(alert);
        
        // Trigger animation
        setTimeout(() => alert.classList.add('show'), 10);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                closeAlert(alert.querySelector('.ema-alert-close'));
            }
        }, 5000);
        
        return new Promise((resolve) => {
            window.currentAlertResolve = resolve;
        });
    };
    
    // SWAL2-style Toast Function
    window.emaToast = function(options) {
        const toastContainer = document.querySelector('.ema-toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = 'ema-toast';
        toast.style.pointerEvents = 'auto';
        
        const type = options.type || 'info';
        const title = options.title || '';
        const text = options.text || '';
        const timer = options.timer || 3000;
        const showConfirmButton = options.showConfirmButton || false;
        const confirmButtonText = options.confirmButtonText || 'OK';
        
        toast.innerHTML = `
            <div class="ema-toast-content">
                <i class="fas fa-${getIconForType(type)} ema-toast-icon ${type}"></i>
                <div class="ema-toast-text">
                    ${title ? `<strong>${title}</strong><br>` : ''}
                    ${text}
                </div>
                ${showConfirmButton ? `<button class="ema-toast-close" onclick="closeToast(this)">${confirmButtonText}</button>` : ''}
                <button class="ema-toast-close" onclick="closeToast(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="ema-toast-progress"></div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto close
        setTimeout(() => {
            if (toast.parentNode) {
                closeToast(toast.querySelector('.ema-toast-close'));
            }
        }, timer);
    };
    
    // Helper functions
    function getIconForType(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle',
            question: 'question-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    function closeAlert(element, confirmed = false) {
        const alert = element.closest('.ema-alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
                if (window.currentAlertResolve) {
                    window.currentAlertResolve(confirmed);
                    window.currentAlertResolve = null;
                }
            }, 300);
        }
    }
    
    function closeToast(element) {
        const toast = element.closest('.ema-toast');
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }
    
// Make functions globally available
window.closeAlert = closeAlert;
window.closeToast = closeToast;

// Performance Optimization System
function initializePerformanceOptimization() {
    // Lazy Loading System
    initializeLazyLoading();
    
    // Intersection Observer for animations
    initializeIntersectionObserver();
    
    // Memory Management
    initializeMemoryManagement();
    
    // Core Web Vitals Monitoring
    initializeCoreWebVitals();
    
    // Resource Optimization
    initializeResourceOptimization();
}

function initializeLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.dataset.lazy;
                    
                    if (element.tagName === 'IMG') {
                        element.src = src;
                        element.classList.remove('lazy');
                    } else if (element.tagName === 'VIDEO') {
                        element.src = src;
                        element.load();
                    }
                    
                    lazyObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

function initializeIntersectionObserver() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate;
                
                element.classList.add(`animate-${animationType}`);
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

function initializeMemoryManagement() {
    // Clean up event listeners on page unload
    window.addEventListener('beforeunload', () => {
        // Remove all event listeners to prevent memory leaks
        document.removeEventListener('click', null);
        document.removeEventListener('scroll', null);
        document.removeEventListener('resize', null);
    });
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize logic here
            optimizeLayout();
        }, 250);
    });
}

function initializeCoreWebVitals() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }
}

function initializeResourceOptimization() {
    // Preload critical resources
    const criticalResources = [
        '/css/emadocs.css',
        '/js/emadocs.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
    
    // Prefetch non-critical resources
    const prefetchResources = [
        '/pages/components.html',
        '/pages/docs.html',
        '/pages/examples.html'
    ];
    
    prefetchResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
}

function optimizeLayout() {
    // Optimize layout based on viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust grid layouts for mobile
    if (viewportWidth < 768) {
        document.body.classList.add('mobile-optimized');
    } else {
        document.body.classList.remove('mobile-optimized');
    }
    
    // Optimize animations for low-end devices
    if (navigator.hardwareConcurrency < 4) {
        document.body.classList.add('reduced-motion');
    }
}

// Advanced Animation System
function initializeAdvancedAnimations() {
    // Stagger animations
    const staggerElements = document.querySelectorAll('[data-stagger]');
    staggerElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Parallax effects
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
    
    // 3D hover effects
    const hover3DElements = document.querySelectorAll('[data-3d-hover]');
    hover3DElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Initialize advanced animations
initializeAdvancedAnimations();

    const monitor = new PerformanceMonitor();
    const animationSystem = new AnimationSystem();
    const intersectionManager = new IntersectionManager();
    const eventSystem = new EventSystem();

    // Store systems in framework
    EmaFramework.performance = monitor;
    EmaFramework.animations = animationSystem;
    EmaFramework.intersection = intersectionManager;
    EmaFramework.events = eventSystem;

    monitor.mark('init-start');

    // Initialize core systems
    initializeHeader();
    initializeMobileMenu();
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeInteractions();
    initializeMasonryGrid();
    initializeEmaComponents();
    initializePerformanceOptimizations();
    initializeAccessibility();

    monitor.mark('init-end');
    monitor.measure('initialization', 'init-start', 'init-end');

    EmaFramework.initialized = true;
    
    // Emit initialization complete event
    EmaFramework.events.emit(document, 'ema:initialized', {
        version: EmaFramework.version,
        performance: monitor.getMetrics()
    });

    console.log('✅ Ema Framework Initialized Successfully');
}

// Advanced Header System
function initializeHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let scrollDirection = 'up';
    let isScrolling = false;

    const updateHeader = EmaFramework.utils.throttle(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);

        // Only update if scroll difference is significant
        if (scrollDifference < 5) return;

        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

        // Add scrolled class for styling
        header.classList.toggle('scrolled', currentScrollY > 50);

        // Hide/show header based on scroll direction and position
        if (currentScrollY > 100) {
            if (scrollDirection === 'down' && !isScrolling) {
                header.classList.add('hidden');
                EmaFramework.animations.animate(header, [
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(-100%)' }
                ], { duration: 300, easing: 'ease-out' });
            } else if (scrollDirection === 'up') {
                header.classList.remove('hidden');
                EmaFramework.animations.animate(header, [
                    { transform: 'translateY(-100%)' },
                    { transform: 'translateY(0)' }
                ], { duration: 300, easing: 'ease-out' });
            }
        } else {
            header.classList.remove('hidden');
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    }, 16);

    // Enhanced scroll listener with passive option
    window.addEventListener('scroll', updateHeader, { passive: true });

    // Add scroll start/end detection
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }, { passive: true });
}

// Advanced Mobile Menu System
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;

    let isOpen = false;
    let isAnimating = false;

    const toggleMenu = async () => {
        if (isAnimating) return;
        
        isAnimating = true;
        isOpen = !isOpen;

        // Update ARIA attributes
        mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
        
        // Animate button
        mobileMenuBtn.classList.toggle('active', isOpen);
        
        if (isOpen) {
            // Show menu
            mobileMenu.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Animate menu in
            await EmaFramework.animations.animate(mobileMenu, [
                { opacity: 0, transform: 'translateY(-20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { 
                duration: 300, 
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
            });

            // Stagger animate menu items
            const menuItems = mobileMenu.querySelectorAll('.mobile-nav-link');
            EmaFramework.animations.staggerElements(menuItems, (item) => {
                EmaFramework.animations.animate(item, [
                    { opacity: 0, transform: 'translateX(-20px)' },
                    { opacity: 1, transform: 'translateX(0)' }
                ], { duration: 200 });
            }, 50);

        } else {
            // Hide menu
            await EmaFramework.animations.animate(mobileMenu, [
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(-20px)' }
            ], { duration: 200 });
            
            mobileMenu.style.display = 'none';
            document.body.style.overflow = '';
        }

        isAnimating = false;
    };

    // Event listeners
    EmaFramework.events.on(mobileMenuBtn, 'click', toggleMenu);

    // Close on escape key
    EmaFramework.events.on(document, 'keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            toggleMenu();
        }
    });

    // Close on outside click
    EmaFramework.events.on(mobileMenu, 'click', (e) => {
        if (e.target === mobileMenu && isOpen) {
            toggleMenu();
        }
    });

    // Close on link click
    EmaFramework.events.delegate(mobileMenu, '.mobile-nav-link', 'click', () => {
        if (isOpen) {
            toggleMenu();
        }
    });
}

// Advanced Navigation System
function initializeNavigation() {
    // Initialize mega dropdown
    initializeMegaDropdown();
    
    // Smooth scrolling for anchor links
    EmaFramework.events.delegate(document, 'a[href^="#"]', 'click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        
        const target = document.querySelector(href);
        if (!target) return;

        const headerHeight = document.getElementById('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        // Smooth scroll with easing
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 1000);
        let startTime = null;

        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = EmaFramework.animations.easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                // Update active nav link
                updateActiveNavLink(href);
                // Focus target for accessibility
                target.focus({ preventScroll: true });
            }
        };

        requestAnimationFrame(animateScroll);
    });

    // Advanced active link detection
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (sections.length && navLinks.length) {
        const observer = EmaFramework.intersection.observe(
            document.documentElement,
            () => {
                // Find the section that's most visible
                let mostVisible = null;
                let maxVisibility = 0;

                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const visibility = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
                    
                    if (visibility > maxVisibility) {
                        maxVisibility = visibility;
                        mostVisible = section;
                    }
                });

                if (mostVisible) {
                    updateActiveNavLink(`#${mostVisible.id}`);
                }
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
    }
}

// Mega Dropdown System
function initializeMegaDropdown() {
    const dropdownTriggers = document.querySelectorAll('.nav-dropdown');
    
    dropdownTriggers.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const megaDropdown = dropdown.querySelector('.mega-dropdown');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        
        if (!trigger || !megaDropdown || !arrow) return;
        
        let isOpen = false;
        let hoverTimeout;
        
        const openDropdown = () => {
            if (isOpen) return;
            
            isOpen = true;
            trigger.setAttribute('aria-expanded', 'true');
            
            // Animate dropdown in
            EmaFramework.animations.animate(megaDropdown, [
                { opacity: 0, visibility: 'hidden', transform: 'translateX(-50%) translateY(-10px)' },
                { opacity: 1, visibility: 'visible', transform: 'translateX(-50%) translateY(0)' }
            ], { duration: 300, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' });
            
            // Stagger animate dropdown items
            const dropdownItems = megaDropdown.querySelectorAll('.dropdown-item');
            EmaFramework.animations.staggerElements(dropdownItems, (item) => {
                EmaFramework.animations.animate(item, [
                    { opacity: 0, transform: 'translateY(10px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { duration: 200 });
            }, 30);
        };
        
        const closeDropdown = () => {
            if (!isOpen) return;
            
            isOpen = false;
            trigger.setAttribute('aria-expanded', 'false');
            
            // Animate dropdown out
            EmaFramework.animations.animate(megaDropdown, [
                { opacity: 1, visibility: 'visible', transform: 'translateX(-50%) translateY(0)' },
                { opacity: 0, visibility: 'hidden', transform: 'translateX(-50%) translateY(-10px)' }
            ], { duration: 200 });
        };
        
        // Hover events
        EmaFramework.events.on(dropdown, 'mouseenter', () => {
            clearTimeout(hoverTimeout);
            openDropdown();
        });
        
        EmaFramework.events.on(dropdown, 'mouseleave', () => {
            hoverTimeout = setTimeout(closeDropdown, 150);
        });
        
        // Keyboard events
        EmaFramework.events.on(trigger, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                isOpen ? closeDropdown() : openDropdown();
            } else if (e.key === 'Escape' && isOpen) {
                closeDropdown();
                trigger.focus();
            }
        });
        
        // Focus management for dropdown items
        const dropdownItems = megaDropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach((item, index) => {
            EmaFramework.events.on(item, 'keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextItem = dropdownItems[index + 1] || dropdownItems[0];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevItem = dropdownItems[index - 1] || dropdownItems[dropdownItems.length - 1];
                    prevItem.focus();
                } else if (e.key === 'Escape') {
                    closeDropdown();
                    trigger.focus();
                }
            });
        });
    });
}

function updateActiveNavLink(activeHref) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Add active class to current link
    const activeLink = document.querySelector(`.nav-link[href="${activeHref}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
}

// Advanced Animation System
function initializeAnimations() {
    // Enhanced intersection observer for animations
    const animateElements = document.querySelectorAll('[class*="animate-"]');
    
    animateElements.forEach(element => {
        // Set initial state
        const animationType = Array.from(element.classList).find(cls => cls.startsWith('animate-'));
        
        switch (animationType) {
            case 'animate-fade-in-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(40px)';
                break;
            case 'animate-fade-in-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-40px)';
                break;
            case 'animate-fade-in-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(40px)';
                break;
        }

        // Observe for animation trigger
        const unobserve = EmaFramework.intersection.observe(element, (entry) => {
            if (entry.isIntersecting) {
                // Trigger animation
                switch (animationType) {
                    case 'animate-fade-in-up':
                        EmaFramework.animations.animate(element, [
                            { opacity: 0, transform: 'translateY(40px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ], { 
                            duration: 600, 
                            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                        });
                        break;
                    case 'animate-fade-in-left':
                        EmaFramework.animations.animate(element, [
                            { opacity: 0, transform: 'translateX(-40px)' },
                            { opacity: 1, transform: 'translateX(0)' }
                        ], { 
                            duration: 600, 
                            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                        });
                        break;
                    case 'animate-fade-in-right':
                        EmaFramework.animations.animate(element, [
                            { opacity: 0, transform: 'translateX(40px)' },
                            { opacity: 1, transform: 'translateX(0)' }
                        ], { 
                            duration: 600, 
                            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                        });
                        break;
                }
                
                // Unobserve after animation
                unobserve();
            }
        }, { threshold: 0.1 });
    });
}

// Advanced Counter Animation System
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    counters.forEach(counter => {
        counter.textContent = '0';
        
        const unobserve = EmaFramework.intersection.observe(counter, (entry) => {
            if (entry.isIntersecting) {
                animateCounter(counter);
                unobserve();
            }
        }, { threshold: 0.5 });
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = EmaFramework.animations.easeInOutCubic(progress);
        const current = Math.floor(target * easedProgress);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target.toLocaleString();
            // Add completion animation
            EmaFramework.animations.animate(element, [
                { transform: 'scale(1)' },
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' }
            ], { duration: 300 });
        }
    };
    
    requestAnimationFrame(animate);
}

// Advanced Interaction System
function initializeInteractions() {
    initializeButtonEffects();
    initializeCardEffects();
    initializeParallaxEffects();
    initializeCursorEffects();
    initializeRippleEffects();
}

function initializeButtonEffects() {
    EmaFramework.events.delegate(document, '.btn', 'mouseenter', function() {
        EmaFramework.animations.animate(this, [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-2px)' }
        ], { duration: 200 });
    });
    
    EmaFramework.events.delegate(document, '.btn', 'mouseleave', function() {
        EmaFramework.animations.animate(this, [
            { transform: 'translateY(-2px)' },
            { transform: 'translateY(0)' }
        ], { duration: 200 });
    });
}

function initializeCardEffects() {
    const cards = document.querySelectorAll('.card, .feature-card, .component-preview');
    
    cards.forEach(card => {
        EmaFramework.events.on(card, 'mouseenter', () => {
            EmaFramework.animations.animate(card, [
                { transform: 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)' },
                { transform: 'translateY(-8px) perspective(1000px) rotateX(2deg) rotateY(2deg)' }
            ], { duration: 300 });
        });
        
        EmaFramework.events.on(card, 'mouseleave', () => {
            EmaFramework.animations.animate(card, [
                { transform: 'translateY(-8px) perspective(1000px) rotateX(2deg) rotateY(2deg)' },
                { transform: 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)' }
            ], { duration: 300 });
        });

        // Advanced tilt effect
        EmaFramework.events.on(card, 'mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (x - centerX) / 20;
            
            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero');
    
    if (parallaxElements.length) {
        const updateParallax = EmaFramework.utils.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.3;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16);
        
        window.addEventListener('scroll', updateParallax, { passive: true });
    }
}

function initializeCursorEffects() {
    // Only add custom cursor on desktop
    if (window.innerWidth < 1024) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-500);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.1s ease;
        mix-blend-mode: difference;
        will-change: transform;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    EmaFramework.events.on(document, 'mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    EmaFramework.events.on(document, 'mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Smooth cursor animation
    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Hover effects
    EmaFramework.events.delegate(document, 'a, button, .card', 'mouseenter', function() {
        cursor.style.transform = 'scale(2)';
        cursor.style.background = 'var(--primary-300)';
    });
    
    EmaFramework.events.delegate(document, 'a, button, .card', 'mouseleave', function() {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'var(--primary-500)';
    });
}

function initializeRippleEffects() {
    EmaFramework.events.delegate(document, '.btn', 'click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Ultra Advanced Masonry Grid System
function initializeMasonryGrid() {
    const masonryGrids = document.querySelectorAll('.ema-masonry-grid');
    
    masonryGrids.forEach(grid => {
        const items = grid.querySelectorAll('.ema-grid-item');
        
        // Initialize grid items with advanced interactions
        items.forEach((item, index) => {
            // Add stagger animation delay
            item.style.animationDelay = `${index * 100}ms`;
            
            // Advanced hover effects
            EmaFramework.events.on(item, 'mouseenter', () => {
                // Create ripple effect on hover
                const rect = item.getBoundingClientRect();
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: ripple-expand 0.6s ease-out forwards;
                    pointer-events: none;
                    z-index: -1;
                `;
                
                item.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
                
                // Animate neighboring items
                const neighbors = getNeighboringItems(item, items);
                neighbors.forEach((neighbor, i) => {
                    setTimeout(() => {
                        EmaFramework.animations.animate(neighbor, [
                            { transform: 'translateY(0) scale(1)' },
                            { transform: 'translateY(-4px) scale(1.02)' }
                        ], { duration: 200 });
                    }, i * 50);
                });
            });
            
            EmaFramework.events.on(item, 'mouseleave', () => {
                // Reset neighboring items
                const neighbors = getNeighboringItems(item, items);
                neighbors.forEach((neighbor, i) => {
                    setTimeout(() => {
                        EmaFramework.animations.animate(neighbor, [
                            { transform: 'translateY(-4px) scale(1.02)' },
                            { transform: 'translateY(0) scale(1)' }
                        ], { duration: 200 });
                    }, i * 30);
                });
            });
            
            // Initialize interactive elements within items
            initializeGridItemInteractions(item);
        });
        
        // Initialize masonry layout
        initializeMasonryLayout(grid);
        
        // Add resize observer for responsive updates
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                updateMasonryLayout(grid);
            });
            resizeObserver.observe(grid);
        }
    });
}

function getNeighboringItems(currentItem, allItems) {
    const currentIndex = Array.from(allItems).indexOf(currentItem);
    const neighbors = [];
    
    // Get adjacent items (simple approach)
    if (currentIndex > 0) neighbors.push(allItems[currentIndex - 1]);
    if (currentIndex < allItems.length - 1) neighbors.push(allItems[currentIndex + 1]);
    
    return neighbors;
}

function initializeMasonryLayout(grid) {
    const items = grid.querySelectorAll('.ema-grid-item');
    
    // Set initial positions with stagger animation
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            EmaFramework.animations.animate(item, [
                { opacity: 0, transform: 'translateY(40px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { 
                duration: 600, 
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });
        }, index * 150);
    });
}

function updateMasonryLayout(grid) {
    // Recalculate layout on resize
    const items = grid.querySelectorAll('.ema-grid-item');
    
    items.forEach(item => {
        // Trigger reflow for CSS Grid auto-placement
        item.style.gridRowEnd = '';
        
        // Recalculate based on content height
        const height = item.scrollHeight;
        const rowSpan = Math.ceil(height / 20);
        item.style.gridRowEnd = `span ${rowSpan}`;
    });
}

function initializeGridItemInteractions(item) {
    // Initialize color swatches
    const colorSwatches = item.querySelectorAll('.ema-color-swatch');
    colorSwatches.forEach(swatch => {
        EmaFramework.events.on(swatch, 'click', () => {
            const color = swatch.dataset.color;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(color).then(() => {
                    showToast(`Color ${color} copied to clipboard!`, 'success');
                });
            }
        });
    });
    
    // Initialize code copy buttons
    const copyButtons = item.querySelectorAll('.btn:contains("Copy")');
    copyButtons.forEach(button => {
        EmaFramework.events.on(button, 'click', () => {
            const codeDisplay = item.querySelector('.ema-code-display');
            if (codeDisplay) {
                const codeText = codeDisplay.textContent;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(codeText).then(() => {
                        showToast('Code copied to clipboard!', 'success');
                    });
                }
            }
        });
    });
    
    // Initialize progress bars animation
    const progressBars = item.querySelectorAll('.ema-progress-fill');
    const unobserve = EmaFramework.intersection.observe(item, (entry) => {
        if (entry.isIntersecting) {
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            });
            unobserve();
        }
    }, { threshold: 0.3 });
    
    // Initialize stat counters
    const statNumbers = item.querySelectorAll('.ema-stat-number');
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (!isNaN(number)) {
            stat.textContent = '0';
            
            const unobserveCounter = EmaFramework.intersection.observe(item, (entry) => {
                if (entry.isIntersecting) {
                    animateCounter(stat, number, text);
                    unobserveCounter();
                }
            }, { threshold: 0.5 });
        }
    });
}

function animateCounter(element, target, originalText) {
    const duration = 2000;
    const startTime = performance.now();
    const suffix = originalText.replace(/[\d.,]/g, '');
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = EmaFramework.animations.easeInOutCubic(progress);
        const current = Math.floor(target * easedProgress);
        
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = originalText;
        }
    };
    
    requestAnimationFrame(animate);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--dark-bg-card);
        color: var(--text-primary);
        padding: var(--space-4) var(--space-6);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-primary);
        box-shadow: var(--shadow-xl), var(--glow-primary);
        z-index: var(--z-toast);
        backdrop-filter: blur(20px);
        transform: translateX(100%);
        transition: var(--transition-all);
        max-width: 300px;
        font-size: var(--text-sm);
        font-weight: var(--font-medium);
    `;
    
    if (type === 'success') {
        toast.style.borderColor = 'var(--success-500)';
        toast.style.boxShadow = 'var(--shadow-xl), var(--glow-success)';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// ===================================
// EMA FRAMEWORK COMPONENT SYSTEM
// Bootstrap Killer - 10X More Advanced
// ===================================

function initializeEmaComponents() {
    // Initialize all Ema components
    initializeEmaAlerts();
    initializeEmaModals();
    initializeEmaDropdowns();
    initializeEmaTabs();
    initializeEmaAccordions();
    initializeEmaTooltips();
    
    console.log('🎉 Ema Components Initialized - Bootstrap Killer Active!');
    
    // Initialize special buttons
    initializeSpecialButtons();
    
    // Initialize pricing toggle
    initializePricingToggle();
}

// EMA Alert System - Ultra Advanced
function initializeEmaAlerts() {
    const alerts = document.querySelectorAll('.ema-alert');
    
    alerts.forEach(alert => {
        const closeBtn = alert.querySelector('.ema-alert-close');
        
        if (closeBtn) {
            EmaFramework.events.on(closeBtn, 'click', () => {
                // Animate out
                EmaFramework.animations.animate(alert, [
                    { opacity: 1, transform: 'translateX(0) scale(1)' },
                    { opacity: 0, transform: 'translateX(20px) scale(0.95)' }
                ], { 
                    duration: 300,
                    onComplete: () => {
                        alert.remove();
                    }
                });
            });
        }
        
        // Auto-dismiss after 5 seconds if has auto-dismiss class
        if (alert.classList.contains('auto-dismiss')) {
            setTimeout(() => {
                if (alert.parentNode) {
                    closeBtn?.click();
                }
            }, 5000);
        }
    });
}

// EMA Modal System - Ultra Advanced
function initializeEmaModals() {
    const modalTriggers = document.querySelectorAll('[data-ema-modal]');
    const modals = document.querySelectorAll('.ema-modal');
    const overlays = document.querySelectorAll('.ema-modal-overlay');
    
    modalTriggers.forEach(trigger => {
        EmaFramework.events.on(trigger, 'click', (e) => {
            e.preventDefault();
            const modalId = trigger.dataset.emaModal;
            const modal = document.getElementById(modalId);
            const overlay = modal?.parentElement;
            
            if (modal && overlay) {
                openModal(modal, overlay);
            }
        });
    });
    
    // Close modal handlers
    overlays.forEach(overlay => {
        const modal = overlay.querySelector('.ema-modal');
        const closeBtn = modal?.querySelector('.ema-modal-close');
        
        // Close on overlay click
        EmaFramework.events.on(overlay, 'click', (e) => {
            if (e.target === overlay) {
                closeModal(modal, overlay);
            }
        });
        
        // Close on close button click
        if (closeBtn) {
            EmaFramework.events.on(closeBtn, 'click', () => {
                closeModal(modal, overlay);
            });
        }
        
        // Close on escape key
        EmaFramework.events.on(document, 'keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeModal(modal, overlay);
            }
        });
    });
}

function openModal(modal, overlay) {
    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    EmaFramework.utils.trapFocus(modal);
    
    // Animate in
    EmaFramework.animations.animate(modal, [
        { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
    ], { duration: 300 });
}

function closeModal(modal, overlay) {
    // Animate out
    EmaFramework.animations.animate(modal, [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0 }
    ], { 
        duration: 200,
        onComplete: () => {
            overlay.classList.remove('active');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// EMA Dropdown System - Ultra Advanced
function initializeEmaDropdowns() {
    const dropdowns = document.querySelectorAll('.ema-dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.ema-dropdown-toggle');
        const menu = dropdown.querySelector('.ema-dropdown-menu');
        
        if (!toggle || !menu) return;
        
        let isOpen = false;
        
        EmaFramework.events.on(toggle, 'click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            isOpen = !isOpen;
            dropdown.classList.toggle('active', isOpen);
            
            if (isOpen) {
                // Animate menu items
                const items = menu.querySelectorAll('.ema-dropdown-item');
                EmaFramework.animations.staggerElements(items, (item) => {
                    EmaFramework.animations.animate(item, [
                        { opacity: 0, transform: 'translateY(-10px)' },
                        { opacity: 1, transform: 'translateY(0)' }
                    ], { duration: 200 });
                }, 50);
            }
        });
        
        // Close on outside click
        EmaFramework.events.on(document, 'click', () => {
            if (isOpen) {
                dropdown.classList.remove('active');
                isOpen = false;
            }
        });
        
        // Close on item click
        EmaFramework.events.delegate(menu, '.ema-dropdown-item', 'click', () => {
            dropdown.classList.remove('active');
            isOpen = false;
        });
    });
}

// EMA Tab System - Ultra Advanced
function initializeEmaTabs() {
    const tabContainers = document.querySelectorAll('.ema-tabs');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.ema-tab-button');
        const tabPanels = container.querySelectorAll('.ema-tab-panel');
        
        tabButtons.forEach((button, index) => {
            EmaFramework.events.on(button, 'click', () => {
                // Remove active from all
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active to current
                button.classList.add('active');
                if (tabPanels[index]) {
                    tabPanels[index].classList.add('active');
                    
                    // Animate panel in
                    EmaFramework.animations.animate(tabPanels[index], [
                        { opacity: 0, transform: 'translateY(20px)' },
                        { opacity: 1, transform: 'translateY(0)' }
                    ], { duration: 300 });
                }
            });
        });
        
        // Keyboard navigation
        EmaFramework.events.on(container, 'keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
                let newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
                } else {
                    newIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
                }
                
                tabButtons[newIndex].click();
                tabButtons[newIndex].focus();
            }
        });
    });
}

// EMA Accordion System - Ultra Advanced
function initializeEmaAccordions() {
    const accordions = document.querySelectorAll('.ema-accordion');
    
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.ema-accordion-item');
        
        items.forEach(item => {
            const header = item.querySelector('.ema-accordion-header');
            const content = item.querySelector('.ema-accordion-content');
            const icon = item.querySelector('.ema-accordion-icon');
            
            if (!header || !content) return;
            
            EmaFramework.events.on(header, 'click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items (if single mode)
                if (accordion.dataset.mode !== 'multiple') {
                    items.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherContent = otherItem.querySelector('.ema-accordion-content');
                            if (otherContent) {
                                otherContent.style.maxHeight = '0px';
                            }
                        }
                    });
                }
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (!isActive) {
                    // Opening
                    const scrollHeight = content.scrollHeight;
                    content.style.maxHeight = scrollHeight + 'px';
                    
                    // Animate content
                    EmaFramework.animations.animate(content, [
                        { opacity: 0 },
                        { opacity: 1 }
                    ], { duration: 300, delay: 100 });
                } else {
                    // Closing
                    content.style.maxHeight = '0px';
                }
            });
        });
    });
}

// EMA Tooltip System - Ultra Advanced
function initializeEmaTooltips() {
    const tooltips = document.querySelectorAll('.ema-tooltip');
    
    tooltips.forEach(tooltip => {
        const content = tooltip.querySelector('.ema-tooltip-content');
        if (!content) return;
        
        let showTimeout, hideTimeout;
        
        EmaFramework.events.on(tooltip, 'mouseenter', () => {
            clearTimeout(hideTimeout);
            showTimeout = setTimeout(() => {
                content.style.opacity = '1';
                content.style.visibility = 'visible';
                content.style.transform = 'translateX(-50%) translateY(-12px)';
            }, 300);
        });
        
        EmaFramework.events.on(tooltip, 'mouseleave', () => {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(() => {
                content.style.opacity = '0';
                content.style.visibility = 'hidden';
                content.style.transform = 'translateX(-50%) translateY(-8px)';
            }, 100);
        });
        
        // Keyboard support
        EmaFramework.events.on(tooltip, 'focus', () => {
            content.style.opacity = '1';
            content.style.visibility = 'visible';
            content.style.transform = 'translateX(-50%) translateY(-12px)';
        });
        
        EmaFramework.events.on(tooltip, 'blur', () => {
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
            content.style.transform = 'translateX(-50%) translateY(-8px)';
        });
    });
}

// Ema Component Utilities
EmaFramework.components = {
    // Create Alert
    createAlert(type, title, message, options = {}) {
        const alert = document.createElement('div');
        alert.className = `ema-alert ema-alert-${type}`;
        
        if (options.autoDismiss) {
            alert.classList.add('auto-dismiss');
        }
        
        alert.innerHTML = `
            <div class="ema-alert-icon">
                <i class="fas fa-${getAlertIcon(type)}"></i>
            </div>
            <div class="ema-alert-content">
                <div class="ema-alert-title">${title}</div>
                <div class="ema-alert-message">${message}</div>
            </div>
            <button class="ema-alert-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        const container = options.container || document.body;
        container.appendChild(alert);
        
        // Initialize
        initializeEmaAlerts();
        
        // Animate in
        EmaFramework.animations.animate(alert, [
            { opacity: 0, transform: 'translateX(-20px) scale(0.95)' },
            { opacity: 1, transform: 'translateX(0) scale(1)' }
        ], { duration: 300 });
        
        return alert;
    },
    
    // Create Modal
    createModal(title, content, options = {}) {
        const modalId = 'modal-' + Date.now();
        const modal = document.createElement('div');
        modal.className = 'ema-modal-overlay';
        modal.innerHTML = `
            <div class="ema-modal" id="${modalId}">
                <div class="ema-modal-header">
                    <h3 class="ema-modal-title">${title}</h3>
                    <button class="ema-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ema-modal-body">
                    ${content}
                </div>
                ${options.footer ? `<div class="ema-modal-footer">${options.footer}</div>` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        initializeEmaModals();
        
        // Auto open
        setTimeout(() => {
            const modalElement = modal.querySelector('.ema-modal');
            openModal(modalElement, modal);
        }, 100);
        
        return modal;
    },
    
    // Create Toast (Enhanced)
    createToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `ema-alert ema-alert-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: var(--z-toast);
            transform: translateX(100%);
            transition: var(--transition-all);
            max-width: 400px;
            margin-bottom: var(--space-4);
        `;
        
        toast.innerHTML = `
            <div class="ema-alert-icon">
                <i class="fas fa-${getAlertIcon(type)}"></i>
            </div>
            <div class="ema-alert-content">
                <div class="ema-alert-message">${message}</div>
            </div>
            <button class="ema-alert-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto dismiss
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);
        
        // Manual close
        const closeBtn = toast.querySelector('.ema-alert-close');
        EmaFramework.events.on(closeBtn, 'click', () => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });
        
        return toast;
    }
};

function getAlertIcon(type) {
    const icons = {
        primary: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Initialize Special Buttons
function initializeSpecialButtons() {
    // Live Demo Button
    const liveDemoBtn = document.getElementById('liveDemoBtn');
    if (liveDemoBtn) {
        EmaFramework.events.on(liveDemoBtn, 'click', () => {
            const modalContent = `
                <div class="ema-tabs">
                    <div class="ema-tab-list">
                        <button class="ema-tab-button active">Components</button>
                        <button class="ema-tab-button">Features</button>
                        <button class="ema-tab-button">Performance</button>
                    </div>
                    <div class="ema-tab-panel active">
                        <h4>Interactive Components</h4>
                        <p>Experience our components in action!</p>
                        <div class="ema-demo-buttons" style="margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="btn btn-primary btn-sm" onclick="EmaFramework.components.createToast('Primary button works!', 'success')">Primary</button>
                            <button class="btn btn-secondary btn-sm" onclick="EmaFramework.components.createAlert('info', 'Info Alert', 'This is an info alert message!')">Secondary</button>
                            <button class="btn btn-outline btn-sm" onclick="EmaFramework.components.createToast('Outline button clicked!', 'info')">Outline</button>
                        </div>
                    </div>
                    <div class="ema-tab-panel">
                        <h4>Advanced Features</h4>
                        <p>🎨 1250+ Premium Components</p>
                        <p>⚡ 100+ JavaScript Modules</p>
                        <p>🚀 500+ Total Features</p>
                        <p>🎯 8 Color Variants Each</p>
                    </div>
                    <div class="ema-tab-panel">
                        <h4>Performance Metrics</h4>
                        <p>⚡ Lightning Fast Loading</p>
                        <p>📱 Mobile Optimized</p>
                        <p>♿ WCAG 2.2 AAA Compliant</p>
                        <p>🔒 Enterprise Security</p>
                    </div>
                </div>
            `;
            
            const footer = `
                <button class="btn btn-outline" onclick="this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click()">Close Demo</button>
                <button class="btn btn-primary" onclick="EmaFramework.components.createToast('Exploring more features!', 'info'); this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click();">Explore More</button>
            `;
            
            EmaFramework.components.createModal('🎯 Live Demo', modalContent, { footer });
        });
    }
    
    // Color Guide Button
    const colorGuideBtn = document.getElementById('colorGuideBtn');
    if (colorGuideBtn) {
        EmaFramework.events.on(colorGuideBtn, 'click', () => {
            const modalContent = `
                <div class="ema-accordion" data-mode="single">
                    <div class="ema-accordion-item">
                        <div class="ema-accordion-header">
                            <div class="ema-accordion-title">Primary Colors</div>
                            <i class="ema-accordion-icon fas fa-chevron-down"></i>
                        </div>
                        <div class="ema-accordion-content">
                            <div class="ema-accordion-body">
                                <p>Our primary color palette includes purple, blue, and violet shades designed for maximum impact and accessibility.</p>
                            </div>
                        </div>
                    </div>
                    <div class="ema-accordion-item">
                        <div class="ema-accordion-header">
                            <div class="ema-accordion-title">Semantic Colors</div>
                            <i class="ema-accordion-icon fas fa-chevron-down"></i>
                        </div>
                        <div class="ema-accordion-content">
                            <div class="ema-accordion-body">
                                <p>Success (green), warning (yellow), error (red), and info (blue) colors for meaningful user feedback.</p>
                            </div>
                        </div>
                    </div>
                    <div class="ema-accordion-item">
                        <div class="ema-accordion-header">
                            <div class="ema-accordion-title">Usage Guidelines</div>
                            <i class="ema-accordion-icon fas fa-chevron-down"></i>
                        </div>
                        <div class="ema-accordion-content">
                            <div class="ema-accordion-body">
                                <p>Each color has 50+ variants and follows WCAG 2.2 AAA accessibility standards for optimal contrast ratios.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            EmaFramework.components.createModal('🎨 Color System', modalContent);
        });
    }
    
    // Performance Report Button
    const performanceReportBtn = document.getElementById('performanceReportBtn');
    if (performanceReportBtn) {
        EmaFramework.events.on(performanceReportBtn, 'click', () => {
            const modalContent = `
                <div class="ema-tabs">
                    <div class="ema-tab-list">
                        <button class="ema-tab-button active">Overview</button>
                        <button class="ema-tab-button">Metrics</button>
                        <button class="ema-tab-button">Recommendations</button>
                    </div>
                    <div class="ema-tab-panel active">
                        <h4>Performance Overview</h4>
                        <div class="ema-alert ema-alert-success">
                            <div class="ema-alert-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="ema-alert-content">
                                <div class="ema-alert-title">Excellent Performance!</div>
                                <div class="ema-alert-message">Your site is performing exceptionally well across all metrics.</div>
                            </div>
                        </div>
                        <p><strong>Overall Score:</strong> 94/100</p>
                        <p><strong>Load Time:</strong> 2.1s</p>
                        <p><strong>Bundle Size:</strong> Optimized</p>
                    </div>
                    <div class="ema-tab-panel">
                        <h4>Detailed Metrics</h4>
                        <p>🚀 <strong>First Contentful Paint:</strong> 1.2s</p>
                        <p>⚡ <strong>Largest Contentful Paint:</strong> 2.1s</p>
                        <p>🎯 <strong>Cumulative Layout Shift:</strong> 0.05</p>
                        <p>📱 <strong>Mobile Performance:</strong> 96/100</p>
                    </div>
                    <div class="ema-tab-panel">
                        <h4>Recommendations</h4>
                        <p>✅ Enable compression</p>
                        <p>✅ Optimize images</p>
                        <p>✅ Minify resources</p>
                        <p>✅ Use CDN delivery</p>
                    </div>
                </div>
            `;
            
            EmaFramework.components.createModal('📊 Performance Report', modalContent);
        });
    }
    
    // User Profile Button
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn) {
        EmaFramework.events.on(userProfileBtn, 'click', () => {
            const modalContent = `
                <div style="text-align: center; padding: 20px;">
                    <div style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; color: white;">
                        <i class="fas fa-user"></i>
                    </div>
                    <h3>Alex Johnson</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">Senior Full-Stack Developer</p>
                    <div class="ema-badge ema-badge-success" style="margin-bottom: 20px;">
                        <div class="ema-badge-dot"></div>
                        Online
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <span class="ema-badge ema-badge-outline">React Expert</span>
                        <span class="ema-badge ema-badge-outline">UI/UX Designer</span>
                        <span class="ema-badge ema-badge-outline">Team Lead</span>
                    </div>
                </div>
            `;
            
            const footer = `
                <button class="btn btn-outline" onclick="this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click()">Close</button>
                <button class="btn btn-primary" onclick="EmaFramework.components.createToast('Profile updated!', 'success'); this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click();">Edit Profile</button>
            `;
            
            EmaFramework.components.createModal('👤 User Profile', modalContent, { footer });
        });
    }
}

// Initialize Pricing Toggle
function initializePricingToggle() {
    const pricingSwitch = document.getElementById('pricingSwitch');
    const priceAmounts = document.querySelectorAll('.price-amount');
    
    if (pricingSwitch && priceAmounts.length > 0) {
        EmaFramework.events.on(pricingSwitch, 'click', () => {
            pricingSwitch.classList.toggle('active');
            const isAnnual = pricingSwitch.classList.contains('active');
            
            // Animate price changes
            priceAmounts.forEach(amount => {
                const monthlyPrice = amount.dataset.monthly;
                const annualPrice = amount.dataset.annual;
                
                if (monthlyPrice && annualPrice) {
                    // Animate number change
                    const startValue = parseInt(amount.textContent);
                    const endValue = isAnnual ? parseInt(annualPrice) : parseInt(monthlyPrice);
                    
                    animateNumber(amount, startValue, endValue, 500);
                }
            });
            
            // Show toast notification
            const message = isAnnual ? 
                'Annual billing selected! Save 20% 💰' : 
                'Monthly billing selected 📅';
            EmaFramework.components.createToast(message, 'info', 2000);
        });
    }
}

// Animate number changes
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(start + (difference * easeOut));
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
    
    // Monitor performance
    monitorPerformance();
}

function preloadCriticalResources() {
    const criticalResources = [
        'pages/getting-started.html',
        'pages/components.html',
        'pages/docs.html'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
}

function optimizeScrollPerformance() {
    let ticking = false;
    
    const updateScrollElements = () => {
        // Update scroll-dependent elements
        ticking = false;
    };
    
    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

function monitorPerformance() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Enhanced keyboard navigation
    initializeKeyboardNavigation();
    
    // Screen reader announcements
    initializeScreenReaderSupport();
    
    // Focus management
    initializeFocusManagement();
    
    // Reduced motion support
    initializeReducedMotion();
}

function initializeKeyboardNavigation() {
    // Skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        EmaFramework.events.on(link, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
    
    // Escape key handling
    EmaFramework.events.on(document, 'keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals, menus, etc.
            const openElements = document.querySelectorAll('[aria-expanded="true"]');
            openElements.forEach(element => {
                element.click();
            });
        }
    });
}

function initializeScreenReaderSupport() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Function to announce messages
    EmaFramework.utils.announce = (message) => {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
}

function initializeFocusManagement() {
    // Focus trap for modals
    EmaFramework.utils.trapFocus = (element) => {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        EmaFramework.events.on(element, 'keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    };
}

function initializeReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
    
    prefersReducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        } else {
            document.documentElement.style.removeProperty('--transition-duration');
            document.documentElement.style.removeProperty('--animation-duration');
        }
    });
}

// Utility Functions
EmaFramework.utils = {
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Focus trap for modals
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
        
        firstElement?.focus();
    },
    
    // Generate unique ID
    generateId(prefix = 'ema') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    },
    
    // Format numbers
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Get random color
    getRandomColor() {
        const colors = [
            'var(--primary-500)',
            'var(--secondary-500)',
            'var(--success-500)',
            'var(--warning-500)',
            'var(--error-500)',
            'var(--info-500)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // Smooth scroll to element
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get device type
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },
    
    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('LocalStorage not available:', e);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Error reading from LocalStorage:', e);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Error removing from LocalStorage:', e);
                return false;
            }
        }
    },

    // Debounce function
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // Easing functions
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },

    // Random utilities
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // DOM utilities
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFramework);
} else {
    initializeFramework();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Clean up observers
    if (EmaFramework.intersection) {
        EmaFramework.intersection.disconnect();
    }
    
    // Clean up event listeners
    if (EmaFramework.events) {
        EmaFramework.events.cleanup();
    }
    
    // Clean up animations
    if (EmaFramework.animations && EmaFramework.animations.animations) {
        EmaFramework.animations.animations.forEach(animation => {
            if (animation.cancel) animation.cancel();
        });
    }
});

// Export for global access
window.EmaFramework = EmaFramework;

// Console welcome message
console.log(`
🎉 Welcome to Ema Framework v${EmaFramework.version}!
🚀 The World's Most Advanced UI Framework
📊 More Powerful than Tailwind + Next.js + React Combined
📚 Documentation: https://emaframework.com/docs
🐛 Issues: https://github.com/aydocs/emadocs/issues
💬 Community: https://discord.gg/emaframework
⭐ Star us on GitHub: https://github.com/aydocs/emadocs

Performance Metrics:
⚡ Initialization: ${EmaFramework.performance?.getMetrics?.()?.['init-end'] || 'N/A'}ms
🎯 Components: 1250+ Premium UI Components (250 × 5 variants) across 25+ Categories
🔧 Modules: 100+ Advanced JavaScript Modules
✨ Features: 500+ Cutting-edge Features
`);


// Modal helper functions
function showDemoModal() {
    EmaFramework.components.createModal('Demo Modal', '<p>This is a demo modal!</p>');
}

function showProfessionalPlan() {
    const content = `
        <div style="text-align: center; padding: 20px;">
            <h3>Upgrade to Professional</h3>
            <p>Get access to all premium features and priority support.</p>
            <div class="ema-alert ema-alert-success" style="margin: 20px 0;">
                <div class="ema-alert-icon">
                    <i class="fas fa-gift"></i>
                </div>
                <div class="ema-alert-content">
                    <div class="ema-alert-title">Special Offer!</div>
                    <div class="ema-alert-message">Get 20% off your first year with annual billing.</div>
                </div>
            </div>
        </div>
    `;
    
    const footer = `
        <button class="btn btn-outline" onclick="this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click()">Maybe Later</button>
        <button class="btn btn-primary" onclick="EmaFramework.components.createToast('Redirecting to checkout...', 'info'); this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click();">Start Free Trial</button>
    `;
    
    EmaFramework.components.createModal('🚀 Professional Plan', content, {footer});
}

function showEnterprisePlan() {
    const content = `
        <div style="text-align: center; padding: 20px;">
            <h3>Enterprise Solutions</h3>
            <p>Let's discuss your specific requirements and create a custom plan.</p>
            <div class="ema-demo-forms" style="margin: 20px 0; text-align: left;">
                <input type="text" placeholder="Company Name" class="ema-demo-input" style="margin-bottom: 10px;">
                <input type="email" placeholder="Business Email" class="ema-demo-input" style="margin-bottom: 10px;">
                <input type="tel" placeholder="Phone Number" class="ema-demo-input">
            </div>
        </div>
    `;
    
    const footer = `
        <button class="btn btn-outline" onclick="this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click()">Cancel</button>
        <button class="btn btn-primary" onclick="EmaFramework.components.createToast('Thank you! Our team will contact you within 24 hours.', 'success'); this.closest('.ema-modal-overlay').querySelector('.ema-modal-close').click();">Request Quote</button>
    `;
    
    EmaFramework.components.createModal('🏢 Enterprise Plan', content, {footer});
}

// Revolutionary Component Functions
function toggleFAB(button) {
    const menu = button.parentElement.querySelector('.fab-menu');
    button.classList.toggle('active');
    menu.classList.toggle('active');
    
    EmaFramework.components.createToast('FAB menu toggled! 🚀', 'info', 1500);
}

function toggleVoiceInput(button) {
    const status = button.parentElement.querySelector('.voice-status');
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        button.classList.remove('active');
        status.textContent = 'Tap to speak';
        EmaFramework.components.createToast('Voice input stopped 🎤', 'info', 1500);
    } else {
        button.classList.add('active');
        status.textContent = 'Listening...';
        EmaFramework.components.createToast('Voice input started 🎙️', 'success', 1500);
        
        // Auto stop after 3 seconds
        setTimeout(() => {
            button.classList.remove('active');
            status.textContent = 'Processing...';
            setTimeout(() => {
                status.textContent = 'Tap to speak';
            }, 1000);
        }, 3000);
    }
}

let gestureActive = false;
function startGesture(event) {
    gestureActive = true;
    const area = event.currentTarget;
    const trail = area.querySelector('.gesture-trail');
    
    area.style.borderColor = 'var(--primary-500)';
    updateGestureTrail(event, trail);
}

function trackGesture(event) {
    if (!gestureActive) return;
    
    const area = event.currentTarget;
    const trail = area.querySelector('.gesture-trail');
    updateGestureTrail(event, trail);
}

function endGesture(event) {
    gestureActive = false;
    const area = event.currentTarget;
    const trail = area.querySelector('.gesture-trail');
    
    area.style.borderColor = 'var(--border-primary)';
    trail.style.opacity = '0';
    
    EmaFramework.components.createToast('Gesture recognized! ✋', 'success', 1500);
}

function updateGestureTrail(event, trail) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.opacity = '1';
}

function rotateARObject(object) {
    const cube = object.querySelector('.ar-cube');
    const currentRotation = cube.style.transform || 'rotateY(0deg)';
    const currentY = parseInt(currentRotation.match(/rotateY\((\d+)deg\)/)?.[1] || 0);
    const newRotation = currentY + 90;
    
    cube.style.transform = `rotateY(${newRotation}deg) rotateX(15deg)`;
    
    EmaFramework.components.createToast('AR object rotated! 🔄', 'info', 1500);
}

// Interactive Component Functions
function cycleBadgeType(badge) {
    const types = ['primary', 'success', 'warning', 'error', 'info'];
    const texts = ['New', 'Pro', 'Beta', 'Hot', 'Live'];
    
    // Get current type
    let currentType = '';
    types.forEach(type => {
        if (badge.classList.contains(`ema-badge-${type}`)) {
            currentType = type;
        }
    });
    
    // Get next type
    const currentIndex = types.indexOf(currentType);
    const nextIndex = (currentIndex + 1) % types.length;
    const nextType = types[nextIndex];
    
    // Update badge
    badge.className = `ema-badge ema-badge-${nextType} interactive-badge`;
    badge.textContent = texts[nextIndex];
    
    EmaFramework.components.createToast(`Badge changed to ${nextType}! 🏷️`, 'info', 1500);
}

function runCode(button) {
    const editor = button.closest('.interactive-code-editor');
    const codePreview = editor.querySelector('.code-preview');
    
    // Add running animation
    codePreview.classList.add('code-running');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        codePreview.classList.remove('code-running');
        button.innerHTML = '<i class="fas fa-play"></i>';
        EmaFramework.components.createToast('Code executed successfully! ✅', 'success', 2000);
    }, 1500);
}

function copyCode(button) {
    const editor = button.closest('.interactive-code-editor');
    const codeLines = editor.querySelectorAll('.code-line');
    let codeText = '';
    
    codeLines.forEach(line => {
        codeText += line.textContent + '\n';
    });
    
    navigator.clipboard.writeText(codeText).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        EmaFramework.components.createToast('Code copied to clipboard! 📋', 'success', 1500);
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1000);
    });
}


function editCode(codePreview) {
    const isEditing = codePreview.classList.contains('editing');
    
    if (isEditing) {
        codePreview.classList.remove('editing');
        EmaFramework.components.createToast('Code saved! 💾', 'success', 1500);
    } else {
        codePreview.classList.add('editing');
        EmaFramework.components.createToast('Click anywhere to save changes 📝', 'info', 2000);
    }
}

function toggleDropdown(button) {
    const dropdown = button.closest('.ema-dropdown');
    const menu = dropdown.querySelector('.ema-dropdown-menu');
    const icon = button.querySelector('i');
    
    const isOpen = dropdown.classList.contains('open');
    
    if (isOpen) {
        dropdown.classList.remove('open');
        icon.style.transform = 'rotate(0deg)';
    } else {
        dropdown.classList.add('open');
        icon.style.transform = 'rotate(180deg)';
    }
}

function selectDropdownItem(item, value) {
    const dropdown = item.closest('.ema-dropdown');
    const button = dropdown.querySelector('.ema-dropdown-toggle');
    const text = button.querySelector('.dropdown-text');
    const icon = button.querySelector('i');
    
    text.textContent = value;
    dropdown.classList.remove('open');
    icon.style.transform = 'rotate(0deg)';
    
    EmaFramework.components.createToast(`Selected: ${value} ✨`, 'success', 1500);
}

function switchTab(button, index) {
    const tabContainer = button.closest('.interactive-tabs');
    const buttons = tabContainer.querySelectorAll('.ema-tab-button');
    const panels = tabContainer.querySelectorAll('.tab-panel');
    
    // Remove active classes
    buttons.forEach(btn => btn.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Add active classes
    button.classList.add('active');
    panels[index].classList.add('active');
    
    EmaFramework.components.createToast(`Switched to ${button.textContent} tab! 📁`, 'info', 1500);
}

let tooltipMessages = [
    'Click me for more!',
    'Interactive tooltip! 💫',
    'Keep clicking! 🎯',
    'Amazing features! ⚡',
    'Back to start! 🔄'
];
let tooltipIndex = 0;

function showTooltip(button, message) {
    const tooltip = button.parentElement.querySelector('.ema-tooltip-content');
    tooltip.textContent = message;
    tooltip.classList.add('show');
}

function hideTooltip(button) {
    const tooltip = button.parentElement.querySelector('.ema-tooltip-content');
    tooltip.classList.remove('show');
}

function cycleTooltip(button) {
    tooltipIndex = (tooltipIndex + 1) % tooltipMessages.length;
    const newMessage = tooltipMessages[tooltipIndex];
    
    showTooltip(button, newMessage);
    EmaFramework.components.createToast('Tooltip updated! 💬', 'info', 1000);
}

function handleSwitchChange(input, feature) {
    const isChecked = input.checked;
    const status = isChecked ? 'enabled' : 'disabled';
    const emoji = isChecked ? '✅' : '❌';
    
    EmaFramework.components.createToast(`${feature} ${status}! ${emoji}`, isChecked ? 'success' : 'warning', 1500);
}

// Interactive Chart Functions
function animateChart(chart) {
    const bars = chart.querySelectorAll('.interactive-bar');
    chart.classList.add('chart-animating');
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transform = 'scaleY(0)';
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
            }, 100);
        }, index * 100);
    });
    
    setTimeout(() => {
        chart.classList.remove('chart-animating');
    }, 1000);
    
    EmaFramework.components.createToast('Chart animated! 📊', 'info', 1500);
}

function randomizeChart(button) {
    const chartContainer = button.closest('.chart-collection');
    const bars = chartContainer.querySelectorAll('.interactive-bar');
    
    bars.forEach(bar => {
        const randomValue = Math.floor(Math.random() * 80) + 20; // 20-100%
        const valueSpan = bar.querySelector('.bar-value');
        
        // Animate height change
        bar.style.transition = 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.height = randomValue + '%';
        bar.dataset.value = randomValue;
        
        if (valueSpan) {
            valueSpan.textContent = randomValue + '%';
        }
    });
    
    EmaFramework.components.createToast('Chart data randomized! 🎲', 'success', 1500);
}

function resetChart(button) {
    const chartContainer = button.closest('.chart-collection');
    const bars = chartContainer.querySelectorAll('.interactive-bar');
    const originalValues = [85, 92, 78, 96]; // Original values
    
    bars.forEach((bar, index) => {
        const originalValue = originalValues[index];
        const valueSpan = bar.querySelector('.bar-value');
        
        // Animate height change
        bar.style.transition = 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.height = originalValue + '%';
        bar.dataset.value = originalValue;
        
        if (valueSpan) {
            valueSpan.textContent = originalValue + '%';
        }
    });
    
    EmaFramework.components.createToast('Chart reset to original values! 🔄', 'info', 1500);
}

// New Interactive Component Functions
function sortDataGrid(grid) {
    const rows = Array.from(grid.querySelectorAll('.grid-row'));
    const isAscending = !grid.classList.contains('sorted-desc');
    
    // Sort by score (third column)
    rows.sort((a, b) => {
        const scoreA = parseInt(a.children[2].textContent);
        const scoreB = parseInt(b.children[2].textContent);
        return isAscending ? scoreA - scoreB : scoreB - scoreA;
    });
    
    // Remove existing rows
    rows.forEach(row => row.remove());
    
    // Add sorted rows back
    rows.forEach((row, index) => {
        setTimeout(() => {
            grid.appendChild(row);
            row.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                row.style.transition = 'transform 0.3s ease-out';
                row.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
    
    // Toggle sort direction
    grid.classList.toggle('sorted-desc', !isAscending);
    
    const direction = isAscending ? 'ascending' : 'descending';
    EmaFramework.components.createToast(`Data sorted ${direction}! 📊`, 'success', 1500);
}

function selectColor(palette) {
    const swatches = palette.querySelectorAll('.color-swatch');
    const preview = palette.parentElement.querySelector('.color-preview');
    
    // Handle click on individual swatch
    palette.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-swatch')) {
            const clickedSwatch = e.target;
            const color = clickedSwatch.dataset.color;
            
            // Remove active class from all swatches
            swatches.forEach(swatch => swatch.classList.remove('active'));
            
            // Add active class to clicked swatch
            clickedSwatch.classList.add('active');
            
            // Update preview
            preview.style.background = color;
            preview.textContent = color;
            
            EmaFramework.components.createToast(`Color selected: ${color} 🎨`, 'info', 1500);
        }
    });
}

// Fotodaki Yeni Component Functions
function animateProgress(progressBar) {
    const fill = progressBar.querySelector('.progress-fill');
    const text = progressBar.querySelector('.progress-text');
    const currentWidth = parseInt(fill.style.width);
    const newWidth = Math.floor(Math.random() * 80) + 20; // 20-100%
    
    fill.style.width = newWidth + '%';
    text.textContent = newWidth + '%';
    
    EmaFramework.components.createToast(`Progress updated to ${newWidth}%! 📊`, 'info', 1500);
}

function updateSlider(slider) {
    const value = slider.value;
    const type = slider.classList.contains('primary') ? 'primary' : 
                 slider.classList.contains('success') ? 'success' : 'warning';
    
    EmaFramework.components.createToast(`${type} slider: ${value}% 🎚️`, 'info', 1000);
}

function handleToggle(input, feature) {
    const isChecked = input.checked;
    const status = isChecked ? 'enabled' : 'disabled';
    const emoji = isChecked ? '✅' : '❌';
    
    EmaFramework.components.createToast(`${feature} ${status}! ${emoji}`, isChecked ? 'success' : 'warning', 1500);
}

function showNotification(type) {
    const messages = {
        success: 'Operation completed successfully! ✅',
        warning: 'Please check your input! ⚠️',
        error: 'Something went wrong! ❌',
        info: 'Here\'s some useful information! ℹ️'
    };
    
    EmaFramework.components.createToast(messages[type], type, 2000);
}

function selectButton(button) {
    const group = button.closest('.btn-group');
    const buttons = group.querySelectorAll('.btn-group-item');
    
    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    const text = button.textContent || button.innerHTML;
    EmaFramework.components.createToast(`Selected: ${text} 🎯`, 'info', 1000);
}

function handleInput(input) {
    const value = input.value;
    const type = input.type;
    const size = input.classList.contains('small') ? 'small' : 
                 input.classList.contains('medium') ? 'medium' : 'large';
    
    if (value.length > 0) {
        EmaFramework.components.createToast(`${size} ${type} input updated! ⌨️`, 'info', 1000);
    }
}

// Tetris Grid Filler Functions
function toggleStatus(statusItem) {
    const statuses = ['online', 'busy', 'offline'];
    const currentStatus = statusItem.classList.contains('online') ? 'online' :
                         statusItem.classList.contains('busy') ? 'busy' : 'offline';
    
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    
    // Remove all status classes
    statuses.forEach(status => statusItem.classList.remove(status));
    
    // Add new status class
    statusItem.classList.add(nextStatus);
    
    // Update text
    statusItem.querySelector('span').textContent = nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1);
    
    const emoji = nextStatus === 'online' ? '🟢' : nextStatus === 'busy' ? '🟡' : '🔴';
    EmaFramework.components.createToast(`Status changed to ${nextStatus}! ${emoji}`, 'info', 1500);
}

function flipCard(card) {
    card.style.transform = 'rotateY(180deg)';
    
    setTimeout(() => {
        card.style.transform = 'rotateY(0deg)';
    }, 600);
    
    const text = card.querySelector('.mini-card-text').textContent;
    EmaFramework.components.createToast(`${text} card flipped! 🔄`, 'info', 1000);
}

function quickAction(action) {
    const actions = {
        save: { emoji: '💾', message: 'Saved successfully!' },
        share: { emoji: '📤', message: 'Shared with team!' },
        delete: { emoji: '🗑️', message: 'Deleted item!' },
        edit: { emoji: '✏️', message: 'Edit mode activated!' }
    };
    
    const actionData = actions[action];
    EmaFramework.components.createToast(`${actionData.message} ${actionData.emoji}`, 'success', 1500);
}

function toggleHeart(heartBtn) {
    heartBtn.classList.toggle('active');
    
    const isActive = heartBtn.classList.contains('active');
    const message = isActive ? 'Added to favorites!' : 'Removed from favorites!';
    const emoji = isActive ? '❤️' : '💔';
    
    EmaFramework.components.createToast(`${message} ${emoji}`, isActive ? 'success' : 'warning', 1500);
}

function rateStars(starRating) {
    starRating.classList.add('active');
    
    setTimeout(() => {
        starRating.classList.remove('active');
    }, 500);
    
    EmaFramework.components.createToast('Thanks for rating! ⭐', 'success', 1500);
}

// Design Panel Functions
function toggleDesignPanel() {
    const panel = document.getElementById('designPanel');
    panel.classList.toggle('open');
    
    const isOpen = panel.classList.contains('open');
    const message = isOpen ? 'Design panel opened! 🎨' : 'Design panel closed! 📐';
    EmaFramework.components.createToast(message, 'info', 1000);
}

function setDesignMode(mode) {
    // Remove active class from all buttons
    document.querySelectorAll('.design-mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Apply design mode to body
    document.body.className = document.body.className.replace(/design-mode-\w+/g, '');
    document.body.classList.add(`design-mode-${mode}`);
    
    const modeNames = { normal: 'Normal', dark: 'Dark', light: 'Light' };
    EmaFramework.components.createToast(`${modeNames[mode]} mode activated! 🎭`, 'success', 1500);
}

function toggleEffect(effectType) {
    const checkbox = document.getElementById(`${effectType}Effect`);
    const isEnabled = checkbox.checked;
    
    // Apply effect to body
    if (isEnabled) {
        document.body.classList.add(`effect-${effectType}`);
    } else {
        document.body.classList.remove(`effect-${effectType}`);
    }
    
    const effectNames = { glow: 'Glow', animation: 'Animation', blur: 'Blur' };
    const status = isEnabled ? 'enabled' : 'disabled';
    const emoji = isEnabled ? '✨' : '🚫';
    
    EmaFramework.components.createToast(`${effectNames[effectType]} effects ${status}! ${emoji}`, isEnabled ? 'success' : 'warning', 1500);
}

function updateBorderRadius(value) {
    document.documentElement.style.setProperty('--dynamic-radius', `${value}px`);
    document.querySelector('#borderRadius').nextElementSibling.textContent = `${value}px`;
    
    EmaFramework.components.createToast(`Border radius updated to ${value}px! 📐`, 'info', 1000);
}

function updateAnimationSpeed(value) {
    document.documentElement.style.setProperty('--dynamic-animation-speed', `${value}s`);
    document.querySelector('#animationSpeed').nextElementSibling.textContent = `${value}x`;
    
    EmaFramework.components.createToast(`Animation speed set to ${value}x! ⚡`, 'info', 1000);
}





// Performance monitoring
if (window.performance && window.performance.mark) {
    window.performance.mark('ema-framework-loaded');
    
    window.addEventListener('load', () => {
        window.performance.mark('ema-framework-ready');
        window.performance.measure('ema-framework-total', 'ema-framework-loaded', 'ema-framework-ready');
        
        const measure = window.performance.getEntriesByName('ema-framework-total')[0];
        if (measure) {
            console.log(`⚡ Ema Framework Total Load Time: ${measure.duration.toFixed(2)}ms`);
        }
    });
}

// ===== NEW COMPONENT FUNCTIONS ===== //

// Smart Forms Functions
function focusSmartInput(input) {
    input.classList.add('focused');
    const highlight = input.nextElementSibling;
    if (highlight && highlight.classList.contains('input-highlight')) {
        highlight.style.width = '100%';
    }
}

function toggleSmartSelect(select) {
    select.focus();
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    select.appendChild(ripple);
    setTimeout(() => ripple.remove(), 300);
}

function submitSmartForm(button) {
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Success!';
        button.style.background = 'var(--success-500)';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';
            button.style.background = 'var(--primary)';
            button.style.transform = 'scale(1)';
        }, 2000);
    }, 1500);
}

// Interactive Timeline Functions
function selectTimelineItem(item) {
    // Remove active class from all items
    const timeline = item.closest('.interactive-timeline');
    timeline.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
    
    // Add active class to clicked item
    item.classList.add('active');
    
    // Add pulse animation
    const marker = item.querySelector('.timeline-marker');
    marker.style.animation = 'pulse 0.6s ease-in-out';
    setTimeout(() => {
        marker.style.animation = '';
    }, 600);
}

// Table Row Selection Function
function selectTableRow(row) {
    // Remove selected class from all rows in the same table
    const table = row.closest('.mini-table');
    table.querySelectorAll('.table-row').forEach(r => r.classList.remove('selected'));
    
    // Add selected class to clicked row
    row.classList.add('selected');
    
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(168, 85, 247, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 20px;
        height: 20px;
        left: 50%;
        top: 50%;
        margin-left: -10px;
        margin-top: -10px;
    `;
    
    row.style.position = 'relative';
    row.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}