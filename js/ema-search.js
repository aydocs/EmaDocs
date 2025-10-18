/**
 * Ema Framework - Advanced Search System
 * Global search functionality with real-time results
 */

class EmaSearch {
    constructor() {
        this.searchData = [];
        this.searchIndex = new Map();
        this.isOpen = false;
        this.currentQuery = '';
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.createSearchUI();
        this.bindEvents();
    }

    buildSearchIndex() {
        // Build comprehensive search index from all pages
        this.searchData = [
            // Framework Core
            { title: 'Getting Started', url: 'pages/getting-started.html', category: 'Documentation', description: 'Learn how to get started with Ema Framework', keywords: 'install, setup, quick start, tutorial' },
            { title: 'API Reference', url: 'pages/api.html', category: 'Documentation', description: 'Complete API documentation for all components and modules', keywords: 'api, reference, documentation, methods, functions' },
            { title: 'Components', url: 'pages/components.html', category: 'Components', description: '250+ UI components with live examples', keywords: 'components, ui, buttons, forms, cards, modals' },
            { title: 'Examples', url: 'pages/examples.html', category: 'Examples', description: 'Real-world examples and project templates', keywords: 'examples, templates, projects, demos' },
            { title: 'Showcase', url: 'pages/showcase.html', category: 'Showcase', description: 'Live component showcase with interactive demos', keywords: 'showcase, demos, interactive, live' },
            { title: 'Dashboard', url: 'pages/dashboard.html', category: 'Tools', description: 'Analytics dashboard and framework statistics', keywords: 'dashboard, analytics, stats, metrics' },
            { title: 'Playground', url: 'pages/playground.html', category: 'Tools', description: 'Interactive component playground and builder', keywords: 'playground, builder, interactive, sandbox' },
            { title: 'Revolution', url: 'pages/revolution.html', category: 'Features', description: 'Revolutionary features and next-gen capabilities', keywords: 'revolution, features, next-gen, advanced' },
            
            // UI Components
            { title: 'Button Component', url: 'pages/components.html#button', category: 'Components', description: 'Interactive button component with 8 color variants', keywords: 'button, click, interactive, primary, secondary' },
            { title: 'Card Component', url: 'pages/components.html#card', category: 'Components', description: 'Flexible card component for content display', keywords: 'card, content, display, layout' },
            { title: 'Modal Component', url: 'pages/components.html#modal', category: 'Components', description: 'Advanced modal dialog system', keywords: 'modal, dialog, popup, overlay' },
            { title: 'Form Components', url: 'pages/components.html#forms', category: 'Components', description: 'Complete form component library', keywords: 'form, input, select, checkbox, radio' },
            { title: 'Navigation Components', url: 'pages/components.html#navigation', category: 'Components', description: 'Navigation bars, menus, and breadcrumbs', keywords: 'navigation, menu, navbar, breadcrumb' },
            { title: 'Data Display', url: 'pages/components.html#data', category: 'Components', description: 'Tables, lists, and data visualization components', keywords: 'table, list, data, visualization' },
            
            // JavaScript Modules
            { title: '3D Engine', url: 'pages/api.html#3d-engine', category: 'Modules', description: 'WebGL-based 3D rendering and effects', keywords: '3d, webgl, graphics, effects, particles' },
            { title: 'Animation System', url: 'pages/api.html#animations', category: 'Modules', description: 'Advanced animation and transition system', keywords: 'animation, transition, effects, motion' },
            { title: 'Alert System', url: 'pages/api.html#alerts', category: 'Modules', description: 'Sweet Alert-like notification system', keywords: 'alert, notification, toast, popup' },
            { title: 'Theme System', url: 'pages/api.html#theme', category: 'Modules', description: 'Dynamic theme switching and customization', keywords: 'theme, dark, light, customization' },
            { title: 'Router Module', url: 'pages/api.html#router', category: 'Modules', description: 'Client-side routing and navigation', keywords: 'router, navigation, routing, spa' },
            { title: 'Store Module', url: 'pages/api.html#store', category: 'Modules', description: 'State management and data storage', keywords: 'store, state, data, management' },
            
            // Features
            { title: 'Responsive Design', url: 'pages/revolution.html#responsive', category: 'Features', description: 'Mobile-first responsive design system', keywords: 'responsive, mobile, tablet, desktop' },
            { title: 'Performance', url: 'pages/revolution.html#performance', category: 'Features', description: 'Optimized performance and fast loading', keywords: 'performance, speed, optimization, fast' },
            { title: 'Accessibility', url: 'pages/revolution.html#accessibility', category: 'Features', description: 'WCAG compliant accessibility features', keywords: 'accessibility, a11y, wcag, inclusive' },
            { title: 'PWA Support', url: 'pages/revolution.html#pwa', category: 'Features', description: 'Progressive Web App capabilities', keywords: 'pwa, progressive, web app, offline' },
            { title: 'TypeScript Support', url: 'pages/revolution.html#typescript', category: 'Features', description: 'Full TypeScript support and type definitions', keywords: 'typescript, types, definitions, ts' },
            
            // Examples
            { title: 'E-commerce Template', url: 'pages/examples.html#ecommerce', category: 'Examples', description: 'Complete e-commerce website template', keywords: 'ecommerce, shop, store, product, cart' },
            { title: 'Dashboard Template', url: 'pages/examples.html#dashboard', category: 'Examples', description: 'Analytics dashboard template', keywords: 'dashboard, analytics, charts, metrics' },
            { title: 'Portfolio Template', url: 'pages/examples.html#portfolio', category: 'Examples', description: 'Creative portfolio website template', keywords: 'portfolio, creative, showcase, work' },
            { title: 'Blog Template', url: 'pages/examples.html#blog', category: 'Examples', description: 'Modern blog website template', keywords: 'blog, article, post, content' },
            { title: 'Landing Page', url: 'pages/examples.html#landing', category: 'Examples', description: 'High-converting landing page template', keywords: 'landing, page, marketing, conversion' }
        ];

        // Build search index
        this.searchData.forEach((item, index) => {
            const searchText = `${item.title} ${item.description} ${item.keywords} ${item.category}`.toLowerCase();
            const words = searchText.split(/\s+/);
            
            words.forEach(word => {
                if (word.length > 2) {
                    if (!this.searchIndex.has(word)) {
                        this.searchIndex.set(word, []);
                    }
                    this.searchIndex.get(word).push(index);
                }
            });
        });
    }

    createSearchUI() {
        // Create search overlay
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <div class="search-input-container">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" class="search-input" placeholder="Search Ema Framework..." autocomplete="off">
                        <button class="search-close" aria-label="Close search">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="search-results">
                    <div class="search-suggestions">
                        <div class="suggestion-category">
                            <h4>Popular Searches</h4>
                            <div class="suggestion-tags">
                                <span class="suggestion-tag" data-query="button">Button</span>
                                <span class="suggestion-tag" data-query="modal">Modal</span>
                                <span class="suggestion-tag" data-query="form">Form</span>
                                <span class="suggestion-tag" data-query="3d">3D Effects</span>
                                <span class="suggestion-tag" data-query="animation">Animation</span>
                                <span class="suggestion-tag" data-query="responsive">Responsive</span>
                            </div>
                        </div>
                        <div class="suggestion-category">
                            <h4>Quick Links</h4>
                            <div class="quick-links">
                                <a href="pages/getting-started.html" class="quick-link">
                                    <i class="fas fa-rocket"></i>
                                    <span>Getting Started</span>
                                </a>
                                <a href="pages/components.html" class="quick-link">
                                    <i class="fas fa-puzzle-piece"></i>
                                    <span>Components</span>
                                </a>
                                <a href="pages/api.html" class="quick-link">
                                    <i class="fas fa-code"></i>
                                    <span>API Reference</span>
                                </a>
                                <a href="pages/examples.html" class="quick-link">
                                    <i class="fas fa-laptop-code"></i>
                                    <span>Examples</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="search-results-list"></div>
                </div>
            </div>
        `;

        document.body.appendChild(searchOverlay);

        // Add search styles
        const style = document.createElement('style');
        style.textContent = `
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .search-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .search-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                height: 100vh;
                display: flex;
                flex-direction: column;
            }

            .search-header {
                margin-bottom: 2rem;
            }

            .search-input-container {
                position: relative;
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(111, 66, 193, 0.3);
                border-radius: 15px;
                padding: 1rem 1.5rem;
                transition: all 0.3s ease;
            }

            .search-input-container:focus-within {
                border-color: var(--ema-purple);
                box-shadow: 0 0 0 4px rgba(111, 66, 193, 0.1);
            }

            .search-icon {
                color: var(--ema-purple);
                font-size: 1.2rem;
                margin-right: 1rem;
            }

            .search-input {
                flex: 1;
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                outline: none;
                font-family: 'Inter', sans-serif;
            }

            .search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .search-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: all 0.3s ease;
            }

            .search-close:hover {
                color: white;
                background: rgba(255, 255, 255, 0.1);
            }

            .search-results {
                flex: 1;
                overflow-y: auto;
            }

            .search-suggestions {
                margin-bottom: 2rem;
            }

            .suggestion-category {
                margin-bottom: 2rem;
            }

            .suggestion-category h4 {
                color: var(--ema-text-primary);
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 1rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .suggestion-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .suggestion-tag {
                background: rgba(111, 66, 193, 0.2);
                color: var(--ema-purple);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(111, 66, 193, 0.3);
            }

            .suggestion-tag:hover {
                background: var(--ema-purple);
                color: white;
                transform: translateY(-2px);
            }

            .quick-links {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .quick-link {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(111, 66, 193, 0.2);
                border-radius: 12px;
                color: var(--ema-text-primary);
                text-decoration: none;
                transition: all 0.3s ease;
            }

            .quick-link:hover {
                background: rgba(111, 66, 193, 0.1);
                border-color: var(--ema-purple);
                transform: translateY(-2px);
            }

            .quick-link i {
                color: var(--ema-purple);
                font-size: 1.2rem;
            }

            .search-results-list {
                display: none;
            }

            .search-results-list.active {
                display: block;
            }

            .search-result-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(111, 66, 193, 0.2);
                border-radius: 12px;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: inherit;
            }

            .search-result-item:hover {
                background: rgba(111, 66, 193, 0.1);
                border-color: var(--ema-purple);
                transform: translateY(-2px);
            }

            .result-icon {
                width: 50px;
                height: 50px;
                background: var(--ema-gradient-primary);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
                flex-shrink: 0;
            }

            .result-content {
                flex: 1;
            }

            .result-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--ema-text-primary);
                margin-bottom: 0.5rem;
            }

            .result-description {
                color: var(--ema-text-muted);
                font-size: 0.9rem;
                line-height: 1.4;
                margin-bottom: 0.5rem;
            }

            .result-category {
                display: inline-block;
                background: rgba(111, 66, 193, 0.2);
                color: var(--ema-purple);
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
            }

            .no-results {
                text-align: center;
                padding: 3rem;
                color: var(--ema-text-muted);
            }

            .no-results i {
                font-size: 3rem;
                color: var(--ema-purple);
                margin-bottom: 1rem;
            }

            @media (max-width: 768px) {
                .search-container {
                    padding: 1rem;
                }
                
                .quick-links {
                    grid-template-columns: 1fr;
                }
                
                .search-input {
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const searchOverlay = document.querySelector('.search-overlay');
        const searchInput = document.querySelector('.search-input');
        const searchClose = document.querySelector('.search-close');
        const suggestionTags = document.querySelectorAll('.suggestion-tag');

        // Open search with Ctrl+K or Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSearch();
            }
        });

        // Search input events
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Close search
        searchClose.addEventListener('click', () => {
            this.closeSearch();
        });

        // Close on overlay click
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                this.closeSearch();
            }
        });

        // Suggestion tag clicks
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.dataset.query;
                searchInput.value = query;
                this.performSearch(query);
            });
        });
    }

    openSearch() {
        const searchOverlay = document.querySelector('.search-overlay');
        const searchInput = document.querySelector('.search-input');
        
        searchOverlay.classList.add('active');
        searchInput.focus();
        this.isOpen = true;
        
        // Show suggestions initially
        document.querySelector('.search-suggestions').style.display = 'block';
        document.querySelector('.search-results-list').classList.remove('active');
    }

    closeSearch() {
        const searchOverlay = document.querySelector('.search-overlay');
        const searchInput = document.querySelector('.search-input');
        
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        this.isOpen = false;
        this.currentQuery = '';
        
        // Reset results
        document.querySelector('.search-suggestions').style.display = 'block';
        document.querySelector('.search-results-list').classList.remove('active');
    }

    performSearch(query) {
        this.currentQuery = query.toLowerCase().trim();
        
        if (!this.currentQuery) {
            document.querySelector('.search-suggestions').style.display = 'block';
            document.querySelector('.search-results-list').classList.remove('active');
            return;
        }

        document.querySelector('.search-suggestions').style.display = 'none';
        document.querySelector('.search-results-list').classList.add('active');

        const results = this.search(this.currentQuery);
        this.displayResults(results);
    }

    search(query) {
        const words = query.split(/\s+/);
        const resultIndices = new Set();
        
        words.forEach(word => {
            if (word.length > 2) {
                const indices = this.searchIndex.get(word) || [];
                indices.forEach(index => resultIndices.add(index));
            }
        });

        // Also search for partial matches
        this.searchIndex.forEach((indices, key) => {
            if (key.includes(query) || query.includes(key)) {
                indices.forEach(index => resultIndices.add(index));
            }
        });

        return Array.from(resultIndices).map(index => this.searchData[index]);
    }

    displayResults(results) {
        const resultsList = document.querySelector('.search-results-list');
        
        if (results.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try searching for "button", "modal", "form", or "3d"</p>
                </div>
            `;
            return;
        }

        const categoryIcons = {
            'Documentation': 'fas fa-book',
            'Components': 'fas fa-puzzle-piece',
            'Examples': 'fas fa-laptop-code',
            'Showcase': 'fas fa-star',
            'Tools': 'fas fa-tools',
            'Features': 'fas fa-magic',
            'Modules': 'fas fa-cogs'
        };

        resultsList.innerHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item" onclick="window.emaSearch.closeSearch()">
                <div class="result-icon">
                    <i class="${categoryIcons[result.category] || 'fas fa-file'}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                    <div class="result-category">${result.category}</div>
                </div>
            </a>
        `).join('');
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emaSearch = new EmaSearch();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaSearch;
}
