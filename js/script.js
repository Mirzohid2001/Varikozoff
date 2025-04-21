document.addEventListener('DOMContentLoaded', function() {
    // Language Switcher
    const langUz = document.getElementById('langUz');
    const langRu = document.getElementById('langRu');
    const uzElements = document.querySelectorAll('.lang-uz');
    const ruElements = document.querySelectorAll('.lang-ru');

    // Set default language
    showLanguage('uz');

    // Language buttons event listeners
    langUz.addEventListener('click', function() {
        showLanguage('uz');
    });

    langRu.addEventListener('click', function() {
        showLanguage('ru');
    });

    // Language switch function
    function showLanguage(lang) {
        if (lang === 'uz') {
            uzElements.forEach(el => el.style.display = 'inline-block');
            ruElements.forEach(el => el.style.display = 'none');
            langUz.classList.add('active');
            langRu.classList.remove('active');
        } else {
            uzElements.forEach(el => el.style.display = 'none');
            ruElements.forEach(el => el.style.display = 'inline-block');
            langRu.classList.add('active');
            langUz.classList.remove('active');
        }
    }

    // Enhanced Service Cards Interaction
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            
            // Add shine effect animation
            const serviceImage = this.querySelector('.service-image');
            if (serviceImage && !serviceImage.classList.contains('shine')) {
                serviceImage.classList.add('shine');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            // Keep the shine class to allow the animation to finish naturally
        });
    });

    // Handle Modal Transitions - Fix freezing issue
    const serviceModals = document.querySelectorAll('.service-modal');
    serviceModals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            // Clear any transform styles that might be lingering
            serviceCards.forEach(card => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
            
            // Refresh language display when a modal is closed
            if (langUz.classList.contains('active')) {
                showLanguage('uz');
            } else {
                showLanguage('ru');
            }
            
            // Remove any backdrop elements that might be stuck
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.classList.remove('show');
                setTimeout(() => {
                    backdrop.remove();
                }, 300);
            });
            
            // Ensure body scroll is restored
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    });

    // Add appointment button in service modals
    const appointmentButtonsInModals = document.querySelectorAll('.service-modal .modal-footer .btn-primary');
    appointmentButtonsInModals.forEach(button => {
        button.addEventListener('click', function() {
            // Get the service name from the modal title
            const modal = this.closest('.modal');
            const serviceTitle = modal.querySelector('.modal-title').innerText.trim();
            
            // Set a timeout to update the comment field after the appointment modal is shown
            setTimeout(() => {
                const commentField = document.getElementById('comment');
                if (commentField) {
                    const isUzbekLanguage = langUz.classList.contains('active');
                    const servicePrefix = isUzbekLanguage ? 'Xizmat turi: ' : 'Тип услуги: ';
                    commentField.value = servicePrefix + serviceTitle;
                }
            }, 500);
            
            // Close the service modal before opening the appointment modal
            const serviceModal = bootstrap.Modal.getInstance(modal);
            if (serviceModal) {
                serviceModal.hide();
            }
        });
    });

    // Telegram bot settings - Replace with your actual bot token and chat ID
    const TELEGRAM_BOT_TOKEN = '6853813357:AAH0yTSFVB3gXTGDDZHJYQPqeqgmjrCL_aM'; // Replace with your bot token
    const TELEGRAM_CHAT_ID = '1051923866'; // Replace with your chat ID

    // Function to send message to Telegram
    async function sendToTelegram(message) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            
            if (data.ok) {
                return true;
            } else {
                console.error('Failed to send message to Telegram:', data);
                return false;
            }
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            return false;
        }
    }

    // Appointment Form Handling
    const appointmentForm = document.getElementById('appointmentForm');
    const submitBtn = document.querySelector('button[form="appointmentForm"]');
    
    async function handleFormSubmission() {
        // Show loading state
        const submitButton = document.querySelector('button[form="appointmentForm"]');
        const originalButtonText = submitButton.innerHTML;
        const loadingSpinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ';
        
        const isUzbekLanguage = langUz.classList.contains('active');
        submitButton.innerHTML = loadingSpinner + (isUzbekLanguage ? '<span>Yuborilmoqda...</span>' : '<span>Отправка...</span>');
        submitButton.disabled = true;
        
        // Get form values
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const comment = document.getElementById('comment').value;
        
        // Format message for Telegram
        const currentDate = new Date().toLocaleString();
        const message = `🆕 <b>Yangi mijoz</b>

<b>Ismi:</b> ${fullName}
<b>Telefon:</b> ${phoneNumber}
<b>Izoh:</b> ${comment || 'Berilmagan'}
<b>Sana:</b> ${currentDate}
<b>Manba:</b> Varikoz Off veb-sayt`;
        
        // Send to Telegram
        const success = await sendToTelegram(message);
        
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Create success/error message based on current language
        let resultMessage = '';
        if (success) {
            if (isUzbekLanguage) {
                resultMessage = 'Murojaatingiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.';
            } else {
                resultMessage = 'Ваша заявка принята! Мы свяжемся с вами в ближайшее время.';
            }
        } else {
            if (isUzbekLanguage) {
                resultMessage = 'Murojaatingizni yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring yoki telefon orqali bog\'laning.';
            } else {
                resultMessage = 'Произошла ошибка при отправке вашей заявки. Пожалуйста, попробуйте позже или свяжитесь по телефону.';
            }
        }
        
        // Show alert with animation
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container';
        alertContainer.innerHTML = `<div class="custom-alert ${success ? 'success' : 'error'} fade-in-up">${resultMessage}</div>`;
        document.body.appendChild(alertContainer);
        
        setTimeout(() => {
            alertContainer.querySelector('.custom-alert').classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(alertContainer);
            }, 500);
        }, 3000);
        
        // Reset form
        if (appointmentForm) {
            appointmentForm.reset();
        }
        
        // Close modal only if successful
        if (success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
            if (modal) {
                modal.hide();
            } else {
                // Fallback if modal instance not found
                const modalElement = document.getElementById('appointmentModal');
                if (modalElement) {
                    modalElement.classList.remove('show');
                    modalElement.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
                }
            }
        }
    }
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            // Check if the form is valid
            if (appointmentForm && appointmentForm.checkValidity()) {
                e.preventDefault();
                handleFormSubmission();
            }
        });
    }

    // Phone number formatting - simplified to just preserve user input
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Allow any input format - the validation was causing issues
            // Just ensure it starts with +998 if user didn't type it
            let value = e.target.value;
            if (value.length > 0 && !value.includes('+998') && !value.startsWith('998')) {
                // Only prepend once if needed
                if (!value.startsWith('+')) {
                    value = '+998 ' + value;
                    e.target.value = value;
                }
            }
        });
    }

    // Enhanced Scroll Animation Function
    function animateElementsOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 100; // Adjust this value to change when the animation triggers
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('animated');
                
                // Apply staggered animation to child elements if they exist
                const children = element.querySelectorAll('.stagger-item');
                if (children.length > 0) {
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, 100 * index);
                    });
                }
            }
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', animateElementsOnScroll);
    window.addEventListener('resize', animateElementsOnScroll);
    
    // Trigger animations on page load
    setTimeout(animateElementsOnScroll, 300);

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!button.classList.contains('ripple')) {
            button.classList.add('ripple');
        }
    });

    // Enhance header on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
        if (heroSection) {
            const scrollValue = window.scrollY;
            heroSection.style.backgroundPositionY = `${scrollValue * 0.5}px`;
        }
    });

    // Add float animation to specified elements
    const floatElements = document.querySelectorAll('.float-element');
    floatElements.forEach(element => {
        element.classList.add('float');
    });

    // Enhance service cards hover effect
    document.querySelectorAll('.service-content').forEach(content => {
        const title = content.querySelector('h4');
        const btn = content.querySelector('.btn-more');
        
        if (title && btn) {
            content.addEventListener('mouseenter', () => {
                title.style.color = '#045b4c';
                btn.style.backgroundColor = 'rgba(12, 138, 123, 0.1)';
            });
            
            content.addEventListener('mouseleave', () => {
                title.style.color = '';
                btn.style.backgroundColor = '';
            });
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add CSS class to the body when page is fully loaded
    window.addEventListener('load', function() {
        document.body.classList.add('page-loaded');
    });
}); 