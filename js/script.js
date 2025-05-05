document.addEventListener('DOMContentLoaded', function () {
    // Language Switcher
    const langUz = document.getElementById('langUz');
    const langRu = document.getElementById('langRu');
    const uzElements = document.querySelectorAll('.lang-uz');
    const ruElements = document.querySelectorAll('.lang-ru');

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

    showLanguage('uz');

    langUz?.addEventListener('click', () => showLanguage('uz'));
    langRu?.addEventListener('click', () => showLanguage('ru'));

    // Hover effect on service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            const serviceImage = this.querySelector('.service-image');
            if (serviceImage && !serviceImage.classList.contains('shine')) {
                serviceImage.classList.add('shine');
            }
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Modal fix
    const serviceModals = document.querySelectorAll('.service-modal');
    serviceModals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function () {
            serviceCards.forEach(card => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
            showLanguage(langUz.classList.contains('active') ? 'uz' : 'ru');
            document.querySelectorAll('.modal-backdrop').forEach(b => {
                b.classList.remove('show');
                setTimeout(() => b.remove(), 300);
            });
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    });

    // Telegram settings
    const TELEGRAM_BOT_TOKEN = '6853813357:AAH0yTSFVB3gXTGDDZHJYQPqeqgmjrCL_aM';
    const TELEGRAM_CHAT_ID = '1051923866';

    async function sendToTelegram(message) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
            });
            const data = await response.json();
            return data.ok;
        } catch (error) {
            console.error('Telegram error:', error);
            return false;
        }
    }

    // Form handler
    const appointmentForm = document.getElementById('appointmentForm');
    const submitBtn = document.querySelector('button[form="appointmentForm"]');

    async function handleFormSubmission() {
        const submitButton = submitBtn;
        const originalText = submitButton.innerHTML;
        const spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ';
        const isUz = langUz.classList.contains('active');

        submitButton.innerHTML = spinner + (isUz ? '<span>Yuborilmoqda...</span>' : '<span>Отправка...</span>');
        submitButton.disabled = true;

        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phoneNumber').value;
        const comment = document.getElementById('comment').value;
        const currentDate = new Date().toLocaleString();

        const message = `🆕 <b>Yangi mijoz</b>\n\n<b>Ismi:</b> ${fullName}\n<b>Telefon:</b> ${phone}\n<b>Izoh:</b> ${comment || 'Berilmagan'}\n<b>Sana:</b> ${currentDate}\n<b>Manba:</b> Varikoz Off veb-sayt`;

        const success = await sendToTelegram(message);
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        const alert = document.createElement('div');
        alert.className = 'alert-container';
        alert.innerHTML = `<div class="custom-alert ${success ? 'success' : 'error'} fade-in-up">
            ${isUz
                ? success ? 'Murojaatingiz qabul qilindi! Tez orada siz bilan bog‘lanamiz.' : 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.'
                : success ? 'Ваша заявка принята! Мы скоро свяжемся с вами.' : 'Произошла ошибка. Повторите попытку.'}
        </div>`;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.querySelector('.custom-alert').classList.add('fade-out');
            setTimeout(() => alert.remove(), 500);
        }, 3000);

        if (success && appointmentForm) {
            appointmentForm.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
            modal?.hide();
        }
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', e => {
            e.preventDefault();
            handleFormSubmission();
        });
    }
    submitBtn?.addEventListener('click', e => {
        if (appointmentForm.checkValidity()) {
            e.preventDefault();
            handleFormSubmission();
        }
    });

    // Phone input formatting
    const phoneInput = document.getElementById('phoneNumber');
    phoneInput?.addEventListener('input', function (e) {
        let val = e.target.value;
        if (val.length > 0 && !val.includes('+998') && !val.startsWith('998') && !val.startsWith('+')) {
            e.target.value = '+998 ' + val;
        }
    });

    // Animate on scroll
    function animateElementsOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const height = window.innerHeight;
        elements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < height - 100) {
                el.classList.add('animated');
                const children = el.querySelectorAll('.stagger-item');
                children.forEach((child, i) => {
                    setTimeout(() => child.classList.add('animated'), 100 * i);
                });
            }
        });
    }

    window.addEventListener('scroll', animateElementsOnScroll);
    window.addEventListener('resize', animateElementsOnScroll);
    setTimeout(animateElementsOnScroll, 300);

    // Ripple effect
    document.querySelectorAll('.btn').forEach(btn => btn.classList.add('ripple'));

    // Header scroll style
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) header.classList.add('header-scrolled');
        else header.classList.remove('header-scrolled');
    });

    // Parallax effect
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        if (hero) hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
    });

    // Floating elements
    document.querySelectorAll('.float-element').forEach(el => el.classList.add('float'));

    // Hover effect on service content
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

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navCollapse = document.querySelector('.navbar-collapse');
                if (navCollapse?.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navCollapse);
                    bsCollapse.hide();
                }
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
    });

    // Page loaded
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
    });

    // ✅ Video testimonials enhancements
    const testimonialVideos = document.querySelectorAll('.testimonial video');
    testimonialVideos.forEach(video => {
        video.autoplay = false;
        video.controls = true;
        video.setAttribute('preload', 'metadata');
        if (!video.hasAttribute('poster')) {
            video.setAttribute('poster', '/static/img/video-placeholder.jpg');
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        video.classList.add('testimonial-video-animated');
        observer.observe(video);
    });

    // Floating Telegram Inquiry
    const floatingInquiry = document.querySelector('.floating-telegram-inquiry');
    const closeInquiryBtn = document.querySelector('.close-inquiry');
    
    // Initialize variables to control visibility
    let inquiryVisible = true;
    let inquiryTimeout = null;
    
    // Show inquiry with animation after a short delay
    setTimeout(() => {
        if (floatingInquiry) {
            floatingInquiry.classList.add('animate__animated', 'animate__fadeInUp');
        }
    }, 2000);
    
    if (closeInquiryBtn && floatingInquiry) {
        closeInquiryBtn.addEventListener('click', function() {
            // Hide the inquiry with animation
            floatingInquiry.classList.add('animate__animated', 'animate__fadeOutDown');
            
            setTimeout(() => {
                floatingInquiry.classList.add('hidden');
                floatingInquiry.classList.remove('animate__animated', 'animate__fadeOutDown');
                inquiryVisible = false;
            }, 500);
            
            // Clear any existing timeout
            if (inquiryTimeout) {
                clearTimeout(inquiryTimeout);
            }
            
            // Set timeout to show it again after 30 seconds (shorter for testing)
            inquiryTimeout = setTimeout(() => {
                if (!inquiryVisible && floatingInquiry) {
                    floatingInquiry.classList.remove('hidden');
                    floatingInquiry.classList.add('animate__animated', 'animate__fadeInUp');
                    inquiryVisible = true;
                    
                    setTimeout(() => {
                        floatingInquiry.classList.remove('animate__animated', 'animate__fadeInUp');
                    }, 500);
                }
            }, 30 * 1000); // 30 seconds for testing, can change to longer time in production
        });
    }
    
    // Update Telegram bot links with the actual username
    const TELEGRAM_BOT_USERNAME = 'your_bot_username'; // Replace with actual bot username
    document.querySelectorAll('.inquiry-option').forEach(option => {
        // Get the symptom text in the currently active language
        const getOptionText = () => {
            const isUz = langUz.classList.contains('active');
            const textElement = option.querySelector(isUz ? '.lang-uz' : '.lang-ru');
            return textElement ? textElement.textContent.trim() : '';
        };
        
        option.addEventListener('click', function(e) {
            const symptom = getOptionText();
            this.href = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=symptom_${symptom.toLowerCase().replace(/\s+/g, '_')}`;
        });
    });
    
    // Ensure inquiry is always visible but not overlapping with footer
    function adjustInquiryPosition() {
        if (!floatingInquiry) return;
        
        if (window.innerWidth <= 576) {
            const footer = document.querySelector('.footer');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                if (footerRect.top < window.innerHeight) {
                    floatingInquiry.style.bottom = `${window.innerHeight - footerRect.top + 10}px`;
                } else {
                    floatingInquiry.style.bottom = '10px';
                }
            }
        } else {
            floatingInquiry.style.bottom = '20px';
        }
    }
    
    window.addEventListener('scroll', adjustInquiryPosition);
    window.addEventListener('resize', adjustInquiryPosition);
    setTimeout(adjustInquiryPosition, 300);
});
