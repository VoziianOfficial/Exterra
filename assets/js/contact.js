'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const setMessage = (messageBox, text, type) => {
        if (!messageBox) return;

        messageBox.textContent = text;
        messageBox.classList.remove('is-success', 'is-error');
        messageBox.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    };

    const validateForm = (form) => {
        const fullName = qs('[name="fullName"]', form);
        const email = qs('[name="email"]', form);
        const phone = qs('[name="phone"]', form);
        const service = qs('[name="service"]', form);
        const message = qs('[name="message"]', form);
        const consent = qs('[name="privacyConsent"]', form);

        if (!fullName?.value.trim()) {
            return 'Please enter your full name.';
        }

        if (!email?.value.trim() || !isValidEmail(email.value)) {
            return 'Please enter a valid email address.';
        }

        if (!phone?.value.trim()) {
            return 'Please enter your phone number.';
        }

        if (!service?.value.trim()) {
            return 'Please select a siding category.';
        }

        if (!message?.value.trim() || message.value.trim().length < 12) {
            return 'Please add a short description of your siding request.';
        }

        if (!consent?.checked) {
            return 'Please confirm the privacy consent before submitting.';
        }

        return '';
    };

    const initFormStartedAt = () => {
        const startedAtInput = qs('[data-form-started-at]');
        if (!startedAtInput) return;

        startedAtInput.value = String(Date.now());
    };

    const initContactForm = () => {
        const form = qs('[data-contact-form]');
        if (!form) return;

        const messageBox = qs('[data-form-message]', form);
        const submitButton = qs('[data-submit-button]', form);
        const submitText = submitButton ? qs('span', submitButton) : null;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const validationMessage = validateForm(form);

            if (validationMessage) {
                setMessage(messageBox, validationMessage, 'error');
                return;
            }

            const formData = new FormData(form);

            form.classList.add('is-submitting');
            if (submitButton) submitButton.disabled = true;
            if (submitText) submitText.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                const data = await response.json().catch(() => null);

                if (!response.ok || !data || !data.success) {
                    const errorMessage =
                        data && data.message
                            ? data.message
                            : 'Please check the required fields and try again.';

                    setMessage(messageBox, errorMessage, 'error');
                    return;
                }

                setMessage(
                    messageBox,
                    data.message || 'Thank you. Your request has been received.',
                    'success'
                );

                form.reset();
                initFormStartedAt();
            } catch (error) {
                setMessage(
                    messageBox,
                    'Please check the required fields and try again.',
                    'error'
                );
            } finally {
                form.classList.remove('is-submitting');
                if (submitButton) submitButton.disabled = false;
                if (submitText) submitText.textContent = 'Submit Request';

                if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshIcons === 'function') {
                    window.ExterraGlobal.refreshIcons();
                }
            }
        });
    };

    const initPopularSlider = () => {
        const slider = qs('[data-popular-slider]');
        if (!slider) return;

        const slides = qsa('.popular-service-slide', slider);
        const prev = qs('[data-popular-prev]', slider);
        const next = qs('[data-popular-next]', slider);

        if (!slides.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
        let autoplayTimer = null;

        if (activeIndex < 0) activeIndex = 0;

        const setActive = (index) => {
            activeIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === activeIndex;

                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
                slide.tabIndex = isActive ? 0 : -1;
            });
        };

        const goNext = () => setActive(activeIndex + 1);
        const goPrev = () => setActive(activeIndex - 1);

        const stopAutoplay = () => {
            if (!autoplayTimer) return;

            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        };

        const startAutoplay = () => {
            if (reducedMotion || autoplayTimer) return;

            autoplayTimer = window.setInterval(goNext, 4200);
        };

        prev?.addEventListener('click', () => {
            stopAutoplay();
            goPrev();
            startAutoplay();
        });

        next?.addEventListener('click', () => {
            stopAutoplay();
            goNext();
            startAutoplay();
        });

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin', stopAutoplay);
        slider.addEventListener('focusout', startAutoplay);

        slider.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                stopAutoplay();
                goNext();
                startAutoplay();
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                stopAutoplay();
                goPrev();
                startAutoplay();
            }
        });

        setActive(activeIndex);
        startAutoplay();
    };

    const initContact = () => {
        initFormStartedAt();
        initContactForm();
        initPopularSlider();

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshIcons === 'function') {
            window.ExterraGlobal.refreshIcons();
        }

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshAOS === 'function') {
            window.ExterraGlobal.refreshAOS();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContact);
    } else {
        initContact();
    }
})();