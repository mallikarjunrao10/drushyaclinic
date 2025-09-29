document.addEventListener("DOMContentLoaded", function() {

    // Helper function for modal transitions (No changes needed)
    function applyModalTransition(element, open) {
        if (!element) return;

        const transitionHandler = function(event) {
            if (event.target !== element) return; 
            if (!open) {
                element.style.display = 'none';
            }
            element.removeEventListener('transitionend', transitionHandler);
        };
        
        element.removeEventListener('transitionend', transitionHandler);


        if (open) {
            element.style.display = 'flex';
            requestAnimationFrame(() => {
                element.classList.add('open');
            });
        } else {
            element.classList.remove('open');
            element.addEventListener('transitionend', transitionHandler);
            
            setTimeout(() => {
                if (!element.classList.contains('open') && element.style.display !== 'none') {
                    element.style.display = 'none';
                }
            }, 400); 
        }
    }

    // ===================================
    // 1. Mobile Navigation & Dropdown (No changes needed)
    // ===================================
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle > a');
    const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');

    function closeMobileDropdown() {
        if (mobileDropdownMenu) {
            mobileDropdownMenu.classList.remove('open');
            const icon = mobileDropdownToggle ? mobileDropdownToggle.querySelector('.fas') : null;
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    }

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            if (!mobileNav.classList.contains('open')) {
                closeMobileDropdown();
            }
        });
    }

    if (mobileDropdownToggle && mobileDropdownMenu) {
        mobileDropdownToggle.addEventListener('click', (event) => {
            event.preventDefault();
            mobileDropdownMenu.classList.toggle('open');

            const icon = mobileDropdownToggle.querySelector('.fas');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    }

    if (mobileNav) {
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // If it's not the dropdown toggle link, close the whole mobile menu
                if (!link.closest('.mobile-dropdown-toggle')) {
                    mobileNav.classList.remove('open');
                    closeMobileDropdown();
                }
            });
        });
    }

    // ===================================
    // 2. Services Tabs Functionality (No changes needed)
    // ===================================
    const serviceTabButtons = document.querySelectorAll('.service-tab-button');
    const serviceTabContents = document.querySelectorAll('.service-tab-content');

    serviceTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            serviceTabButtons.forEach(btn => btn.classList.remove('active'));
            serviceTabContents.forEach(content => content.classList.remove('active'));

            const contentElement = document.getElementById(targetTab + '-content');
            if (contentElement) {
                contentElement.classList.add('active');
            }
            button.classList.add('active');
        });
    });

    // ===================================
    // 3. Reusable Slider Function (for Gallery/Before&After) (No changes needed)
    // ===================================
    function initializeSlider(containerClass, wrapperClass, slideClass, prevBtnClass, nextBtnClass, autoPlay = false) {
        const sliderContainer = document.querySelector(containerClass);
        if (!sliderContainer) return;

        const sliderWrapper = sliderContainer.querySelector(wrapperClass);
        const prevBtn = sliderContainer.querySelector(prevBtnClass);
        const nextBtn = sliderContainer.querySelector(nextBtnClass);
        const slides = sliderContainer.querySelectorAll(slideClass);

        let currentIndex = 0;
        let slideInterval;

        function updateSlider() {
            if (slides.length === 0) return;

            // Recalculate dimensions on update
            const slideWidth = slides[0].offsetWidth;
            const computedStyle = getComputedStyle(sliderWrapper);
            const gap = parseInt(computedStyle.gap) || 0;

            let slidesToShow = 3;
            if (window.innerWidth <= 992 && window.innerWidth > 768) {
                slidesToShow = 2;
            } else if (window.innerWidth <= 768) {
                slidesToShow = 1;
            }

            const maxIndex = Math.max(0, slides.length - slidesToShow);

            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            const offset = -currentIndex * (slideWidth + gap);
            sliderWrapper.style.transform = `translateX(${offset}px)`;
        }

        function stopAutoPlay() {
            clearInterval(slideInterval);
        }

        function nextSlide() {
            const slidesToShow = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 992 ? 2 : 3);
            const maxIndex = Math.max(0, slides.length - slidesToShow);

            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateSlider();
        }

        function prevSlide() {
            const slidesToShow = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 992 ? 2 : 3);
            const maxIndex = Math.max(0, slides.length - slidesToShow);

            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex; // Loop to the end
            }
            updateSlider();
        }

        function startAutoPlay() {
            stopAutoPlay(); // Clear any existing interval
            if (autoPlay) {
                slideInterval = setInterval(nextSlide, 3000);
            }
        }


        if (nextBtn) nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
        });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
        });

        if (autoPlay) {
            startAutoPlay();
            sliderContainer.addEventListener('mouseenter', stopAutoPlay);
            sliderContainer.addEventListener('mouseleave', startAutoPlay);
        }

        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    function initializeTestimonialsSlider() {
        const wrapper = document.querySelector('.testimonials-slider-wrapper');
        const cards = document.querySelectorAll('.testimonial-card');

        if (!wrapper || cards.length === 0) return;

        // Clone cards for infinite loop effect
        cards.forEach(card => {
            wrapper.appendChild(card.cloneNode(true));
        });

        // Pause animation on hover
        wrapper.parentElement.addEventListener('mouseenter', () => {
            wrapper.style.animationPlayState = 'paused';
        });

        wrapper.parentElement.addEventListener('mouseleave', () => {
            wrapper.style.animationPlayState = 'running';
        });
    }

    // ===================================
    // 4. Image Lightbox/Modal Functionality (No changes needed)
    // ===================================
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    function initializeImageModal() {
        const closeBtn = document.getElementById('closeImageModal');
        // Select images from all sliders to enable modal opening
        const sliderImages = document.querySelectorAll('.slider-wrapper img, .photo-gallery-grid img'); // Added .photo-gallery-grid for gallery page

        if (!imageModal || !modalImage || !closeBtn) {
            // This is acceptable as imageModal is only on some pages
            // console.error("Image Modal elements are missing in HTML."); 
            return;
        }

        sliderImages.forEach(img => {
            img.addEventListener('click', function() {
                modalImage.src = this.src;
                applyModalTransition(imageModal, true);
            });
        });

        closeBtn.addEventListener('click', function() {
            applyModalTransition(imageModal, false);
        });

        imageModal.addEventListener('click', function(event) {
            if (event.target === imageModal) {
                applyModalTransition(imageModal, false);
            }
        });
    }


    // ===================================
    // 5. Initialization Calls (No changes needed)
    // ===================================
    initializeSlider(
        '.before-after-section .before-after-slider-container',
        '.before-after-slider-wrapper',
        '.before-after-slide',
        '.slider-btn.prev',
        '.slider-btn.next',
        true
    );
    initializeSlider(
        '.gallery-section .gallery-slider-container',
        '.gallery-slider-wrapper',
        '.gallery-slide',
        '.slider-btn.prev',
        '.slider-btn.next',
        true
    );
    initializeTestimonialsSlider();
    initializeImageModal();

    // ===================================
    // 6. Animated Counters on Scroll (No changes needed)
    // ===================================
    const highlightsSection = document.querySelector('.highlights-section');
    let hasAnimated = false;

    const animateCounters = () => {
        const counterCards = document.querySelectorAll('.highlight-card');
        counterCards.forEach(card => {
            const counter = card.querySelector('.highlight-number');
            const target = +card.getAttribute('data-count');
            if (!counter || isNaN(target)) return;

            let count = 0;
            // The increment determines the speed of the animation (lower denominator = faster)
            const increment = target / 100; 
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    // Use Math.ceil to ensure it counts up quickly
                    counter.innerText = Math.ceil(count).toLocaleString(); 
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
        });
        hasAnimated = true;
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the section is visible
    });

    if (highlightsSection) {
        counterObserver.observe(highlightsSection);
    }

    // ===================================
    // 7. Section Animations on Scroll (animate-on-scroll) (No changes needed)
    // ===================================
    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing after it's visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    sectionsToAnimate.forEach(section => {
        sectionObserver.observe(section);
    });

    // ===================================
    // 8. Modals (Appointment/Success/Loading) (No changes needed)
    // ===================================
    const modal = document.getElementById('appointmentModal');
    const successModal = document.getElementById('successModal');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const appointmentForm = document.getElementById('appointmentForm');
    
    // Selectors for all buttons that open/close any modal
    const openModalButtons = document.querySelectorAll('.open-modal-btn, .book-now-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-button, .close-modal-btn');
    
    // Map of modal IDs to elements
    const modalMap = {
        'appointmentModal': modal,
        'successModal': successModal,
        'loadingSpinner': loadingSpinner,
        'imageModal': imageModal // Re-using imageModal element here
    };

    function closeAllModals() {
        Object.values(modalMap).forEach(m => {
            if (m && m.classList.contains('open')) {
                applyModalTransition(m, false);
            }
        });
        if (appointmentForm) appointmentForm.reset();
        // Clear image src for the image modal
        if (modalImage) modalImage.src = '';
    }

    // Open Modal Logic: Use data-modal-target attribute if present, otherwise default to appointmentModal
    openModalButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = button.getAttribute('data-modal-target') || 'appointmentModal';
            const targetModal = modalMap[targetId];

            if (targetModal) {
                closeAllModals(); // Ensure all others are closed first
                applyModalTransition(targetModal, true);
            }
        });
    });

    // Close Modal Logic
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // Close on backdrop click for main modals
    window.addEventListener('click', (event) => {
        if (event.target === modal || event.target === successModal) {
            closeAllModals();
        }
    });

    // =============================================================
    // 9. Form Submission with Make.com Webhook (FIXED: Data collected before reset)
    // =============================================================
    const formMessageArea = document.getElementById('formMessageArea');
    
    // ⬇️ MAKE.COM WEBHOOK URL ⬇️ 
    const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/nbu86ti9ed3xkgyvc6yidlbl2opmmb9t'; 

    if (appointmentForm && loadingSpinner) {
        appointmentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // -----------------------------------------------------------
            // ➡️ URL VALIDATION CHECK ⬅️
            if (MAKE_WEBHOOK_URL.trim() === '' || !MAKE_WEBHOOK_URL.startsWith('http')) {
                if (formMessageArea) {
                    formMessageArea.textContent = 'Configuration Error: Webhook URL is missing or invalid. Please check script.js.';
                    formMessageArea.style.display = 'block';
                }
                console.error("MAKE_WEBHOOK_URL is not set or is invalid.");
                return; // STOP execution
            }
            // -----------------------------------------------------------

            // Hide previous error messages
            if (formMessageArea) formMessageArea.style.display = 'none';
            
            // --- 1. COLLECT FORM DATA (CRUCIAL FIX) ---
            // Collect form data and convert to JSON object
            const formData = new FormData(appointmentForm);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Manually ensure the Source field is present
            if (!data.Source) {
                data.Source = `Website Form - ${document.title || 'Unknown Page'}`;
            }
            // ⚠️ DEBUGGING: Log the final data to console before sending
            console.log('Data being sent to Make.com:', data);
            // -----------------------------------------------------------

            // --- 2. HIDE FORM MODAL AND SHOW SPINNER ---
            // Now that data is collected, it's safe to close/reset the form
            closeAllModals(); 
            applyModalTransition(loadingSpinner, true);
            

            try {
                // Send the data to your webhook
                const response = await fetch(MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    // CRITICAL: Set the header for JSON data
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(data),
                });

                // --- 3. HIDE SPINNER AND SHOW RESULT MODAL ---
                applyModalTransition(loadingSpinner, false); 
                
                setTimeout(() => {
                    if (response.ok) {
                        // --- SUCCESS! ---
                        console.log('Form data successfully sent to Make.com webhook.'); // Added log
                        applyModalTransition(successModal, true); // Show Success Modal
                        // Form was already reset in closeAllModals, but we keep the logic clean

                        // --- FIRE GOOGLE ADS CONVERSION TAG ---
                        if (typeof gtag === 'function') {
                            gtag('event', 'conversion', {
                                'send_to': 'AW-17109414290/GIpOCMPd4PMaEJLjs94_',
                                'value': 1.0,
                                'currency': 'INR'
                            });
                            console.log('Google Ads conversion event sent.');
                        } else {
                            console.warn('gtag function not found. Ensure Google Ads script is loaded.');
                        }
                    } else {
                        // --- FAILED (Server Error from Make.com) ---
                        applyModalTransition(modal, true); // Re-show form
                        if (formMessageArea) {
                            formMessageArea.textContent = 'Sorry, there was a problem processing your request. Please try again.';
                            formMessageArea.style.display = 'block';
                        }
                        console.error('Webhook response status was not OK:', response.status, response.statusText);
                    }
                }, 400); // 400ms delay to ensure spinner fade-out completes before showing next modal


            } catch (error) {
                // --- FAILED (Network Error) ---

                // Trigger the closing transition for the spinner
                applyModalTransition(loadingSpinner, false);
                
                // Wait for the spinner to fade out before re-showing the form
                setTimeout(() => {
                    applyModalTransition(modal, true); // Re-show form
                    if (formMessageArea) {
                        formMessageArea.textContent = 'An error occurred. Please check your connection or ensure the Webhook URL is correct.';
                        formMessageArea.style.display = 'block';
                    }
                    console.error('Form submission network error:', error);
                }, 400);
            }
        });
    }

    // ===================================
    // 10. Rotating Hero Text with Sliding Animation (No changes needed)
    // ===================================
    const rotatingText = document.getElementById('rotating-text');
    const services = [
        "Skin Hair Specialist",
        "Hair Transplant ",
        "Botox, Fillers",
        "Cosmetic Treatments"
    ];
    let serviceIndex = 0;

    function animateSlide() {
        if (!rotatingText) return;

        rotatingText.classList.add('slide-out');

        setTimeout(() => {
            serviceIndex = (serviceIndex + 1) % services.length;
            rotatingText.textContent = services[serviceIndex];

            rotatingText.classList.remove('slide-out');
            // This class is added momentarily to reset/start the CSS slide-in animation
            rotatingText.classList.add('slide-in-initial'); 

            setTimeout(() => {
                rotatingText.classList.remove('slide-in-initial');
            }, 50);
        }, 500); // 500ms delay matches the CSS transition time for 'slide-out'
    }

    if (rotatingText) {
        // Initial delay before first rotation
        setTimeout(() => {
            animateSlide();
            // Interval for subsequent rotations
            setInterval(animateSlide, 5000); 
        }, 5000); 
    }

    // ===================================
    // 11. Dynamic Year in Footer (No changes needed)
    // ===================================
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

});