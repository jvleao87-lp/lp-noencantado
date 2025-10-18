/**
 * No Encantado - Main JavaScript
 * Handles all the interactive elements of the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    
    // Add padding to body to account for fixed navbar
    document.body.style.paddingTop = `${navbarHeight}px`;
    
    // Handle navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled', 'shadow-sm');
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.classList.remove('navbar-scrolled', 'shadow-sm');
            navbar.style.padding = '1rem 0';
        }
    }
    
    // Run once on load
    handleScroll();
    
    // Run on scroll
    window.addEventListener('scroll', handleScroll);
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuToggle = document.getElementById('navbarNav');
    let bsCollapse;
    
    if (menuToggle) {
        bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.classList.contains('show')) {
                    bsCollapse.toggle();
                }
            });
        });
    }

    // Smooth scrolling for anchor links with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip if it's a button with data-bs-toggle
        if (anchor.getAttribute('data-bs-toggle')) return;
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('http')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = navbarHeight + 20; // 20px extra space
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    // Initialize elements with animation
    document.querySelectorAll('.fade-in-up').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    document.querySelectorAll('.fade-in-left').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    document.querySelectorAll('.fade-in-right').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Run once on load
    setTimeout(animateOnScroll, 500);
    
    // Run on scroll with debounce
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(animateOnScroll, 50);
    }, false);

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus'
        });
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'focus',
            container: 'body'
        });
    });
    
    // Gallery modal functionality
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        const modalImage = galleryModal.querySelector('.modal-body img');
        const modalTitle = galleryModal.querySelector('.modal-title');
        const modalDescription = galleryModal.querySelector('.modal-description');
        
        galleryModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const imageSrc = button.getAttribute('data-bs-image');
            const title = button.getAttribute('data-bs-title');
            const description = button.getAttribute('data-bs-description');
            
            if (modalImage) modalImage.src = imageSrc || '';
            if (modalTitle) modalTitle.textContent = title || '';
            if (modalDescription) modalDescription.textContent = description || '';
        });
    }
    
    // Initialize AOS (Animate On Scroll) for elements with data-aos attributes
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Manual nav active management removed to avoid conflict with Bootstrap ScrollSpy

    // Back to top button removed by request – no floating arrow is injected
    
    // Preload images for better performance
    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                const image = new Image();
                image.src = src;
            }
        });
    }
    
    // Run preload after page load
    window.addEventListener('load', preloadImages);
});

// Form submission handler with validation
function handleFormSubmit(formId, successMessage = 'Mensagem enviada com sucesso!') {
    const form = document.getElementById(formId);
    
    if (form) {
        // Add Bootstrap validation
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                
                // Simulate form submission (replace with actual AJAX call)
                setTimeout(() => {
                    // Show success message
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.innerHTML = `
                        <div class="d-flex align-items-center">
                            <i class="fas fa-check-circle me-2"></i>
                            <span>${successMessage}</span>
                        </div>
                    `;
                    form.parentNode.insertBefore(alertDiv, form.nextSibling);
                    
                    // Reset form
                    form.reset();
                    form.classList.remove('was-validated');
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    // Remove alert after 5 seconds
                    setTimeout(() => {
                        alertDiv.style.opacity = '0';
                        setTimeout(() => {
                            alertDiv.remove();
                        }, 300);
                    }, 5000);
                }, 1000);
            }
            
            form.classList.add('was-validated');
        }, false);
    }
}

// Initialize form handling
document.addEventListener('DOMContentLoaded', function() {
    // Contact form
    handleFormSubmit('contactForm', 'Mensagem enviada com sucesso! Em breve entraremos em contato.');
    
    // Order form (if exists)
    handleFormSubmit('orderForm', 'Pedido enviado com sucesso! Em breve entraremos em contato para confirmar os detalhes.');
});

// Image lazy loading with intersection observer
function initLazyLoading() {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    
                    // Handle srcset if present
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                    }
                    
                    // Handle src
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    
                    // Handle background image
                    if (lazyImage.dataset.bg) {
                        lazyImage.style.backgroundImage = `url('${lazyImage.dataset.bg}')`;
                    }
                    
                    // Remove lazy class and stop observing
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                    
                    // Add fade-in effect
                    lazyImage.style.opacity = '0';
                    lazyImage.style.transition = 'opacity 0.5s ease-in';
                    
                    // Force reflow
                    void lazyImage.offsetWidth;
                    
                    // Fade in
                    lazyImage.style.opacity = '1';
                }
            });
        }, {
            rootMargin: '200px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        let active = false;
        
        const lazyLoad = function() {
            if (active === false) {
                active = true;
                
                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && 
                             lazyImage.getBoundingClientRect().bottom >= 0) &&
                            getComputedStyle(lazyImage).display !== 'none') {
                            
                            if (lazyImage.dataset.src) lazyImage.src = lazyImage.dataset.src;
                            if (lazyImage.dataset.srcset) lazyImage.srcset = lazyImage.dataset.srcset;
                            if (lazyImage.dataset.bg) {
                                lazyImage.style.backgroundImage = `url('${lazyImage.dataset.bg}')`;
                            }
                            
                            lazyImage.classList.remove('lazy');
                            
                            if (!lazyImages.length) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });
                    
                    active = false;
                }, 200);
            }
        };
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
        
        // Initial check
        lazyLoad();
    }
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    
    // Add loading="lazy" to images that don't have it and are below the fold
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (img.getBoundingClientRect().top > window.innerHeight) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
});

// Helper function to debounce function calls
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add smooth scroll behavior for anchor links with offset
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('http')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Initialize smooth scroll
document.addEventListener('DOMContentLoaded', smoothScroll);

// Initialize Swiper for products
const productsSwiper = new Swiper('.products-swiper', {
    // Optional parameters
    loop: true,
    spaceBetween: 20,
    slidesPerView: 1,
    centeredSlides: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        // when window width is >= 576px
        576: {
            slidesPerView: 1.2,
        },
        // when window width is >= 768px
        768: {
            slidesPerView: 1.5,
        },
        // when window width is >= 992px
        992: {
            slidesPerView: 1,
            allowTouchMove: false,
            enabled: false
        }
    }
});
