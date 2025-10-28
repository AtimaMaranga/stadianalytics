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

