'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const explorerData = {
        'new-project': {
            kicker: 'New siding request',
            title: 'Start with siding installation.',
            text:
                'For a new exterior siding project, begin with installation. Share property details, material interest, exterior goals, and location so available participating providers may review the request.',
            linkText: 'View Siding Installation',
            linkUrl: 'siding-installation.html'
        },

        'old-siding': {
            kicker: 'Aging exterior request',
            title: 'Replacement may be the closest category.',
            text:
                'If siding is faded, worn, loose, outdated, or being changed across a larger exterior area, replacement can help frame provider conversations around removal, material choice, trim, timing, and quote scope.',
            linkText: 'View Siding Replacement',
            linkUrl: 'siding-replacement.html'
        },

        damage: {
            kicker: 'Visible siding concern',
            title: 'Repair may fit localized damage.',
            text:
                'If the request involves cracks, gaps, loose pieces, storm impact, small sections, or exterior wear in limited areas, siding repair can help organize the details before provider review.',
            linkText: 'View Siding Repair',
            linkUrl: 'siding-repair.html'
        },

        material: {
            kicker: 'Material comparison',
            title: 'Use a material-specific request path.',
            text:
                'When the material direction matters most, start with vinyl, fiber cement, wood, or composite siding. This helps providers understand your preference before discussing availability, maintenance, appearance, and terms.',
            linkText: 'View Fiber Cement Siding',
            linkUrl: 'fiber-cement-siding.html'
        },

        style: {
            kicker: 'Curb appeal direction',
            title: 'Wood and composite can support texture-focused requests.',
            text:
                'If the project is driven by exterior style, texture, facade character, or curb appeal, a wood and composite request can help explain the visual direction before provider conversations begin.',
            linkText: 'View Wood & Composite Siding',
            linkUrl: 'wood-composite-siding.html'
        }
    };

    const initServicesSlider = () => {
        const slider = qs('[data-services-slider]');
        if (!slider) return;

        const slides = qsa('.service-slide', slider);
        const prev = qs('[data-services-prev]', slider);
        const next = qs('[data-services-next]', slider);

        if (!slides.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
        let autoplayTimer = null;

        if (activeIndex < 0) activeIndex = 0;

        const setActive = (index) => {
            activeIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
                slide.setAttribute('aria-hidden', slideIndex === activeIndex ? 'false' : 'true');
                slide.tabIndex = slideIndex === activeIndex ? 0 : -1;
            });
        };

        const goNext = () => setActive(activeIndex + 1);
        const goPrev = () => setActive(activeIndex - 1);

        const stopAutoplay = () => {
            if (autoplayTimer) {
                window.clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
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

    const initServiceExplorer = () => {
        const root = qs('[data-service-explorer]');
        if (!root) return;

        const buttons = qsa('[data-explorer-button]', root);
        const panel = qs('[data-explorer-panel]', root);

        const kicker = qs('[data-explorer-kicker]', root);
        const title = qs('[data-explorer-title]', root);
        const text = qs('[data-explorer-text]', root);
        const link = qs('[data-explorer-link]', root);

        if (!buttons.length || !panel || !kicker || !title || !text || !link) return;

        const setActiveButton = (activeKey) => {
            buttons.forEach((button) => {
                const isActive = button.dataset.explorerButton === activeKey;

                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        };

        const updateExplorer = (key) => {
            const data = explorerData[key];
            if (!data) return;

            setActiveButton(key);
            panel.classList.add('is-changing');

            window.setTimeout(() => {
                kicker.textContent = data.kicker;
                title.textContent = data.title;
                text.textContent = data.text;
                link.textContent = data.linkText;
                link.href = data.linkUrl;

                panel.classList.remove('is-changing');

                if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshAOS === 'function') {
                    window.ExterraGlobal.refreshAOS();
                }
            }, 180);
        };

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                updateExplorer(button.dataset.explorerButton);
            });

            button.addEventListener('keydown', (event) => {
                if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;

                event.preventDefault();

                const currentIndex = buttons.indexOf(button);
                let nextIndex = currentIndex;

                if (event.key === 'ArrowRight') {
                    nextIndex = currentIndex + 1 >= buttons.length ? 0 : currentIndex + 1;
                }

                if (event.key === 'ArrowLeft') {
                    nextIndex = currentIndex - 1 < 0 ? buttons.length - 1 : currentIndex - 1;
                }

                if (event.key === 'Home') {
                    nextIndex = 0;
                }

                if (event.key === 'End') {
                    nextIndex = buttons.length - 1;
                }

                buttons[nextIndex].focus();
                buttons[nextIndex].click();
            });
        });
    };

    const initAllServices = () => {
        initServicesSlider();
        initServiceExplorer();

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshIcons === 'function') {
            window.ExterraGlobal.refreshIcons();
        }

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshAOS === 'function') {
            window.ExterraGlobal.refreshAOS();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllServices);
    } else {
        initAllServices();
    }
})();