'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const initPopularSlider = () => {
        const sliders = qsa('[data-popular-slider]');
        if (!sliders.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        sliders.forEach((slider) => {
            const slides = qsa('.popular-service-slide', slider);
            const prev = qs('[data-popular-prev]', slider);
            const next = qs('[data-popular-next]', slider);

            if (!slides.length) return;

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
        });
    };

    const markCurrentServiceLinks = () => {
        if (!window.ExterraGlobal) return;

        const currentService = window.ExterraGlobal.getServiceByPage?.();
        if (!currentService) return;

        qsa(`a[href="${currentService.url}"]`).forEach((link) => {
            link.setAttribute('aria-current', 'page');
        });
    };

    const initServices = () => {
        initPopularSlider();
        markCurrentServiceLinks();

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshIcons === 'function') {
            window.ExterraGlobal.refreshIcons();
        }
    };

    (function () {
        const initServiceCounters = () => {
            const counters = Array.from(document.querySelectorAll('[data-service-counter]'));
            if (!counters.length) return;

            const formatNumber = (value) => String(value).padStart(2, '0');

            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

            const animateCounter = (counter, index = 0) => {
                if (counter.dataset.counted === 'true') return;

                const statItem = counter.closest('.service-count-strip__stats span');
                const target = Number(counter.dataset.counterValue || 0);
                const duration = 1450;
                const delay = index * 150;

                counter.dataset.counted = 'true';
                counter.textContent = '00';

                window.setTimeout(() => {
                    statItem?.classList.add('is-visible', 'is-counting');

                    const startTime = performance.now();

                    const tick = (now) => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const eased = easeOutQuart(progress);
                        const current = Math.round(target * eased);

                        counter.textContent = formatNumber(current);

                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        } else {
                            counter.textContent = formatNumber(target);

                            window.setTimeout(() => {
                                statItem?.classList.remove('is-counting');
                                statItem?.classList.add('is-counted');
                            }, 120);
                        }
                    };

                    requestAnimationFrame(tick);
                }, delay);
            };

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        const visibleCounters = counters.filter((counter) => counter.dataset.counted !== 'true');

                        visibleCounters.forEach((counter, index) => {
                            animateCounter(counter, index);
                        });

                        observer.disconnect();
                    });
                },
                {
                    threshold: 0.28
                }
            );

            counters.forEach((counter) => {
                counter.textContent = '00';
                observer.observe(counter);
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initServiceCounters);
        } else {
            initServiceCounters();
        }
    })();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServices);
    } else {
        initServices();
    }
})();