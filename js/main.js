// Main Application JavaScript - Handles navigation, UI interactions, and app initialization

class AIConceptRefresher {
    constructor() {
        this.currentSection = 'home';
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.renderSubjects();
        this.updateProgressDashboard();
        this.setupMobileMenu();
        this.checkFirstVisit();
    }

    setupEventListeners() {
        // Navigation click handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.navigateToSection(section);
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    this.navigateToSection(targetId);
                }
            });
        });

        // Window scroll handler for navbar styling
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupNavigation() {
        // Set initial active navigation
        this.updateActiveNavigation('home');
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        this.mobileMenuOpen = !this.mobileMenuOpen;

        if (this.mobileMenuOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    closeMobileMenu() {
        if (this.mobileMenuOpen) {
            this.mobileMenuOpen = false;
            document.querySelector('.hamburger').classList.remove('active');
            document.querySelector('.nav-menu').classList.remove('active');
        }
    }

    navigateToSection(section) {
        // Hide all sections
        document.querySelectorAll('section').forEach(sec => {
            sec.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = section;
            this.updateActiveNavigation(section);
        }

        // Update page title
        this.updatePageTitle(section);

        // Close mobile menu if open
        this.closeMobileMenu();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update progress dashboard if navigating to progress section
        if (section === 'progress') {
            this.updateProgressDashboard();
        }
    }

    updateActiveNavigation(section) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${section}`) {
                link.classList.add('active');
            }
        });
    }

    updatePageTitle(section) {
        const titles = {
            home: 'Concept Refresher - Master Your Knowledge',
            subjects: 'Choose Your Subject - Concept Refresher',
            progress: 'Your Progress - Concept Refresher',
            quiz: 'Quiz in Progress - Concept Refresher',
            about: 'About - Concept Refresher'
        };

        document.title = titles[section] || 'Concept Refresher';
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case '1':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.navigateToSection('home');
                }
                break;
            case '2':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.navigateToSection('subjects');
                }
                break;
            case '3':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.navigateToSection('progress');
                }
                break;
            case 'Escape':
                if (this.currentSection === 'quiz') {
                    window.quizEngine.exitQuiz();
                }
                break;
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    renderSubjects() {
        if (window.SubjectsManager) {
            window.SubjectsManager.renderSubjects();
        }
    }

    updateProgressDashboard() {
        const stats = window.ProgressTracker.getOverallStats();
        const subjectProgress = window.ProgressTracker.getSubjectProgress();

        // Update overall stats
        this.updateStatCard('totalQuestions', stats.totalQuestions);
        this.updateStatCard('accuracy', `${stats.accuracy.toFixed(1)}%`);
        this.updateStatCard('streak', stats.streakCurrent);
        this.updateStatCard('daysActive', stats.daysActive);

        // Update subject progress
        this.updateSubjectProgressList(subjectProgress);

        // Show recommendations if any
        this.showRecommendations();
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            element.classList.add('updated');
            setTimeout(() => element.classList.remove('updated'), 500);
        }
    }

    updateSubjectProgressList(subjectProgress) {
        const container = document.getElementById('subjectProgressList');
        if (!container) return;

        container.innerHTML = subjectProgress.map(subject => `
            <div class="subject-progress-item">
                <div class="subject-name">
                    <i class="${subject.icon}" style="color: ${subject.color}"></i>
                    ${subject.name}
                </div>
                <div class="mastery-bar">
                    <div class="mastery-fill" style="width: ${subject.mastery}%"></div>
                </div>
                <div class="mastery-percentage">${subject.mastery.toFixed(0)}%</div>
            </div>
        `).join('');

        // Animate the progress bars
        setTimeout(() => {
            container.querySelectorAll('.mastery-fill').forEach((fill, index) => {
                fill.style.transition = 'width 1s ease-out';
                fill.style.transitionDelay = `${index * 0.1}s`;
            });
        }, 100);
    }

    showRecommendations() {
        const recommendations = window.ProgressTracker.data.analytics.recommendations;
        if (recommendations && recommendations.length > 0) {
            this.createRecommendationsSection(recommendations);
        }
    }

    createRecommendationsSection(recommendations) {
        const progressSection = document.getElementById('progress');
        let recommendationsContainer = progressSection.querySelector('.recommendations-container');

        if (!recommendationsContainer) {
            recommendationsContainer = document.createElement('div');
            recommendationsContainer.className = 'recommendations-container';
            recommendationsContainer.innerHTML = '<h3>Recommendations</h3><div class="recommendations-list"></div>';
            progressSection.querySelector('.container').appendChild(recommendationsContainer);
        }

        const recommendationsList = recommendationsContainer.querySelector('.recommendations-list');
        recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card ${rec.priority}">
                <div class="recommendation-icon">
                    <i class="fas ${this.getRecommendationIcon(rec.type)}"></i>
                </div>
                <div class="recommendation-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
                <div class="recommendation-action">
                    ${this.getRecommendationButton(rec)}
                </div>
            </div>
        `).join('');
    }

    getRecommendationIcon(type) {
        const icons = {
            improvement: 'fa-chart-line',
            progression: 'fa-arrow-up',
            engagement: 'fa-fire',
            review: 'fa-book-open'
        };
        return icons[type] || 'fa-lightbulb';
    }

    getRecommendationButton(recommendation) {
        switch (recommendation.action) {
            case 'study_topic':
                return `<button class="btn btn-sm btn-primary" onclick="app.focusOnTopic('${recommendation.data}')">Study Now</button>`;
            case 'increase_difficulty':
                return `<button class="btn btn-sm btn-primary" onclick="app.startAdvancedQuiz()">Try Advanced</button>`;
            case 'continue_learning':
                return `<button class="btn btn-sm btn-primary" onclick="showSubjects()">Start Learning</button>`;
            default:
                return '';
        }
    }

    focusOnTopic(topic) {
        // This would filter questions by topic in the quiz engine
        alert(`Feature coming soon: Focused practice on ${topic}`);
    }

    startAdvancedQuiz() {
        // Navigate to subjects with advanced difficulty preset
        this.navigateToSection('subjects');
        // Could add UI indication for advanced mode
    }

    checkFirstVisit() {
        const isFirstVisit = !localStorage.getItem('conceptRefresher_hasVisited');
        if (isFirstVisit) {
            this.showWelcomeMessage();
            localStorage.setItem('conceptRefresher_hasVisited', 'true');
        }
    }

    showWelcomeMessage() {
        // Create and show a welcome modal or notification
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-overlay';
        welcomeMessage.innerHTML = `
            <div class="welcome-modal">
                <div class="welcome-content">
                    <i class="fas fa-brain welcome-icon"></i>
                    <h2>Welcome to Concept Refresher</h2>
                    <p>Build stronger understanding through adaptive quizzes and intelligent learning patterns.</p>
                    <ul class="welcome-features">
                        <li><i class="fas fa-check"></i> Smart question selection</li>
                        <li><i class="fas fa-check"></i> Spaced repetition learning</li>
                        <li><i class="fas fa-check"></i> Progress tracking and analytics</li>
                        <li><i class="fas fa-check"></i> Multiple subject areas</li>
                    </ul>
                    <button class="btn btn-primary" onclick="app.closeWelcome()">Get Started</button>
                </div>
            </div>
        `;

        document.body.appendChild(welcomeMessage);
        setTimeout(() => welcomeMessage.classList.add('show'), 100);
    }

    closeWelcome() {
        const welcomeOverlay = document.querySelector('.welcome-overlay');
        if (welcomeOverlay) {
            welcomeOverlay.classList.add('hide');
            setTimeout(() => welcomeOverlay.remove(), 300);
        }
        this.navigateToSection('subjects');
    }

    // Utility functions for theme switching (future enhancement)
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('conceptRefresher_theme', 
            document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('conceptRefresher_theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Performance monitoring
    logPerformance(action, duration) {
        if (console.time && console.timeEnd) {
            console.log(`Performance: ${action} took ${duration}ms`);
        }
    }
}

// Global functions for HTML onclick handlers
function startLearning() {
    app.navigateToSection('subjects');
}

function viewProgress() {
    app.navigateToSection('progress');
}

function showSubjects() {
    app.navigateToSection('subjects');
}

function goHome() {
    app.navigateToSection('home');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AIConceptRefresher();
    
    // Initialize core systems for quiz functionality
    if (window.ProgressTracker) {
        window.progressTracker = new ProgressTracker();
    }
    if (window.QuizEngine) {
        window.quizEngine = new QuizEngine();
    }
    
    // Initialize Real AI Engine for enhanced learning
    if (window.SimpleAIEngine) {
        console.log('Starting Simple AI Engine initialization...');
        window.SimpleAIEngine.initialize()
            .then((success) => {
                if (success) {
                    console.log('Simple AI Engine with WebLLM initialized successfully!');
                    console.log('Your learning platform now has real AI capabilities!');
                    console.log('Try the AI Lab to chat with the AI!');
                } else {
                    console.log('Using fallback AI system - still intelligent, just not LLM-powered');
                }
            })
            .catch(error => {
                console.warn('AI Engine initialization failed:', error);
                console.log('Don\'t worry - your learning platform still works great!');
            });
    } else {
        console.log('AI Engine not found - checking file loading...');
    }
    
    // Add smooth reveal animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, refresh progress if needed
        if (window.app && window.app.currentSection === 'progress') {
            window.app.updateProgressDashboard();
        }
    }
});

// Service Worker registration for future PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for external use
window.AIConceptRefresher = AIConceptRefresher;