/**
 * ALEX MERCER PORTFOLIO - MAIN JAVASCRIPT
 * Includes: Mouse glow, 3D tilt cards, typing effect, scroll reveals,
 * active nav tracking, hamburger menu, form validation, and back to top.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. MOUSE-FOLLOW GLOW EFFECT
    // ==========================================================================
    const mouseGlow = document.getElementById('mouse-glow');
    
    document.addEventListener('mousemove', (e) => {
        // Update CSS variables for radial gradient centering
        const x = e.clientX;
        const y = e.clientY;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    });


    // ==========================================================================
    // 2. PARALLAX BACKGROUND EFFECT
    // ==========================================================================
    const orbs = document.querySelectorAll('.orb');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.15;
            // Shift the vertical translate according to scroll
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });


    // ==========================================================================
    // 3. STICKY NAVBAR & BACK-TO-TOP TRIGGER
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back To Top Visibility
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    // Back To Top Action
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ==========================================================================
    // 4. MOBILE HAMBURGER MENU
    // ==========================================================================
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle Active Class
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close Mobile Menu on NavLink Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // ==========================================================================
    // 5. HERO TYPING ANIMATION
    // ==========================================================================
    const typingTextElement = document.getElementById('typing-text');
    const roles = ["Frontend Developer.", "CSE Student.", "UI/UX Enthusiast.", "Problem Solver."];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Remove character
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster delete speed
        } else {
            // Add character
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Typing speed
        }
        
        // State Transitions
        if (!isDeleting && charIndex === currentRole.length) {
            // Full role is typed, pause before deletion
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next role
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next role
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start Typing Effect
    if (typingTextElement) {
        setTimeout(typeEffect, 1000);
    }


    // ==========================================================================
    // 6. INTERSECTION OBSERVER - SECTION REVEALS & ACTIVE LINK TRACKING
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    
    // Section reveal threshold & animation triggers
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the skills section, animate progress bars
                if (entry.target.classList.contains('skills')) {
                    animateSkills();
                }
                
                // Once revealed, we can unobserve if we want static fade-ins
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null, // Viewport
        threshold: 0.15, // Trigger when 15% element is visible
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Make sure Skills and Section cards observe correctly
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        revealObserver.observe(skillsSection);
    }

    // Animate skill progress bars
    function animateSkills() {
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            bar.style.width = percentage;
        });
    }

    // Active Nav Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    
    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        threshold: 0.35, // Trigger when 35% of the section is visible
        rootMargin: "-20% 0px -40% 0px"
    });

    sections.forEach(section => {
        activeNavObserver.observe(section);
    });


    // ==========================================================================
    // 7. 3D HOVER TILT FOR PROJECT CARDS
    // ==========================================================================
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const innerCard = card.querySelector('.project-card-inner');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate mouse position relative to card boundaries
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalize relative positions to -0.5 to 0.5 range
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;
            
            // Calculate tilt degrees (Max 15 degree tilt)
            const tiltX = percentY * 15;
            const tiltY = percentX * -15;
            
            // Apply 3D rotation transform
            innerCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transition and return card back to flat state smoothly
            innerCard.style.transition = 'transform 0.5s ease';
            innerCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0deg)';
        });
        
        card.addEventListener('mouseenter', () => {
            // Clear smooth transition to ensure responsive real-time tilt tracking
            innerCard.style.transition = 'none';
        });
    });


    // ==========================================================================
    // 8. CONTACT FORM VALIDATION & MOCK SUBMISSION
    // ==========================================================================
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    const fields = [
        { id: 'name', errorId: 'name-error', validate: (val) => val.trim().length > 0 },
        { id: 'email', errorId: 'email-error', validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
        { id: 'subject', errorId: 'subject-error', validate: (val) => val.trim().length > 0 },
        { id: 'message', errorId: 'message-error', validate: (val) => val.trim().length > 0 }
    ];

    // Real-Time Field Blur Validation
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        
        input.addEventListener('blur', () => {
            validateField(field);
        });
        
        // Remove error outline instantly on typing
        input.addEventListener('input', () => {
            const parent = input.parentElement;
            if (parent.classList.contains('error')) {
                validateField(field);
            }
        });
    });

    function validateField(field) {
        const input = document.getElementById(field.id);
        const parent = input.parentElement;
        const value = input.value;
        
        if (field.validate(value)) {
            parent.classList.remove('error');
            parent.classList.add('success');
            return true;
        } else {
            parent.classList.remove('success');
            parent.classList.add('error');
            return false;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validate all fields on submit
        fields.forEach(field => {
            const isValid = validateField(field);
            if (!isValid) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Simulated Success Output
            formStatus.textContent = "Sending message...";
            formStatus.className = "form-status-msg";
            
            setTimeout(() => {
                formStatus.textContent = "Thank you! Your message has been sent successfully.";
                formStatus.className = "form-status-msg success";
                
                // Reset Form
                form.reset();
                
                // Clear success borders
                fields.forEach(field => {
                    const parent = document.getElementById(field.id).parentElement;
                    parent.classList.remove('success', 'error');
                });
                
                // Clear success alert after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = "";
                    formStatus.className = "form-status-msg";
                }, 5000);
                
            }, 1500);
        } else {
            // Form is invalid
            formStatus.textContent = "Please correct the errors in the fields above.";
            formStatus.className = "form-status-msg error";
        }
    });

    // Set Copyright Year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
