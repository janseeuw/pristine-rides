// Pristine Rides NL - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Make sure header is sticky
    const header = document.querySelector('header');
    header.style.position = 'sticky';
    header.style.top = '0';
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation for contact form
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone (optional but must be valid if provided)
            if (phoneInput.value.trim() && !isValidPhone(phoneInput.value)) {
                showError(phoneInput, 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            }
            
            // If form is valid, submit it (or show success message for demo)
            if (isValid) {
                // For demo purposes, show success message instead of actual submission
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
                
                // In a real implementation, you would submit the form data to a server
                // contactForm.submit();
            }
        });
    }
    
    // Helper function to show error messages
    function showError(inputElement, message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        inputElement.parentNode.appendChild(errorMessage);
        inputElement.classList.add('error');
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to validate phone format
    function isValidPhone(phone) {
        // Basic phone validation (allows various formats)
        const phoneRegex = /^[\d\s\-\(\)\.+]+$/;
        return phoneRegex.test(phone) && phone.replace(/[\s\-\(\)\.+]/g, '').length >= 10;
    }
    
    // Gallery image lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            const imgAlt = this.querySelector('img').getAttribute('alt');
            
            // Create lightbox elements
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'lightbox-close';
            closeBtn.innerHTML = '&times;';
            
            // Append elements
            lightboxContent.appendChild(lightboxImg);
            lightboxContent.appendChild(closeBtn);
            lightbox.appendChild(lightboxContent);
            document.body.appendChild(lightbox);
            
            // Prevent scrolling when lightbox is open
            document.body.style.overflow = 'hidden';
            
            // Close lightbox on click
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target === closeBtn) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }
            });
        });
    });
    
    // Testimonial slider (if multiple testimonials)
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        let currentSlide = 0;
        const testimonials = testimonialSlider.querySelectorAll('.testimonial');
        const totalSlides = testimonials.length;
        
        if (totalSlides > 1) {
            // Create navigation dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.className = 'slider-dot';
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', function() {
                    goToSlide(i);
                });
                
                dotsContainer.appendChild(dot);
            }
            
            testimonialSlider.appendChild(dotsContainer);
            
            // Create prev/next buttons
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slider-btn prev-btn';
            prevBtn.innerHTML = '&lt;';
            prevBtn.addEventListener('click', prevSlide);
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'slider-btn next-btn';
            nextBtn.innerHTML = '&gt;';
            nextBtn.addEventListener('click', nextSlide);
            
            testimonialSlider.appendChild(prevBtn);
            testimonialSlider.appendChild(nextBtn);
            
            // Auto-advance slides every 5 seconds
            let slideInterval = setInterval(nextSlide, 5000);
            
            testimonialSlider.addEventListener('mouseenter', function() {
                clearInterval(slideInterval);
            });
            
            testimonialSlider.addEventListener('mouseleave', function() {
                slideInterval = setInterval(nextSlide, 5000);
            });
            
            // Show first slide
            showSlide(currentSlide);
        }
        
        function showSlide(index) {
            testimonials.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
            
            // Update dots
            const dots = testimonialSlider.querySelectorAll('.slider-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }
        
        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }
    }
});
