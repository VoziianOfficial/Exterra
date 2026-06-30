'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const situations = {
        'old-siding': {
            kicker: 'Older exterior materials',
            title: 'When siding looks worn, faded, loose, or outdated.',
            text:
                'A replacement-focused request can help organize details about the age of the exterior, visible wear, material preferences, removal expectations, trim questions, and timing. Exterra helps homeowners start with clear information so provider conversations are easier to compare.',
            linkText: 'Explore Siding Replacement',
            linkUrl: 'siding-replacement.html',
            imageOne: 'assets/images/card-1.jpg',
            imageOneAlt: 'Siding replacement exterior detail',
            imageTwo: 'assets/images/card-4.jpg',
            imageTwoAlt: 'Modern home siding comparison detail'
        },

        'storm-damage': {
            kicker: 'Damage after weather exposure',
            title: 'When panels, corners, trim, or exterior areas may need repair discussion.',
            text:
                'A storm-related siding request can include visible impact, loosened panels, cracks, moisture concerns, missing trim, or sections that need provider review. Exterra helps frame the request so available providers may discuss repair scope, timing, and next steps directly with you.',
            linkText: 'Explore Siding Repair',
            linkUrl: 'siding-repair.html',
            imageOne: 'assets/images/card-2.jpg',
            imageOneAlt: 'Siding repair detail after exterior damage',
            imageTwo: 'assets/images/card-3.jpg',
            imageTwoAlt: 'Home exterior siding area after weather exposure'
        },

        'new-look': {
            kicker: 'Exterior style update',
            title: 'When the goal is a cleaner, newer, more polished facade.',
            text:
                'A style-focused request can describe curb appeal goals, color direction, facade texture, trim ideas, and whether the project is part of a larger exterior update. Exterra helps homeowners organize these preferences before comparing provider-supplied options.',
            linkText: 'Explore Siding Installation',
            linkUrl: 'siding-installation.html',
            imageOne: 'assets/images/service-1.jpg',
            imageOneAlt: 'Modern siding installation style on a home exterior',
            imageTwo: 'assets/images/service-3.jpg',
            imageTwoAlt: 'Clean home facade with updated siding style'
        },

        'material-upgrade': {
            kicker: 'Material preference request',
            title: 'When material choice is central to the siding conversation.',
            text:
                'A material upgrade request can mention vinyl, fiber cement, wood, composite, trim details, maintenance expectations, and exterior texture. Exterra does not sell siding materials, but it can help you start a clearer request for provider discussion.',
            linkText: 'Explore Fiber Cement Siding',
            linkUrl: 'fiber-cement-siding.html',
            imageOne: 'assets/images/service-5.jpg',
            imageOneAlt: 'Fiber cement siding material texture',
            imageTwo: 'assets/images/service-6.jpg',
            imageTwoAlt: 'Wood and composite siding exterior material detail'
        },

        maintenance: {
            kicker: 'Maintenance and exterior expectations',
            title: 'When upkeep, durability, and long-term appearance matter.',
            text:
                'A maintenance-focused request can include concerns about fading, cleaning, moisture exposure, panel durability, surface texture, and long-term exterior expectations. Participating providers may discuss available options, but final terms and recommendations come from the provider.',
            linkText: 'Explore Vinyl Siding',
            linkUrl: 'vinyl-siding.html',
            imageOne: 'assets/images/service-4.jpg',
            imageOneAlt: 'Vinyl siding exterior material detail',
            imageTwo: 'assets/images/cta.jpg',
            imageTwoAlt: 'Home exterior siding and trim detail'
        }
    };

    const initSituationSelector = () => {
        const root = qs('[data-situation-selector]');
        if (!root) return;

        const buttons = qsa('[data-situation-button]', root);
        const card = qs('[data-situation-card]', root);

        const kicker = qs('[data-situation-kicker]', root);
        const title = qs('[data-situation-title]', root);
        const text = qs('[data-situation-text]', root);
        const link = qs('[data-situation-link]', root);

        const photosWrap = qs('.situation-selector__photos', root);
        const imageOne = qs('[data-situation-image-one]', root);
        const imageTwo = qs('[data-situation-image-two]', root);

        if (!buttons.length || !card || !kicker || !title || !text || !link || !imageOne || !imageTwo) return;

        const setActiveButton = (activeKey) => {
            buttons.forEach((button) => {
                const isActive = button.dataset.situationButton === activeKey;

                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        };

        const updateImages = (data) => {
            if (!data) return;

            imageOne.src = data.imageOne;
            imageOne.alt = data.imageOneAlt;

            imageTwo.src = data.imageTwo;
            imageTwo.alt = data.imageTwoAlt;
        };

        const updateContent = (key) => {
            const data = situations[key];
            if (!data) return;

            setActiveButton(key);

            card.classList.add('is-changing');
            if (photosWrap) photosWrap.classList.add('is-changing');

            window.setTimeout(() => {
                kicker.textContent = data.kicker;
                title.textContent = data.title;
                text.textContent = data.text;

                link.textContent = data.linkText;
                link.href = data.linkUrl;

                updateImages(data);

                card.classList.remove('is-changing');
                if (photosWrap) photosWrap.classList.remove('is-changing');
            }, 180);
        };

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const key = button.dataset.situationButton;
                updateContent(key);
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

    const initHome = () => {
        initSituationSelector();

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshIcons === 'function') {
            window.ExterraGlobal.refreshIcons();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHome);
    } else {
        initHome();
    }
})();

