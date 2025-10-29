// Main JavaScript for Stadi Research Website

$(document).ready(function() {

    // Hero Slider Functionality
    let currentSlide = 1;
    const totalSlides = 4;
    let autoSlideInterval;
    const slideDelay = 5000; // 5 seconds between slides

    function goToSlide(slideNumber) {
        // Remove active class from all slides and dots
        $('.hero-slide').removeClass('active');
        $('.hero-dot').removeClass('active');

        // Add active class to current slide and dot
        $(`.hero-slide[data-slide="${slideNumber}"]`).addClass('active');
        $(`.hero-dot[data-slide="${slideNumber}"]`).addClass('active');

        currentSlide = slideNumber;
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next > totalSlides) {
            next = 1;
        }
        goToSlide(next);
    }

    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 1) {
            prev = totalSlides;
        }
        goToSlide(prev);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, slideDelay);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Navigation arrow click handlers
    $('.hero-nav-next').on('click', function() {
        nextSlide();
        resetAutoSlide();
    });

    $('.hero-nav-prev').on('click', function() {
        prevSlide();
        resetAutoSlide();
    });

    // Dot navigation click handler
    $('.hero-dot').on('click', function() {
        const slideNumber = parseInt($(this).attr('data-slide'));
        goToSlide(slideNumber);
        resetAutoSlide();
    });

    // Pause on hover
    $('.hero-slider-container').on('mouseenter', function() {
        stopAutoSlide();
    }).on('mouseleave', function() {
        startAutoSlide();
    });

    // Keyboard navigation
    $(document).on('keydown', function(e) {
        if ($('.hero-slider').length) {
            if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlide();
            }
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    $('.hero-slider-container').on('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    $('.hero-slider-container').on('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swiped left
            nextSlide();
            resetAutoSlide();
        }
        if (touchEndX > touchStartX + 50) {
            // Swiped right
            prevSlide();
            resetAutoSlide();
        }
    }

    // Start the auto-slide on page load
    startAutoSlide();

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
    
    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });
    
    // Animation on scroll
    function animateOnScroll() {
        $('.animate-on-scroll').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate');
            }
        });
    }
    
    $(window).on('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    
    // Counter animation for trust indicators
    function animateCounters() {
        $('.counter').each(function() {
            var $this = $(this);
            var countTo = $this.attr('data-count');
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }
    
    // Trigger counter animation when in viewport
    $(window).scroll(function() {
        $('.trust-section').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom && !$(this).hasClass('animated')) {
                $(this).addClass('animated');
                animateCounters();
            }
        });
    });
    
    // Contact form handling
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        var formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showAlert('Please fill in all required fields.', 'danger');
            return;
        }
        
        // Email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('Please enter a valid email address.', 'danger');
            return;
        }
        
        // Show loading state
        var $submitBtn = $(this).find('button[type="submit"]');
        var originalText = $submitBtn.text();
        $submitBtn.text('Sending...').prop('disabled', true);
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(function() {
            $submitBtn.text(originalText).prop('disabled', false);
            showAlert('Thank you! Your message has been sent successfully.', 'success');
            $('#contactForm')[0].reset();
        }, 2000);
    });
    
    // Alert system
    function showAlert(message, type) {
        var alertHtml = '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
                       message +
                       '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                       '</div>';
        
        $('#alerts').html(alertHtml);
        
        // Auto dismiss after 5 seconds
        setTimeout(function() {
            $('.alert').alert('close');
        }, 5000);
    }
    
    // Back to top button
    var backToTop = $('<button id="backToTop" class="btn btn-primary position-fixed" style="bottom: 20px; right: 20px; z-index: 1000; border-radius: 50%; width: 50px; height: 50px; display: none;"><i class="fas fa-arrow-up"></i></button>');
    $('body').append(backToTop);
    
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            $('#backToTop').fadeIn();
        } else {
            $('#backToTop').fadeOut();
        }
    });
    
    $('#backToTop').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
    
    // Testimonial carousel (if using)
    $('.testimonial-carousel').on('slide.bs.carousel', function() {
        // Add any carousel-specific logic here
    });
    
    // Service filter (for portfolio page)
    $('.filter-btn').on('click', function() {
        var filterValue = $(this).attr('data-filter');
        
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        if (filterValue == 'all') {
            $('.portfolio-item').fadeIn();
        } else {
            $('.portfolio-item').hide();
            $('.portfolio-item[data-category="' + filterValue + '"]').fadeIn();
        }
    });
    
    // Loading animation for page elements
    $('.loading').each(function(index) {
        $(this).delay(index * 100).queue(function() {
            $(this).addClass('animate').dequeue();
        });
    });
    
    // Mobile menu improvements
    $('.navbar-toggler').on('click', function() {
        $('.navbar-collapse').toggleClass('show');
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click', function(event) {
        var clickover = $(event.target);
        var navbar = $('.navbar-collapse');
        var opened = navbar.hasClass('show');
        
        if (opened && !clickover.hasClass('navbar-toggler') && clickover.parents('.navbar').length == 0) {
            navbar.collapse('hide');
        }
    });
    
    // Add loading class to elements that should animate
    $('.service-card, .pathway-card, .testimonial-card, .portfolio-item').addClass('loading');
    
});

// Additional utility functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Intersection Observer for better performance (modern browsers)
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements that should animate
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}
// ==== MODERN NAVIGATION & FOOTER ENHANCEMENTS ====

$(document).ready(function() {
    
    // Scroll Progress Bar
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        $('.scroll-progress-bar').css('width', scrolled + '%');
    }
    
    $(window).on('scroll', updateScrollProgress);
    
    // Enhanced Navbar Scroll Effect
    function handleNavbarScroll() {
        const scrollTop = $(window).scrollTop();
        
        if (scrollTop > 100) {
            $('#mainNav').addClass('scrolled');
        } else {
            $('#mainNav').removeClass('scrolled');
        }
    }
    
    $(window).on('scroll', handleNavbarScroll);
    
    // Enhanced Back to Top Button
    function handleBackToTopButton() {
        const scrollTop = $(window).scrollTop();
        
        if (scrollTop > 500) {
            $('.back-to-top').addClass('show');
        } else {
            $('.back-to-top').removeClass('show');
        }
    }
    
    $(window).on('scroll', handleBackToTopButton);
    
    $('.back-to-top').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800, 'swing');
    });
    
    // Newsletter Form Handler
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val();
        const $button = $(this).find('button[type="submit"]');
        const originalHtml = $button.html();
        
        // Basic email validation
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        $button.html('<i class="bi bi-hourglass-split me-2"></i>Subscribing...').prop('disabled', true);
        
        // Simulate API call (replace with actual endpoint)
        setTimeout(function() {
            $button.html(originalHtml).prop('disabled', false);
            showNotification('Thank you for subscribing! Check your inbox for confirmation.', 'success');
            $('.newsletter-form')[0].reset();
        }, 1500);
    });
    
    // Notification System
    function showNotification(message, type) {
        const bgColor = type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                        type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                        'linear-gradient(135deg, #8021A0 0%, #0017F5 100%)';
        
        const notification = $(`
            <div class="custom-notification" style="
                position: fixed;
                top: 100px;
                right: 30px;
                background: ${bgColor};
                color: white;
                padding: 1.25rem 1.5rem;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
                display: flex;
                align-items: center;
                gap: 1rem;
            ">
                <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-x-circle' : 'bi-info-circle'}" style="font-size: 1.5rem;"></i>
                <span>${message}</span>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 4000);
    }
    
    // Smooth Dropdown Animation
    $('.dropdown-menu-modern').on('show.bs.dropdown', function() {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(-10px)'
        });
        $(this).animate({
            opacity: 1
        }, 200);
        $(this).css('transform', 'translateY(0)');
    });
    
    // Parallax Effect for Hero Section
    $(window).on('scroll', function() {
        const scrolled = $(window).scrollTop();
        $('.hero-slide-bg').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
    });
    
    // Lazy Loading for Images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Service Cards Tilt Effect (subtle 3D effect on hover)
    $('.service-item, .training-card, .case-study-card').on('mousemove', function(e) {
        const card = $(this);
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.css({
            'transform': `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
        });
    });
    
    $('.service-item, .training-card, .case-study-card').on('mouseleave', function() {
        $(this).css({
            'transform': 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
        });
    });
    
    // Typing Effect for Hero Titles (if desired)
    function typeWriter(element, text, speed = 50) {
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
    
    // Count-up Animation for Statistics
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Trigger count animation when stats come into view
    if ('IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.dataset.count || entry.target.textContent);
                    animateValue(entry.target, 0, target, 2000);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.stat-number, .footer-stat-item .stat-number').forEach(stat => {
            statsObserver.observe(stat);
        });
    }
    
    // Prevent default form submission for newsletter
    $('form').on('submit', function(e) {
        if ($(this).hasClass('newsletter-form')) {
            return; // Already handled above
        }
    });
    
    // Enhanced Smooth Scroll with offset for fixed navbar
    $('a[href^="#"]').not('[href="#"]').not('[href="#0"]').on('click', function(event) {
        if (this.hash !== '') {
            event.preventDefault();
            
            const hash = this.hash;
            const target = $(hash);
            
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 800, function() {
                    if (history.pushState) {
                        history.pushState(null, null, hash);
                    }
                });
            }
        }
    });
    
    // Mobile Menu Enhancements
    $('.navbar-toggler').on('click', function() {
        $(this).toggleClass('active');
    });
    
    // Close mobile menu when clicking on a link
    $('.navbar-nav .nav-link').on('click', function() {
        if ($(window).width() < 992) {
            $('.navbar-collapse').collapse('hide');
            $('.navbar-toggler').removeClass('active');
        }
    });
    
    // Add active class to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.navbar-nav .nav-link').each(function() {
        const href = $(this).attr('href');
        if (href && href.includes(currentPage)) {
            $(this).addClass('active');
        }
    });
    
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .custom-notification {
        animation: slideInRight 0.3s ease;
    }
`;
document.head.appendChild(style);

// ========================================
// CONTACT PAGE SPECIFIC JAVASCRIPT
// ========================================

$(document).ready(function() {
    // Contact Form Handling
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        // Get form values
        const formData = {
            fullName: $('#fullName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            organization: $('#organization').val(),
            service: $('#service').val(),
            subject: $('#subject').val(),
            message: $('#message').val(),
            budget: $('#budget').val(),
            timeline: $('#timeline').val(),
            newsletter: $('#newsletter').is(':checked')
        };

        // Basic validation
        if (!formData.fullName || !formData.email || !formData.message || !formData.service || !formData.timeline) {
            showContactAlert('Please fill in all required fields.', 'danger');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showContactAlert('Please enter a valid email address.', 'danger');
            return;
        }

        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalBtnText = submitBtn.html();
        submitBtn.prop('disabled', true).html('<i class="bi bi-hourglass-split me-2"></i>Sending...');

        // Simulate form submission (replace with actual AJAX call to your backend)
        setTimeout(function() {
            // Success
            showContactAlert(
                'Thank you for reaching out! We\'ve received your message and will respond within 24 hours.',
                'success'
            );

            // Reset form
            $('#contactForm')[0].reset();

            // Reset button
            submitBtn.prop('disabled', false).html(originalBtnText);

            // Show additional success message
            showNotification('Message sent successfully!', 'success');

        }, 2000);

        // In production, replace the setTimeout with actual AJAX call:
        /*
        $.ajax({
            url: '/api/contact',
            method: 'POST',
            data: formData,
            success: function(response) {
                showContactAlert(
                    'Thank you for reaching out! We\'ve received your message and will respond within 24 hours.',
                    'success'
                );
                $('#contactForm')[0].reset();
                submitBtn.prop('disabled', false).html(originalBtnText);
            },
            error: function() {
                showContactAlert('Sorry, there was an error sending your message. Please try again or contact us directly.', 'danger');
                submitBtn.prop('disabled', false).html(originalBtnText);
            }
        });
        */
    });

    // Show alert in contact form
    function showContactAlert(message, type) {
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        $('#contactFormAlerts').html(alertHTML);

        // Scroll to alert
        $('html, body').animate({
            scrollTop: $('#contactFormAlerts').offset().top - 120
        }, 400);

        // Auto-dismiss success alerts after 10 seconds
        if (type === 'success') {
            setTimeout(function() {
                $('#contactFormAlerts .alert').fadeOut(function() {
                    $(this).remove();
                });
            }, 10000);
        }
    }

    // Smooth scroll to form when clicking "scroll-to-form" links
    $('.scroll-to-form').on('click', function(e) {
        e.preventDefault();
        const targetId = $(this).attr('href');
        const target = $(targetId);

        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);

            // Focus on first input
            setTimeout(function() {
                target.find('input:first').focus();
            }, 900);
        }
    });

    // Form field animations - add focus effect
    $('.form-control-modern, .form-select-modern').on('focus', function() {
        $(this).closest('.form-group-modern').addClass('focused');
    }).on('blur', function() {
        $(this).closest('.form-group-modern').removeClass('focused');
    });

    // Character counter for message textarea
    const messageField = $('#message');
    if (messageField.length) {
        const maxLength = 1000;

        // Add counter element
        messageField.after('<div class="char-counter text-muted text-end mt-1"><span class="current">0</span> / ' + maxLength + ' characters</div>');

        messageField.on('input', function() {
            const currentLength = $(this).val().length;
            $(this).siblings('.char-counter').find('.current').text(currentLength);

            if (currentLength > maxLength * 0.9) {
                $(this).siblings('.char-counter').addClass('text-warning');
            } else {
                $(this).siblings('.char-counter').removeClass('text-warning');
            }

            if (currentLength >= maxLength) {
                $(this).siblings('.char-counter').addClass('text-danger').removeClass('text-warning');
            } else {
                $(this).siblings('.char-counter').removeClass('text-danger');
            }
        });
    }

    // Auto-fill form from URL parameters (useful for campaigns)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('service')) {
        $('#service').val(urlParams.get('service'));
    }
    if (urlParams.has('email')) {
        $('#email').val(urlParams.get('email'));
    }

    // Service field change - show relevant information
    $('#service').on('change', function() {
        const selectedService = $(this).val();
        let infoMessage = '';

        switch(selectedService) {
            case 'academic-research':
            case 'thesis-dissertation':
                infoMessage = 'Great choice! Our academic research support includes methodology, data analysis, and writing assistance.';
                break;
            case 'data-analytics':
            case 'statistical-analysis':
                infoMessage = 'Excellent! We work with SPSS, R, Python, Stata, and other advanced analytical tools.';
                break;
            case 'training':
                infoMessage = 'Perfect! We offer hands-on training programs with real-world examples and certification.';
                break;
            case 'corporate-research':
                infoMessage = 'Great! Our corporate research services include market analysis, competitive intelligence, and strategic insights.';
                break;
        }

        if (infoMessage) {
            // Show a subtle info message
            if (!$('#service-info').length) {
                $('#service').closest('.form-group-modern').after(
                    '<div id="service-info" class="alert alert-info mt-2 py-2"><i class="bi bi-info-circle me-2"></i><span class="service-info-text"></span></div>'
                );
            }
            $('#service-info .service-info-text').text(infoMessage);
            $('#service-info').slideDown();
        } else {
            $('#service-info').slideUp();
        }
    });

    // Timeline field change - show urgency notice for urgent timelines
    $('#timeline').on('change', function() {
        const timeline = $(this).val();

        if (timeline === 'urgent') {
            if (!$('#urgency-notice').length) {
                $(this).closest('.form-group-modern').after(
                    '<div id="urgency-notice" class="alert alert-warning mt-2 py-2"><i class="bi bi-exclamation-triangle me-2"></i>For urgent projects, we recommend calling us directly at <strong>' + ($('#phone').attr('placeholder') || '+254 XXX XXX XXX') + '</strong> for immediate assistance.</div>'
                );
            }
        } else {
            $('#urgency-notice').slideUp(function() {
                $(this).remove();
            });
        }
    });

    // Phone number formatting (basic Kenya format)
    $('#phone').on('input', function() {
        let value = $(this).val().replace(/\D/g, ''); // Remove non-digits

        // Basic formatting for display
        if (value.length > 0) {
            if (value.startsWith('254')) {
                // Format as +254 XXX XXX XXX
                if (value.length > 3) {
                    value = '+254 ' + value.substring(3);
                }
            } else if (value.startsWith('0')) {
                // Format as 0XXX XXX XXX
                // Keep as is
            }
        }
    });

    // Quick action buttons - track clicks (for analytics)
    $('.quick-action-btn, .method-link').on('click', function() {
        const method = $(this).hasClass('whatsapp') ? 'WhatsApp' :
                      $(this).hasClass('phone') ? 'Phone' :
                      $(this).hasClass('email') ? 'Email' : 'Other';

        console.log('Contact method clicked:', method);

        // In production, send this to analytics
        // gtag('event', 'contact_method_click', { method: method });
    });
});

// Add character counter styles
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    .form-group-modern.focused .form-label-modern {
        color: var(--primary-color);
    }

    .char-counter {
        font-size: 0.85rem;
        transition: color 0.3s ease;
    }

    #service-info, #urgency-notice {
        font-size: 0.95rem;
        border-radius: 10px;
        border: none;
        display: none;
    }

    .alert-info {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
        color: #0891b2;
    }

    .alert-warning {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%);
        color: #d97706;
    }

    #contactFormAlerts .alert {
        border-radius: 15px;
        padding: 1.25rem;
        border: none;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .alert-success {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
        color: #059669;
    }

    .alert-danger {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
        color: #dc2626;
    }
`;
document.head.appendChild(contactStyles);

