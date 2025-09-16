// Global variables
let paperScope;
let currentTheme = 'light-steel';
let logoClickCount = 0;
let mousePosition = { x: 0, y: 0 };

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons first
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Initialize all features
    initPaperJS();
    initCursor();
    initSmoothScrolling();
    initTypingAnimation();
    initScrollAnimations();
    initNavigation();
    initResumeDownload();
    initThemeSwitchEasterEgg();
    initInteractiveEffects();
    initSocialLinks();
    
    // Add loading class to body for initial animation
    document.body.classList.add('loading');
    
    // Set initial active nav link
    setTimeout(() => {
        updateActiveSection();
    }, 500);
});

// Initialize Paper.js for enhanced background animations
function initPaperJS() {
    const canvas = document.getElementById('paperCanvas');
    if (!canvas || typeof paper === 'undefined') return;
    
    // Setup Paper.js
    paper.setup(canvas);
    paperScope = paper;
    
    // Create floating geometric shapes
    const shapes = [];
    const particleCount = 15;
    
    // Create different geometric shapes
    for (let i = 0; i < particleCount; i++) {
        const shape = createFloatingShape(i);
        shapes.push(shape);
    }
    
    // Mouse interaction variables
    let mousePoint = new paper.Point(0, 0);
    
    // Handle mouse movement
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mousePoint.x = event.clientX - rect.left;
        mousePoint.y = event.clientY - rect.top;
        mousePosition.x = mousePoint.x;
        mousePosition.y = mousePoint.y;
    });
    
    // Animation loop
    paper.view.onFrame = function(event) {
        shapes.forEach((shape, index) => {
            // Floating animation
            shape.position.y += Math.sin(event.time * 2 + index) * 0.5;
            shape.position.x += Math.cos(event.time * 1.5 + index) * 0.3;
            
            // Mouse interaction - shapes move away from cursor
            const distance = shape.position.getDistance(mousePoint);
            if (distance < 150) {
                const force = mousePoint.subtract(shape.position);
                force.length = Math.max(0, 150 - distance) * 0.01;
                shape.position = shape.position.subtract(force);
            }
            
            // Rotation
            shape.rotation += 0.5;
            
            // Wrap around screen edges
            if (shape.position.x < -50) shape.position.x = paper.view.size.width + 50;
            if (shape.position.x > paper.view.size.width + 50) shape.position.x = -50;
            if (shape.position.y < -50) shape.position.y = paper.view.size.height + 50;
            if (shape.position.y > paper.view.size.height + 50) shape.position.y = -50;
        });
    };
    
    // Handle window resize
    window.addEventListener('resize', function() {
        paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);
    });
}

// Create different types of floating shapes
function createFloatingShape(index) {
    const colors = {
        'light-steel': ['#ADB5BD', '#6C757D', '#CED4DA'],
        'earthy': ['#8B7355', '#BC9A6A', '#D2B48C']
    };
    
    const currentColors = colors[currentTheme] || colors['light-steel'];
    const color = currentColors[index % currentColors.length];
    
    const x = Math.random() * paper.view.size.width;
    const y = Math.random() * paper.view.size.height;
    const size = 20 + Math.random() * 40;
    
    let shape;
    const shapeType = index % 4;
    
    switch (shapeType) {
        case 0: // Circle
            shape = new paper.Path.Circle(new paper.Point(x, y), size / 2);
            break;
        case 1: // Triangle
            shape = new paper.Path.RegularPolygon(new paper.Point(x, y), 3, size / 2);
            break;
        case 2: // Square
            shape = new paper.Path.Rectangle(new paper.Point(x - size/2, y - size/2), size, size);
            break;
        case 3: // Hexagon
            shape = new paper.Path.RegularPolygon(new paper.Point(x, y), 6, size / 2);
            break;
    }
    
    shape.fillColor = color;
    shape.opacity = 0.1 + Math.random() * 0.1;
    shape.blendMode = 'multiply';
    
    return shape;
}

// Update Paper.js shapes when theme changes
function updatePaperJSTheme() {
    if (!paperScope || !paperScope.project) return;
    
    const colors = {
        'light-steel': ['#ADB5BD', '#6C757D', '#CED4DA'],
        'earthy': ['#8B7355', '#BC9A6A', '#D2B48C']
    };
    
    const currentColors = colors[currentTheme] || colors['light-steel'];
    
    paperScope.project.activeLayer.children.forEach((shape, index) => {
        const color = currentColors[index % currentColors.length];
        shape.fillColor = color;
        
        // Add a brief glow effect during transition
        shape.opacity = 0.3;
        setTimeout(() => {
            shape.opacity = 0.1 + Math.random() * 0.1;
        }, 300);
    });
}

// Theme switching easter egg - FIXED VERSION
function initThemeSwitchEasterEgg() {
    const logo = document.querySelector('#portfolioLogo');
    if (!logo) {
        console.error('Logo element not found!');
        return;
    }
    
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        logoClickCount++;
        console.log(`Logo clicked ${logoClickCount} times`);
        
        // Add click feedback with more visible effect
        logo.style.transform = 'scale(0.9)';
        logo.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            logo.style.transform = 'scale(1)';
        }, 100);
        
        // Show click counter feedback
        if (logoClickCount < 5) {
            const remaining = 5 - logoClickCount;
            showThemeNotification(`✨ ${remaining} more clicks to switch theme!`);
        }
        
        if (logoClickCount === 5) {
            console.log('5 clicks reached - switching theme!');
            switchTheme();
            logoClickCount = 0; // Reset counter
        }
    });
}

// Switch between Light Steel and Earthy themes - FIXED VERSION
function switchTheme() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const logo = document.querySelector('#portfolioLogo');
    
    // Toggle theme
    currentTheme = currentTheme === 'light-steel' ? 'earthy' : 'light-steel';
    
    console.log(`Switching to theme: ${currentTheme}`);
    
    // Apply theme to both HTML and body elements
    htmlElement.setAttribute('data-theme', currentTheme);
    bodyElement.setAttribute('data-theme', currentTheme);
    
    // Add dramatic glow effect to logo
    if (logo) {
        logo.classList.add('theme-switch-glow');
        logo.style.boxShadow = '0 0 30px rgba(var(--theme-primary-rgb), 0.6)';
        setTimeout(() => {
            logo.classList.remove('theme-switch-glow');
            logo.style.boxShadow = '';
        }, 600);
    }
    
    // Update Paper.js shapes
    updatePaperJSTheme();
    
    // Show dramatic notification
    const themeName = currentTheme === 'light-steel' ? 'Light Steel' : 'Earthy Tones';
    showThemeNotification(`🎨 Theme switched to ${themeName}! Easter egg activated!`);
    
    // Update cursor color
    updateCursorTheme();
    
    // Add a more dramatic page flash effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--theme-primary);
        opacity: 0.2;
        z-index: 9998;
        pointer-events: none;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }, 100);
}

// Show theme notification - ENHANCED VERSION
function showThemeNotification(message) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.theme-switch-notification');
    existing.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'theme-switch-notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none; 
            border: none; 
            color: inherit; 
            font-size: 18px; 
            margin-left: 10px; 
            cursor: pointer;
        ">&times;</button>
    `;
    
    // Enhanced notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: 'var(--theme-cards)',
        border: '2px solid var(--theme-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-12) var(--space-16)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '10001',
        transform: 'translateX(400px)',
        transition: 'all 0.3s ease',
        color: 'var(--theme-text-primary)',
        fontFamily: 'var(--font-family-base)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '350px'
    });
    
    document.body.appendChild(notification);
    
    // Show notification with bounce effect
    setTimeout(() => {
        notification.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 150);
    }, 100);
    
    // Auto hide notification after 4 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Custom cursor follower
function initCursor() {
    const cursor = document.getElementById('cursor-follower');
    if (!cursor) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Only show cursor on desktop
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor following animation
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card, .social-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '0.8';
            });
        });
    }
    
    // Initial cursor theme
    updateCursorTheme();
}

// Update cursor theme colors
function updateCursorTheme() {
    const cursor = document.getElementById('cursor-follower');
    if (!cursor) return;
    
    // The CSS will handle the color transition via CSS variables
    // This function exists for potential future cursor customizations
}

// Smooth scrolling for navigation links - FIXED VERSION
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            console.log(`Navigating to: ${targetId}`);
            
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    scrollToSection(targetElement);
                    updateActiveNavLink(this);
                    
                    // Visual feedback
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                } else {
                    console.error(`Target element ${targetId} not found`);
                }
            }
        });
    });

    // Handle hero button - FIXED
    const heroButton = document.querySelector('.hero__buttons .btn--primary[href="#about"]');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                scrollToSection(aboutSection);
                console.log('Navigated to About section');
            }
        });
    }
}

// Enhanced scroll to section function
function scrollToSection(targetElement) {
    const nav = document.querySelector('.nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Typing animation for hero title - FIXED FOR "Sameer Rehman"
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = 'Sameer Rehman';
    let index = 0;

    // Clear initial text
    typingElement.textContent = '';
    typingElement.style.minWidth = '300px'; // Prevent layout shift

    function typeWriter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 120); // Consistent typing speed
        } else {
            // Keep the cursor blinking after typing is complete
            setTimeout(() => {
                if (typingElement.querySelector('.cursor')) {
                    // Cursor already exists
                    return;
                }
            }, 1000);
        }
    }

    // Start typing animation after a delay
    setTimeout(() => {
        console.log('Starting typing animation for: Sameer Rehman');
        typeWriter();
    }, 1200);
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animations for different sections
                if (entry.target.classList.contains('skill-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
                
                if (entry.target.classList.contains('social-link')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .social-link, .section-title');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in-up');
        observer.observe(element);
    });
}

// Navigation scroll effects
function initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    // Scroll event listener for nav effects and active section detection
    window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;

        // Update nav background based on scroll
        if (currentScroll > 100) {
            nav.style.backdropFilter = 'blur(15px)';
        } else {
            nav.style.backdropFilter = 'blur(10px)';
        }

        // Update active section
        updateActiveSection();
    }, 10));

    // Initial call to set active section
    updateActiveSection();
}

// Enhanced active section detection
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (sections.length === 0) return;
    
    let current = 'home'; // Default to home
    const scrollPosition = window.pageYOffset + 150;

    // Find current section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    // Special case: if we're at the very top, always show home as active
    if (window.pageYOffset < 50) {
        current = 'home';
    }

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Resume download functionality - ENHANCED WITH ACTUAL PDF DOWNLOAD
function initResumeDownload() {
    const resumeBtn = document.querySelector('.resume-btn');
    if (!resumeBtn) return;
    
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add download animation
        resumeBtn.style.transform = 'scale(0.95)';
        resumeBtn.style.transition = 'transform 0.15s ease';
        
        setTimeout(() => {
            resumeBtn.style.transform = 'scale(1)';
            
            // Create and trigger download
            downloadResume();
            
            // Show success notification
            showThemeNotification('📄 Resume download started!');
        }, 150);
    });
}

// Function to handle the actual resume download
function downloadResume() {
    try {
        // Direct link to your PDF stored in the same folder
        const pdfPath = 'Sam-s_Resume.pdf';
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = "Sam's_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Success notification as before
        showThemeNotification('📄 Resume download started!');
    } catch (error) {
        console.error('Error downloading resume:', error);
        showThemeNotification('❌ Download failed. Please try again.');
    }
}



// Add interactive hover effects
function initInteractiveEffects() {
    // Skill items tilt effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Project cards 3D effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Handle social media link clicks with feedback
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const linkText = link.querySelector('.social-link__text').textContent;
            
            // Add click animation
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = '';
            }, 150);
            
            // Show feedback for external links
            if (link.href && link.href !== '#' && !link.href.startsWith('mailto:2023nitsgr234@nitsri.ac.in')) {
                showThemeNotification(`🔗 Opening ${linkText}...`);
            } else if (link.href.startsWith('mailto:')) {
                showThemeNotification(`📧 Opening email client...`);
            }
        });
    });
}

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard navigation and accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open notifications
        const notifications = document.querySelectorAll('.theme-switch-notification');
        notifications.forEach(notification => {
            notification.remove();
        });
    }
    
    // Add keyboard navigation for sections
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        scrollToNextSection();
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        scrollToPrevSection();
    }
    
    // Theme switch shortcut
    if (e.key === 'T' && e.ctrlKey) {
        e.preventDefault();
        switchTheme();
    }
});

// Helper functions for keyboard navigation
function scrollToNextSection() {
    const sections = ['home', 'about', 'projects', 'contact'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    
    const targetSection = document.querySelector(`#${sections[nextIndex]}`);
    if (targetSection) {
        scrollToSection(targetSection);
    }
}

function scrollToPrevSection() {
    const sections = ['home', 'about', 'projects', 'contact'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
    
    const targetSection = document.querySelector(`#${sections[prevIndex]}`);
    if (targetSection) {
        scrollToSection(targetSection);
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 200;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            return section.getAttribute('id');
        }
    }
    
    return 'home';
}

// Initialize everything when page loads
window.addEventListener('load', () => {
    // Re-initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Mark as loaded
    document.body.classList.add('loaded');
    
    // Final active section update
    setTimeout(() => {
        updateActiveSection();
    }, 100);
    
    console.log('Sameer\'s Portfolio fully loaded with Paper.js animations and theme switching!');
});

// Handle window resize for Paper.js
window.addEventListener('resize', debounce(() => {
    if (paperScope && paperScope.view) {
        paperScope.view.viewSize = new paperScope.Size(window.innerWidth, window.innerHeight);
    }
}, 250));
