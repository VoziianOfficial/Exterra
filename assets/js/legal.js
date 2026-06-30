'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const initLegalNav = () => {
        const nav = qs('[data-legal-nav]');
        if (!nav) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        qsa('a', nav).forEach((link) => {
            const href = link.getAttribute('href');

            if (href === currentPath) {
                link.setAttribute('aria-current', 'page');
            }
        });
    };

    const initAnchorScroll = () => {
        qsa('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');

                if (!targetId || targetId === '#') return;

                const target = qs(targetId);
                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                    block: 'start'
                });
            });
        });
    };

    const initLegal = () => {
        initLegalNav();
        initAnchorScroll();

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshIcons === 'function') {
            window.ExterraGlobal.refreshIcons();
        }

        if (window.ExterraGlobal && typeof window.ExterraGlobal.refreshAOS === 'function') {
            window.ExterraGlobal.refreshAOS();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLegal);
    } else {
        initLegal();
    }
})();