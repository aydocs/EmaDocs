/* ========================================
   EMA FRAMEWORK - NAVBAR FUNCTIONALITY
   Ultra Modern, Minimalist, Revolutionary Design
   ======================================== */

// Navbar functionality initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Navbar functionality initialized');
    
    // Hamburger Menu Toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.getElementById('mobileNav');
    const mobileFrameworkTrigger = document.querySelector('.mobile-framework-trigger');
    const mobileMegaDropdown = document.getElementById('mobileMegaDropdown');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }
    
    if (mobileFrameworkTrigger && mobileMegaDropdown) {
        mobileFrameworkTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMegaDropdown.style.display = mobileMegaDropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
    
    // Auto-open dropdown on hover for desktop
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const megaDropdown = document.querySelector('.mega-dropdown');
    
    if (dropdownTrigger && megaDropdown) {
        dropdownTrigger.addEventListener('mouseenter', () => {
            megaDropdown.classList.add('active');
        });
        
        dropdownTrigger.addEventListener('mouseleave', () => {
            // Add delay to prevent flickering
            setTimeout(() => {
                if (!megaDropdown.matches(':hover')) {
                    megaDropdown.classList.remove('active');
                }
            }, 100);
        });
        
        megaDropdown.addEventListener('mouseenter', () => {
            megaDropdown.classList.add('active');
        });
        
        megaDropdown.addEventListener('mouseleave', () => {
            megaDropdown.classList.remove('active');
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Search functionality
    const searchTrigger = document.querySelector('.search-trigger');
    if (searchTrigger) {
        searchTrigger.addEventListener('click', () => {
            if (typeof openSearch === 'function') {
                openSearch();
            }
        });
    }
    
    // Logo hover effect
    const logo = document.querySelector('.ema-logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1)';
        });
    }
    
    // Navigation link hover effects
    document.querySelectorAll('.ema-nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
    
    // Dropdown item hover effects
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
    
    // Mobile navigation link effects
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateX(10px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateX(0)';
        });
    });
    
    // Mobile dropdown item effects
    document.querySelectorAll('.mobile-dropdown-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
    
    console.log('Navbar functionality ready');
});

// Export functions for external use
window.EmaNavbar = {
    toggleMobileNav: function() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const mobileNav = document.getElementById('mobileNav');
        
        if (hamburgerMenu && mobileNav) {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        }
    },
    
    closeMobileNav: function() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const mobileNav = document.getElementById('mobileNav');
        
        if (hamburgerMenu && mobileNav) {
            hamburgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    },
    
    toggleMegaDropdown: function() {
        const megaDropdown = document.querySelector('.mega-dropdown');
        
        if (megaDropdown) {
            megaDropdown.classList.toggle('active');
        }
    },
    
    openMegaDropdown: function() {
        const megaDropdown = document.querySelector('.mega-dropdown');
        
        if (megaDropdown) {
            megaDropdown.classList.add('active');
        }
    },
    
    closeMegaDropdown: function() {
        const megaDropdown = document.querySelector('.mega-dropdown');
        
        if (megaDropdown) {
            megaDropdown.classList.remove('active');
        }
    }
};
