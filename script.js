// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Update toggle button icon based on current theme
function updateToggleIcon() {
    const icon = themeToggle.querySelector('i');
    if (html.getAttribute('data-theme') === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Initialize toggle icon
updateToggleIcon();

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon();
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .detail-item, .highlight-item, .contact-method');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroSubtitle = document.querySelector('.hero-text h2');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 80);
        }, 1000);
    }
});

// Skill items hover effect
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Project card tilt effect
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic navbar background
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Counter animation for stats (if you want to add stats later)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Lazy loading for images (if you add images later)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Dark mode toggle (optional feature)
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transition: all 0.3s ease;
        display: none; /* Hidden by default, can be enabled */
    `;
    
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDark);
    });
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Copy wallet address to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Wallet address copied to clipboard!', 'success');
    }).catch(function(err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Wallet address copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy address. Please copy manually.', 'error');
        }
        document.body.removeChild(textArea);
    });
}

// Web3 stats counter animation
function animateWeb3Counters() {
    const counters = document.querySelectorAll('.stat-info h4');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        if (text.includes('1443')) {
            animateCounter(counter, 1443, 2000, ' Days');
        } else if (text.includes('1M+')) {
            animateCounter(counter, 1000000, 3000, '+', true);
        }
    });
}

// Enhanced counter animation with formatting
function animateCounter(element, target, duration = 2000, suffix = '', isLarge = false) {
    let start = 0;
    const increment = target / (duration / 16);
    const originalText = element.textContent;
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            if (isLarge && start > 1000) {
                const formatted = (start / 1000000).toFixed(1) + 'M+';
                element.textContent = formatted;
            } else {
                element.textContent = Math.floor(start) + suffix;
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (isLarge) {
                element.textContent = '1M+ Transactions';
            } else {
                element.textContent = target + suffix;
            }
        }
    }
    
    updateCounter();
}

// Initialize Web3 animations when section comes into view
const web3Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateWeb3Counters();
            web3Observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const web3Section = document.querySelector('.web3-section');
    if (web3Section) {
        web3Observer.observe(web3Section);
    }
});

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Initialize features
    // initDarkMode(); // Uncomment if you want dark mode
    
    // Add smooth reveal animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Custom Cursor Follower
document.addEventListener('DOMContentLoaded', function() {
    const cursorFollower = document.getElementById('cursorFollower');
    const cursorSun = document.querySelector('.cursor-sun');
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let isVisible = false;

    // Check if device supports hover (not touch device)
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    
    if (!supportsHover) {
        return; // Don't enable cursor follower on touch devices
    }

    // Mouse move handler
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isVisible) {
            cursorFollower.classList.add('active');
            isVisible = true;
        }
    }

    // Mouse leave handler
    function handleMouseLeave() {
        cursorFollower.classList.remove('active');
        cursorFollower.classList.remove('hide-on-hover');
        isVisible = false;
    }

    // Smooth animation loop
    function animateFollower() {
        // Smooth following with easing
        const speed = 0.15;
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation loop
    animateFollower();
    
    // Hide cursor follower when hovering over clickable elements
    const clickableElements = document.querySelectorAll('a, button, input, textarea, select, [onclick], [role="button"], .btn, .nav-link, .social-link, .project-link, .theme-toggle, .profile-circle');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('hide-on-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('hide-on-hover');
        });
    });
    
    // Also detect hover on interactive elements that might be added dynamically
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        const isClickable = target.tagName === 'A' || 
                          target.tagName === 'BUTTON' || 
                          target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.tagName === 'SELECT' ||
                          target.getAttribute('onclick') ||
                          target.getAttribute('role') === 'button' ||
                          target.classList.contains('btn') ||
                          target.classList.contains('nav-link') ||
                          target.classList.contains('social-link') ||
                          target.classList.contains('project-link') ||
                          target.classList.contains('theme-toggle') ||
                          target.classList.contains('social-contact-link') ||
                          target.classList.contains('project-image-link') ||
                          target.classList.contains('wallet-link') ||
                          target.classList.contains('copy-btn') ||
                          target.classList.contains('profile-circle') ||
                          target.classList.contains('profile-img') ||
                          target.closest('a') ||
                          target.closest('button') ||
                          target.closest('[onclick]') ||
                          target.closest('[role="button"]') ||
                          target.closest('.btn') ||
                          target.closest('.nav-link') ||
                          target.closest('.social-link') ||
                          target.closest('.project-link') ||
                          target.closest('.theme-toggle') ||
                          target.closest('.social-contact-link') ||
                          target.closest('.project-image-link') ||
                          target.closest('.wallet-link') ||
                          target.closest('.copy-btn') ||
                          target.closest('.profile-circle');
        
        if (isClickable) {
            cursorFollower.classList.add('hide-on-hover');
        } else {
            cursorFollower.classList.remove('hide-on-hover');
        }
    });
});