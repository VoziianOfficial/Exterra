'use strict';

(function () {
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const initAboutSlideshow = () => {
        const slideshows = qsa('[data-about-slideshow]');
        if (!slideshows.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        slideshows.forEach((slideshow) => {
            const images = qsa('.about-slideshow__image', slideshow);
            if (images.length <= 1) return;

            let activeIndex = images.findIndex((image) => image.classList.contains('is-active'));
            if (activeIndex < 0) activeIndex = 0;

            images.forEach((image, index) => {
                image.classList.toggle('is-active', index === activeIndex);
            });

            if (reducedMotion) return;

            window.setInterval(() => {
                images[activeIndex].classList.remove('is-active');

                activeIndex = activeIndex + 1 >= images.length ? 0 : activeIndex + 1;

                images[activeIndex].classList.add('is-active');
            }, 3800);
        });
    };

    const initAbout = () => {
        initAboutSlideshow();

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshIcons === 'function') {
            window.ExterraGlobal.refreshIcons();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAbout);
    } else {
        initAbout();
    }
})();