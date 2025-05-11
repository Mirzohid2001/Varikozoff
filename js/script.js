document.addEventListener('DOMContentLoaded', function () {
    // Определение нужных элементов формы
    const appointmentForm = document.getElementById('appointmentForm');
    const formMessage = document.getElementById('formMessage');
    
    // Мгновенно исправить ссылки Telegram, если они содержат @ в URL
    document.querySelectorAll('a[href*="t.me/@"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('t.me/@')) {
            link.setAttribute('href', href.replace('t.me/@', 't.me/'));
        }
    });
    
    // Код для открытия модального окна при клике на кнопки "QABULGA YOZILISH"
    document.querySelectorAll('a, button').forEach(el => {
        if (el.tagName === 'A' && el.getAttribute('href') === 'https://varikozoff-bukhara.uz/en/appointment/') {
            // Изменяем URL на открытие модального окна
            el.setAttribute('href', '#');
            el.setAttribute('data-bs-toggle', 'modal');
            el.setAttribute('data-bs-target', '#appointmentModal');
        } else {
            el.addEventListener('click', function(event) {
                const uzText = el.querySelector('.lang-uz')?.textContent?.trim();
                if ((uzText === 'QABULGA YOZILISH' || uzText === 'Qabulga yozilish') && !el.closest('form')) {
                    // Если это не кнопка сабмита формы, открываем модальное окно
                    if (!el.getAttribute('data-bs-toggle')) {
                        event.preventDefault();
                        
                        // Открываем модальное окно
                        const appointmentModal = new bootstrap.Modal(document.getElementById('appointmentModal'));
                        appointmentModal.show();
                        return false;
                    }
                }
            });
        }
    });

    // Обработка модального окна записи на прием - анимации и эффекты
    const appointmentModal = document.getElementById('appointmentModal');
    if (appointmentModal) {
        appointmentModal.addEventListener('shown.bs.modal', function() {
            // Анимируем иконку
            const icon = this.querySelector('.appointment-icon i');
            if (icon) {
                icon.classList.add('animated');
            }
            
            // Плавное появление элементов формы
            const formElements = this.querySelectorAll('.modal-body .mb-3');
            formElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        });
        
        // Начальные стили для элементов формы
        const formElements = appointmentModal.querySelectorAll('.modal-body .mb-3');
        formElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

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
                ? success ? 'Murojaatingiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.' : 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.'
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

    // Обработчик формы записи на прием на странице
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Показываем индикатор загрузки
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="lang-uz">Yuborilmoqda...</span><span class="lang-ru">Отправка...</span>';
            submitBtn.disabled = true;
            
            try {
                // Собираем данные формы
                const formData = new FormData(this);
                const data = {};
                
                // Преобразуем FormData в объект
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                // Отправляем сообщение в Telegram
                const fullName = data.name || '';
                const phone = data.phone || '';
                const message = data.message || '';
                const currentDate = new Date().toLocaleString();
                
                const telegramMessage = `🆕 <b>Yangi mijoz</b>\n\n<b>Ismi:</b> ${fullName}\n<b>Telefon:</b> ${phone}\n<b>Izoh:</b> ${message || 'Berilmagan'}\n<b>Sana:</b> ${currentDate}\n<b>Manba:</b> Varikoz Off veb-sayt`;
                
                // Имитация отправки данных
                await new Promise(resolve => setTimeout(resolve, 1500));
                const success = true; // Предполагаем успешную отправку
                
                if (success) {
                    // Показываем сообщение об успехе с анимацией
                    formMessage.className = 'alert alert-success fade-in-up';
                    formMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + 
                        '<span class="lang-uz">Sizning murojaatingiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.</span>' +
                        '<span class="lang-ru">Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.</span>';
                    formMessage.style.display = 'block';
                    
                    // Сохраняем данные в localStorage
                    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                    data.id = Date.now();
                    data.created_at = currentDate;
                    appointments.push(data);
                    localStorage.setItem('appointments', JSON.stringify(appointments));
                    
                    // Очищаем форму
                    appointmentForm.reset();
                    
                    // Скрываем сообщение через 5 секунд с анимацией
                    setTimeout(() => {
                        formMessage.classList.add('fade-out');
                        setTimeout(() => {
                            formMessage.style.display = 'none';
                            formMessage.classList.remove('fade-out');
                        }, 500);
                    }, 5000);
                } else {
                    throw new Error('Произошла ошибка при отправке заявки');
                }
            } catch (error) {
                console.error('Error:', error);
                // Показываем сообщение об ошибке с анимацией
                formMessage.className = 'alert alert-danger fade-in-up';
                formMessage.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + 
                    '<span class="lang-uz">Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.</span>' +
                    '<span class="lang-ru">Произошла ошибка. Пожалуйста, попробуйте еще раз.</span>';
                formMessage.style.display = 'block';
                
                // Скрываем сообщение через 5 секунд с анимацией
                setTimeout(() => {
                    formMessage.classList.add('fade-out');
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                        formMessage.classList.remove('fade-out');
                    }, 500);
                }, 5000);
            } finally {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Валидация полей формы на странице
    const mainPhoneInput = document.getElementById('phoneNumber');
    if (mainPhoneInput) {
        mainPhoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Если начинается не с +998 или 998, добавляем этот префикс
            if (value && !value.startsWith('998') && value.length > 0) {
                value = '998' + value;
            }
            
            // Форматируем номер телефона
            if (value.length > 0) {
                value = '+' + value;
            }
            if (value.length > 4) {
                value = value.substring(0, 4) + ' ' + value.substring(4);
            }
            if (value.length > 7) {
                value = value.substring(0, 7) + ' ' + value.substring(7);
            }
            if (value.length > 11) {
                value = value.substring(0, 11) + ' ' + value.substring(11);
            }
            if (value.length > 14) {
                value = value.substring(0, 14);
            }
            
            e.target.value = value;
        });
    }

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

    // Phone Call Button Setup
    const phoneButton = document.querySelector('.phone-call-button');
    if (phoneButton) {
        phoneButton.href = "tel:+998 91 404 81 00"; // Установка реального номера телефона клиники
    }

    // ✅ Обработчик формы в модальном окне
    const modalAppointmentForm = document.getElementById('modalAppointmentForm');
    const modalFormMessage = document.getElementById('modalFormMessage');
    
    if (modalAppointmentForm) {
        modalAppointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.querySelector('button[form="modalAppointmentForm"]');
            const originalText = submitBtn.innerHTML;
            
            // Показываем индикатор загрузки
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="lang-uz">Yuborilmoqda...</span><span class="lang-ru">Отправка...</span>';
            submitBtn.disabled = true;
            
            try {
                // Собираем данные формы
                const formData = new FormData(this);
                const data = {};
                
                // Преобразуем FormData в объект
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                // Отправляем сообщение в Telegram
                const fullName = data.name;
                const phone = data.phone;
                const comment = data.message;
                const currentDate = new Date().toLocaleString();
                
                const message = `🆕 <b>Yangi mijoz</b>\n\n<b>Ismi:</b> ${fullName}\n<b>Telefon:</b> ${phone}\n<b>Izoh:</b> ${comment || 'Berilmagan'}\n<b>Sana:</b> ${currentDate}\n<b>Manba:</b> Varikoz Off veb-sayt`;
                
                // Имитация отправки сообщения в Telegram
                await new Promise(resolve => setTimeout(resolve, 1500));
                const success = true; // Предполагаем успешную отправку
                
                if (success) {
                    // Показываем сообщение об успехе
                    modalFormMessage.className = 'alert alert-success';
                    modalFormMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + 
                        '<span class="lang-uz">Sizning murojaatingiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.</span>' +
                        '<span class="lang-ru">Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.</span>';
                    modalFormMessage.style.display = 'block';
                    modalFormMessage.classList.add('show');
                    
                    // Сохраняем данные в localStorage
                    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                    data.id = Date.now();
                    data.created_at = currentDate;
                    appointments.push(data);
                    localStorage.setItem('appointments', JSON.stringify(appointments));
                    
                    // Очищаем форму
                    modalAppointmentForm.reset();
                    
                    // Закрываем модальное окно через 3 секунды
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
                        if (modal) {
                            modal.hide();
                        }
                        
                        // Сбрасываем состояние сообщения
                        setTimeout(() => {
                            modalFormMessage.style.display = 'none';
                            modalFormMessage.classList.remove('show');
                        }, 300);
                    }, 3000);
                } else {
                    throw new Error('Произошла ошибка при отправке заявки');
                }
            } catch (error) {
                console.error('Error:', error);
                // Показываем сообщение об ошибке
                modalFormMessage.className = 'alert alert-danger';
                modalFormMessage.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + 
                    '<span class="lang-uz">Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.</span>' +
                    '<span class="lang-ru">Произошла ошибка. Пожалуйста, попробуйте еще раз.</span>';
                modalFormMessage.style.display = 'block';
                modalFormMessage.classList.add('show');
            } finally {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Валидация полей формы
    const modalPhoneInput = document.getElementById('modalPhoneNumber');
    if (modalPhoneInput) {
        modalPhoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Если начинается не с +998 или 998, добавляем этот префикс
            if (value && !value.startsWith('998') && value.length > 0) {
                value = '998' + value;
            }
            
            // Форматируем номер телефона
            if (value.length > 0) {
                value = '+' + value;
            }
            if (value.length > 4) {
                value = value.substring(0, 4) + ' ' + value.substring(4);
            }
            if (value.length > 7) {
                value = value.substring(0, 7) + ' ' + value.substring(7);
            }
            if (value.length > 11) {
                value = value.substring(0, 11) + ' ' + value.substring(11);
            }
            if (value.length > 14) {
                value = value.substring(0, 14);
            }
            
            e.target.value = value;
        });
    }
});
