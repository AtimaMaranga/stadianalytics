// Main JavaScript for Stadi Research Website

$(document).ready(function() {
    
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