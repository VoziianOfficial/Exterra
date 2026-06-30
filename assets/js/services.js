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

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshAOS === 'function') {
            window.ExterraGlobal.refreshAOS();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServices);
    } else {
        initServices();
    }
})();