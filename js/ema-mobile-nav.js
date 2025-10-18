// Mobile Navigation Handler
document.addEventListener('DOMContentLoaded', function() {
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
});
