'use strict';

(function () {
    const cfg = window.EXTERRA_CONFIG;

    if (!cfg) {
        console.warn('EXTERRA_CONFIG is missing. Make sure assets/js/config.js is loaded before global.js.');
        return;
    }

    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const escapeHtml = (value) => {
        if (value === null || value === undefined) return '';

        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    };

    const getValue = (path, fallback = '') => {
        return path.split('.').reduce((acc, key) => {
            if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
                return acc[key];
            }

            return undefined;
        }, cfg) ?? fallback;
    };

    const getCurrentPage = () => {
        const file = window.location.pathname.split('/').pop() || 'index.html';
        return file;
    };

    const currentPage = getCurrentPage();

    const getServiceByPage = () => {
        return cfg.services.find((service) => service.url === currentPage);
    };

    const isSamePageUrl = (url) => {
        if (!url) return false;
        const cleanUrl = url.split('#')[0];
        return cleanUrl === currentPage || (cleanUrl === 'index.html' && currentPage === '');
    };

    const iconMarkup = (iconName) => {
        return `<i data-lucide="${escapeHtml(iconName)}" aria-hidden="true"></i>`;
    };

    const buttonMarkup = (button, variant = 'orange') => {
        if (!button || !button.label || !button.url) return '';

        return `
      <a class="btn btn--${escapeHtml(variant)}" href="${escapeHtml(button.url)}">
        <span>${escapeHtml(button.label)}</span>
        ${iconMarkup('arrow-up-right')}
      </a>
    `;
    };

    const getRepeatedMarquee = () => {
        const text = cfg.marquee || '';
        return `
      <div class="cta-marquee" aria-hidden="true">
        <div class="cta-marquee__track">
          <span class="cta-marquee__text">${escapeHtml(text)}</span>
          <span class="cta-marquee__text">${escapeHtml(text)}</span>
        </div>
      </div>
    `;
    };

    const refreshIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };

    const REVEAL_EXCLUDED_PARENTS = [
        '.pre-header',
        '.site-header',
        '.site-footer',
        '.dropdown',
        '.mobile-menu',
        '[data-mobile-menu]',
        '[data-cookie-banner]',
        '.services-dropdown',
        '.cookie-banner',
        '.faq-answer',
        '.quote-flow__body',
        '[data-services-track]',
        '.popular-service-slider__track',
        '.service-slide:not(.is-active)',
        '.popular-service-slide:not(.is-active)',
        '[hidden]',
        '[aria-hidden="true"]'
    ].join(', ');
    const REVEAL_MAP = [
        {
            selector: '.section-head, .shared-hero__content, .service-explorer__head, .quote-flow__head, .conversation-map__head, .legal-hero__content, .situation-selector__top, .exterior-decision__head, .faq-section__head, .request-form, .request-info-card, .service-count-strip__inner, .checklist-lines, .provider-discussion__points, .btn-row, .quote-flow__accordion, .faq-accordion, .global-cta__card, .conversation-map__rail, .service-meaning',
            className: 'reveal reveal-up'
        },
        {
            selector: '.services-overview__content > p:not(.section-kicker), .service-overview__content > p:not(.section-kicker), .platform-overview__content > p:not(.section-kicker), .full-services__content > p:not(.section-kicker), .provider-discussion__content > p:not(.section-kicker), .homeowner-checklist__content > p:not(.section-kicker), .request-form__disclaimer, .legal-document__intro p',
            className: 'reveal reveal-soft'
        },
        {
            selector: '.service-step-card, .factor-card, .project-compare-card, .value-card, .not-claim-card, .help-step, .process-card, .transparency-card, .contact-info-card, .clarity-column, .quick-need-card',
            className: 'reveal reveal-card reveal-stagger',
            stagger: true,
            staggerStep: 80
        },
        {
            selector: '.image-frame, .about-slideshow, .matching-values__photo, .homeowner-checklist__photo, .faq-photo, .quote-flow__visual, .popular-service-slider, .full-services__slider, .situation-selector__photos, .service-overview__photo, .services-overview__photo, .platform-overview__photo, .provider-discussion__photo, .provider-discussion__wide-photo',
            className: 'reveal reveal-photo'
        },
        {
            selector: '.service-count-strip__stats, .provider-discussion__content, .homeowner-checklist__content, .category-row, .compare-card, .materials-style__paths, .materials-style__style, .comparison-factors__columns > *, .service-explorer__panel',
            className: 'reveal reveal-up'
        }
    ];

    const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileRevealViewport = () => window.matchMedia('(max-width: 760px)').matches;

    const canRevealNode = (node) => {
        if (!node || node.classList.contains('reveal')) return false;
        if (node.matches(REVEAL_EXCLUDED_PARENTS) || node.closest(REVEAL_EXCLUDED_PARENTS)) return false;
        if (node.parentElement?.closest('.reveal')) return false;
        if (window.getComputedStyle(node).position === 'fixed') return false;
        return true;
    };

    const applyRevealClass = (node, className) => {
        if (!canRevealNode(node)) return false;

        className.split(' ').forEach((token) => {
            if (token) node.classList.add(token);
        });

        return true;
    };

    const applyRevealMap = () => {
        REVEAL_MAP.forEach((entry) => {
            const groups = new Map();
            const isMobile = isMobileRevealViewport();
            const step = isMobile ? 0 : entry.staggerStep || 80;

            qsa(entry.selector).forEach((node) => {
                if (!applyRevealClass(node, entry.className)) return;

                if (!entry.stagger) return;

                const parent = node.parentElement;
                const currentIndex = groups.get(parent) || 0;
                const delay = Math.min(currentIndex * step, 240);

                if (delay > 0) {
                    node.style.transitionDelay = `${delay}ms`;
                }

                groups.set(parent, currentIndex + 1);
            });
        });
    };

    const setupRevealAnimations = () => {
        applyRevealMap();

        const revealNodes = qsa('.reveal');
        if (!revealNodes.length) return;

        if (isReducedMotion() || typeof window.IntersectionObserver !== 'function') {
            revealNodes.forEach((node) => node.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                root: null,
                threshold: 0.16,
                rootMargin: '0px 0px -8% 0px'
            }
        );

        revealNodes.forEach((node) => observer.observe(node));
    };

    

    const injectConfigValues = () => {
        qsa('[data-config]').forEach((node) => {
            const value = getValue(node.dataset.config, '');
            node.textContent = value;
        });

        qsa('[data-config-href]').forEach((node) => {
            const value = getValue(node.dataset.configHref, '');
            if (value) node.setAttribute('href', value);
        });

        qsa('[data-phone-link]').forEach((node) => {
            node.setAttribute('href', `tel:${cfg.company.phoneRaw}`);
            if (!node.dataset.keepText) {
                node.textContent = cfg.company.phoneDisplay;
            }
        });

        qsa('[data-email-link]').forEach((node) => {
            node.setAttribute('href', `mailto:${cfg.company.email}`);
            if (!node.dataset.keepText) {
                node.textContent = cfg.company.email;
            }
        });

        qsa('[data-current-year]').forEach((node) => {
            node.textContent = String(new Date().getFullYear());
        });

        qsa('[data-source-page]').forEach((node) => {
            node.value = currentPage;
        });
    };

    

    const renderHeader = () => {
        const mount = qs('[data-site-header]');
        if (!mount) return;

        const servicesLinks = cfg.services
            .map((service) => {
                return `
          <a class="services-dropdown__link" href="${escapeHtml(service.url)}">
            <span>${escapeHtml(service.title)}</span>
            ${iconMarkup('arrow-up-right')}
          </a>
        `;
            })
            .join('');

        const navLinks = cfg.navigation.main
            .map((item) => {
                const activeClass = isSamePageUrl(item.url) ? ' is-active' : '';

                if (item.label.toLowerCase() === 'services') {
                    return `
            <div class="dropdown">
              <a class="dropdown-toggle${activeClass}" href="${escapeHtml(item.url)}" aria-haspopup="true" aria-expanded="false">
                <span>${escapeHtml(item.label)}</span>
                ${iconMarkup('chevron-down')}
              </a>

              <div class="services-dropdown" role="menu" aria-label="Siding services">
                <div class="services-dropdown__grid">
                  ${servicesLinks}
                </div>
              </div>
            </div>
          `;
                }

                return `
          <a class="main-nav__link${activeClass}" href="${escapeHtml(item.url)}">
            ${escapeHtml(item.label)}
          </a>
        `;
            })
            .join('');

        mount.innerHTML = `
      <div class="pre-header">
        <div class="container-wide pre-header__inner">
          <div class="pre-header__note">
            <span>${escapeHtml(cfg.brand.tagline)}</span>
          </div>

          <div class="pre-header__links">
            <a data-phone-link href="tel:${escapeHtml(cfg.company.phoneRaw)}">${escapeHtml(cfg.company.phoneDisplay)}</a>
            <a data-email-link href="mailto:${escapeHtml(cfg.company.email)}">${escapeHtml(cfg.company.email)}</a>
          </div>
        </div>
      </div>

      <header class="site-header" aria-label="Site header">
        <div class="container-wide site-header__inner">
          <a class="brand" href="${escapeHtml(cfg.paths.home)}" aria-label="${escapeHtml(cfg.brand.name)} home">
            <img class="brand__logo" src="${escapeHtml(cfg.brand.logo)}" alt="${escapeHtml(cfg.brand.logoAlt)}" width="54" height="42">
            <span class="brand__text">
              <span class="brand__name">${escapeHtml(cfg.brand.name)}</span>
              <span class="brand__tagline">${escapeHtml(cfg.brand.tagline)}</span>
            </span>
          </a>

          <nav class="main-nav" aria-label="Main navigation">
            ${navLinks}
          </nav>

          <div class="header-actions">
            <a class="header-icon-btn" data-header-phone data-phone-link data-keep-text="true" href="tel:${escapeHtml(cfg.company.phoneRaw)}" aria-label="Call ${escapeHtml(cfg.brand.name)}">
              ${iconMarkup('phone')}
            </a>

            <a class="header-icon-btn" data-header-email data-email-link data-keep-text="true" href="mailto:${escapeHtml(cfg.company.email)}" aria-label="Email ${escapeHtml(cfg.brand.name)}">
              ${iconMarkup('mail')}
            </a>

            <button class="header-icon-btn burger-btn" type="button" data-menu-open aria-controls="mobile-menu" aria-expanded="false" aria-label="Open mobile menu">
              ${iconMarkup('menu')}
            </button>
          </div>
        </div>
      </header>
    `;
    };

    

    const renderMobileMenu = () => {
        const mount = qs('[data-mobile-menu]');
        if (!mount) return;

        mount.className = 'mobile-menu';
        mount.id = 'mobile-menu';
        mount.setAttribute('aria-hidden', 'true');

        const navLinks = cfg.navigation.main
            .map((item) => {
                return `<a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>`;
            })
            .join('');

        const serviceLinks = cfg.services
            .map((service) => {
                return `<a href="${escapeHtml(service.url)}">${escapeHtml(service.shortTitle || service.title)}</a>`;
            })
            .join('');

        mount.innerHTML = `
      <div class="mobile-menu__top">
        <a class="brand" href="${escapeHtml(cfg.paths.home)}" aria-label="${escapeHtml(cfg.brand.name)} home">
          <img class="brand__logo" src="${escapeHtml(cfg.brand.logo)}" alt="${escapeHtml(cfg.brand.logoAlt)}" width="54" height="42">
          <span class="brand__text">
            <span class="brand__name">${escapeHtml(cfg.brand.name)}</span>
            <span class="brand__tagline">${escapeHtml(cfg.brand.tagline)}</span>
          </span>
        </a>

        <button class="mobile-menu__close" type="button" data-menu-close aria-label="Close mobile menu">
          ${iconMarkup('x')}
        </button>
      </div>

      <div class="mobile-menu__content">
        <nav class="mobile-menu__nav" aria-label="Mobile navigation">
          ${navLinks}
        </nav>

        <div class="mobile-menu__services">
          <p class="mobile-menu__services-title">Siding categories</p>
          <div class="mobile-menu__services-grid">
            ${serviceLinks}
          </div>
        </div>
      </div>

      <div class="mobile-menu__bottom">
        <a class="btn btn--orange" data-phone-link href="tel:${escapeHtml(cfg.company.phoneRaw)}">
          ${iconMarkup('phone')}
          <span>${escapeHtml(cfg.company.phoneButtonText)}</span>
        </a>

        <a class="btn btn--light" href="${escapeHtml(cfg.paths.contact)}">
          ${iconMarkup('send')}
          <span>Start Request</span>
        </a>
      </div>
    `;
    };

    const initMobileMenu = () => {
        const menu = qs('[data-mobile-menu]');
        const openBtn = qs('[data-menu-open]');
        const closeBtn = qs('[data-menu-close]');

        if (!menu || !openBtn || !closeBtn) return;

        const focusableSelector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

        const openMenu = () => {
            menu.classList.add('is-open');
            menu.setAttribute('aria-hidden', 'false');
            openBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');

            const firstFocusable = qs(focusableSelector, menu);
            if (firstFocusable) firstFocusable.focus();
        };

        const closeMenu = () => {
            menu.classList.remove('is-open');
            menu.setAttribute('aria-hidden', 'true');
            openBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            openBtn.focus();
        };

        openBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);

        qsa('a', menu).forEach((link) => {
            link.addEventListener('click', () => {
                menu.classList.remove('is-open');
                menu.setAttribute('aria-hidden', 'true');
                openBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains('is-open')) {
                closeMenu();
            }

            if (event.key !== 'Tab' || !menu.classList.contains('is-open')) return;

            const focusable = qsa(focusableSelector, menu).filter((item) => !item.disabled);
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    };

    

    const initDropdowns = () => {
        qsa('.dropdown').forEach((dropdown) => {
            const toggle = qs('.dropdown-toggle', dropdown);
            const menu = qs('.services-dropdown', dropdown);
            let closeTimer = null;

            if (!toggle || !menu) return;

            const open = () => {
                clearTimeout(closeTimer);
                menu.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            };

            const close = () => {
                closeTimer = window.setTimeout(() => {
                    menu.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }, 180);
            };

            dropdown.addEventListener('mouseenter', open);
            dropdown.addEventListener('mouseleave', close);
            dropdown.addEventListener('focusin', open);
            dropdown.addEventListener('focusout', close);

            toggle.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    open();
                    const firstLink = qs('a', menu);
                    if (firstLink) firstLink.focus();
                }
            });

            menu.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    menu.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            });
        });
    };

    

    const renderSharedHero = () => {
        const mount = qs('[data-shared-hero]');
        if (!mount) return;

        const type = mount.dataset.sharedHero;
        const serviceId = mount.dataset.serviceId;
        const service = serviceId ? cfg.services.find((item) => item.id === serviceId) : getServiceByPage();

        let hero = cfg.hero[type];

        if (type === 'service' && service) {
            hero = {
                kicker: 'Siding category request',
                heading: service.heroHeading,
                text: service.heroText,
                image: service.image || 'assets/images/hero-service.jpg',
                primaryButton: {
                    label: 'Start Your Request',
                    url: 'contact.html'
                },
                secondaryButton: {
                    label: 'Compare Options',
                    url: 'all-services.html'
                },
                badge: service.title
            };
        }

        if (!hero) return;

        const badgeText =
            hero.badge ||
            (type === 'about'
                ? 'Independent platform'
                : type === 'services'
                    ? 'Six siding categories'
                    : type === 'contact'
                        ? 'No service agreement created by form submission'
                        : 'Provider terms vary by location');

        mount.className = 'shared-hero';
        mount.innerHTML = `
      <div class="shared-hero__media" aria-hidden="true">
        <img src="${escapeHtml(hero.image)}" alt="" width="1800" height="1100" loading="${type === 'home' ? 'eager' : 'lazy'}">
      </div>

      <div class="shared-hero__overlay" aria-hidden="true"></div>

      <div class="shared-hero__inner">
        <div class="shared-hero__spacer" aria-hidden="true"></div>

        <div class="shared-hero__content">
          <p class="section-kicker">${escapeHtml(hero.kicker)}</p>
          <h1>${escapeHtml(hero.heading)}</h1>
          <p>${escapeHtml(hero.text)}</p>

          <div class="btn-row">
            ${buttonMarkup(hero.primaryButton, 'orange')}
            ${buttonMarkup(hero.secondaryButton, 'light')}
          </div>

          <div class="shared-hero__badge">
            ${iconMarkup(type === 'service' ? service?.icon || 'badge-info' : 'badge-info')}
            <span>${escapeHtml(badgeText)}</span>
          </div>
        </div>
      </div>
    `;
    };

    

    const renderIconStrips = () => {
        qsa('[data-icon-strip]').forEach((mount) => {
            const type = mount.dataset.iconStrip || 'home';
            const tone = mount.dataset.tone || 'dark';
            const items = cfg.iconStrips[type] || cfg.iconStrips.home || [];

            mount.className = `icon-strip icon-strip--${type}${tone === 'light' ? ' icon-strip--light' : ''}`;

            mount.innerHTML = `
        <div class="container-wide">
          <nav class="icon-strip__inner no-scrollbar" aria-label="Page section navigation">
            ${items
                    .map((item) => {
                        return `
                  <a class="icon-strip__item" href="${escapeHtml(item.href)}">
                    ${iconMarkup(item.icon)}
                    <span>${escapeHtml(item.label)}</span>
                  </a>
                `;
                    })
                    .join('')}
          </nav>
        </div>
      `;
        });
    };

    

    const getFaqItems = (type, service) => {
        if (type === 'service' && service) {
            return [
                {
                    question: `Does Exterra perform ${service.shortTitle || service.title} work directly?`,
                    answer:
                        'No. Exterra is an independent provider-matching platform. Participating providers supply all service details, pricing, scheduling, warranties, and final terms.'
                },
                {
                    question: `What can I compare for ${service.shortTitle || service.title}?`,
                    answer:
                        'You can compare provider-supplied information such as availability, quote scope, material discussion, timing, warranty terms, and communication.'
                },
                {
                    question: 'What happens after I submit this request?',
                    answer:
                        'Your request details may be reviewed by participating providers, who may contact you directly with available options and provider-supplied terms.'
                },
                {
                    question: 'Does availability vary by location?',
                    answer:
                        'Yes. Provider availability, services, response times, and final terms may vary by location and by provider.'
                }
            ];
        }

        return cfg.faq[type] || cfg.faq.common;
    };

    const injectFaqSchema = (items, id) => {
        if (!items || !items.length) return;

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        };

        const existing = qs(`script[data-faq-schema="${id}"]`);
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.faqSchema = id;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    };

    const renderFaqSections = () => {
        qsa('[data-faq]').forEach((mount, index) => {
            const type = mount.dataset.faq || 'common';
            const heading = mount.dataset.faqHeading || 'Common Questions';
            const image = mount.dataset.faqImage || 'assets/images/faq.jpg';
            const serviceId = mount.dataset.serviceId;
            const service = serviceId ? cfg.services.find((item) => item.id === serviceId) : getServiceByPage();
            const items = getFaqItems(type, service);

            mount.className = 'faq-section section';
            mount.id = mount.id || 'faq';

            mount.innerHTML = `
        <div class="container">
          <div class="faq-section__head">
            <div class="faq-section__title">
              <p class="section-kicker">${escapeHtml(heading)}</p>
            </div>
          </div>

          <div class="faq-section__layout">
            <div class="faq-photo">
              <img src="${escapeHtml(image)}" alt="Siding exterior detail for Exterra questions" width="680" height="680" loading="lazy">
            </div>

            <div class="faq-accordion" data-accordion>
              ${items
                    .map((item, itemIndex) => {
                        const panelId = `faq-panel-${index}-${itemIndex}`;
                        const buttonId = `faq-button-${index}-${itemIndex}`;

                        return `
                    <article class="faq-item">
                      <button class="faq-question" id="${buttonId}" type="button" aria-expanded="${itemIndex === 0 ? 'true' : 'false'}" aria-controls="${panelId}">
                        ${iconMarkup(itemIndex % 2 === 0 ? 'circle-help' : 'badge-info')}
                        <span>${escapeHtml(item.question)}</span>
                        ${iconMarkup('plus')}
                      </button>

                      <div class="faq-answer${itemIndex === 0 ? ' is-open' : ''}" id="${panelId}" role="region" aria-labelledby="${buttonId}">
                        <div class="faq-answer__inner">
                          <p>${escapeHtml(item.answer)}</p>
                        </div>
                      </div>
                    </article>
                  `;
                    })
                    .join('')}
            </div>
          </div>
        </div>
      `;

            injectFaqSchema(items, `${type}-${index}`);
        });
    };

    const initAccordions = () => {
        qsa('[data-accordion]').forEach((accordion) => {
            qsa('.faq-question', accordion).forEach((button) => {
                button.addEventListener('click', () => {
                    const panelId = button.getAttribute('aria-controls');
                    const panel = panelId ? document.getElementById(panelId) : null;
                    const isOpen = button.getAttribute('aria-expanded') === 'true';

                    qsa('.faq-question', accordion).forEach((otherButton) => {
                        const otherPanelId = otherButton.getAttribute('aria-controls');
                        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;

                        otherButton.setAttribute('aria-expanded', 'false');
                        if (otherPanel) otherPanel.classList.remove('is-open');
                    });

                    if (!isOpen) {
                        button.setAttribute('aria-expanded', 'true');
                        if (panel) panel.classList.add('is-open');
                    }
                });
            });
        });
    };

    

    const renderGlobalCta = () => {
        qsa('[data-global-cta]').forEach((mount) => {
            const type = mount.dataset.globalCta || 'home';
            const serviceId = mount.dataset.serviceId;
            const service = serviceId ? cfg.services.find((item) => item.id === serviceId) : getServiceByPage();

            let cta = cfg.cta[type] || cfg.cta.home;

            if (type === 'service' && service) {
                cta = {
                    heading: `Compare local options for ${service.title}.`,
                    text:
                        'Submit your project details and review available local provider options before deciding whether to continue.',
                    primary: {
                        label: 'Start Your Request',
                        url: 'contact.html'
                    },
                    secondary: {
                        label: 'View Services',
                        url: 'all-services.html'
                    }
                };
            }

            mount.className = 'global-cta';
            mount.id = mount.id || 'global-cta';

            mount.innerHTML = `
        <div class="container-wide">
          <div class="global-cta__card">
            <div class="global-cta__content">
              <h2>${escapeHtml(cta.heading)}</h2>
              <p>${escapeHtml(cta.text)}</p>
            </div>

            <div class="global-cta__actions">
              ${buttonMarkup(cta.primary, 'orange')}
              ${buttonMarkup(cta.secondary, 'light')}
            </div>

            ${getRepeatedMarquee()}
          </div>
        </div>
      `;
        });
    };

    

    const renderFooter = () => {
        const mount = qs('[data-site-footer]');
        if (!mount) return;

        const mainLinks = cfg.navigation.main
            .map((item) => {
                return `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`;
            })
            .join('');

        const serviceLinks = cfg.services
            .map((service) => {
                return `<li><a href="${escapeHtml(service.url)}">${escapeHtml(service.title)}</a></li>`;
            })
            .join('');

        const legalLinks = cfg.navigation.legal
            .map((item) => {
                return `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`;
            })
            .join('');

        mount.className = 'site-footer';
        mount.innerHTML = `
      <div class="container-wide">
        <div class="site-footer__main">
          <div class="site-footer__brand">
            <a class="brand" href="${escapeHtml(cfg.paths.home)}" aria-label="${escapeHtml(cfg.brand.name)} home">
              <img class="brand__logo" src="${escapeHtml(cfg.brand.logo)}" alt="${escapeHtml(cfg.brand.logoAlt)}" width="54" height="42">
              <span class="brand__text">
                <span class="brand__name">${escapeHtml(cfg.brand.name)}</span>
                <span class="brand__tagline">${escapeHtml(cfg.brand.tagline)}</span>
              </span>
            </a>

            <p class="site-footer__text">${escapeHtml(cfg.footer.description)}</p>

            <div class="site-footer__meta">
              <p><strong>Legal name:</strong> ${escapeHtml(cfg.company.legalName)}</p>
              <p><strong>Company ID:</strong> ${escapeHtml(cfg.company.companyId)}</p>
              <p><strong>Address:</strong> ${escapeHtml(cfg.company.address)}</p>
              <p><strong>Service area:</strong> ${escapeHtml(cfg.company.serviceArea)}</p>
            </div>
          </div>

          <div class="footer-col">
            <h3>Navigation</h3>
            <ul class="footer-links">
              ${mainLinks}
            </ul>
          </div>

          <div class="footer-col">
            <h3>Services</h3>
            <ul class="footer-links">
              ${serviceLinks}
            </ul>
          </div>

          <div class="footer-col">
            <h3>Contact & Legal</h3>
            <ul class="footer-links">
              <li><a data-phone-link href="tel:${escapeHtml(cfg.company.phoneRaw)}">${escapeHtml(cfg.company.phoneDisplay)}</a></li>
              <li><a data-email-link href="mailto:${escapeHtml(cfg.company.email)}">${escapeHtml(cfg.company.email)}</a></li>
              ${legalLinks}
            </ul>
          </div>
        </div>

        <p class="site-footer__disclaimer">${escapeHtml(cfg.disclaimers.footer)}</p>

        <div class="site-footer__bottom">
          <p>${escapeHtml(cfg.footer.copyright)}</p>
          <p>${escapeHtml(cfg.disclaimers.short)}</p>
        </div>
      </div>
    `;
    };

    

    const renderCookieBanner = () => {
        const mount = qs('[data-cookie-banner]');
        if (!mount) return;

        const choice = localStorage.getItem('exterraCookieConsent');

        mount.className = 'cookie-banner';
        mount.setAttribute('role', 'dialog');
        mount.setAttribute('aria-label', 'Cookie consent');

        mount.innerHTML = `
      <div class="cookie-banner__inner">
        <p>
          Exterra uses essential localStorage for cookie consent and may use standard website functionality to improve usability.
          Read our
          <a href="${escapeHtml(cfg.paths.privacy)}">Privacy Policy</a>,
          <a href="${escapeHtml(cfg.paths.cookies)}">Cookie Policy</a>, and
          <a href="${escapeHtml(cfg.paths.terms)}">Terms of Service</a>.
        </p>

        <div class="cookie-banner__actions">
          <button class="btn btn--light" type="button" data-cookie-decline>Decline</button>
          <button class="btn btn--orange" type="button" data-cookie-accept>Accept</button>
        </div>
      </div>
    `;

        if (!choice) {
            mount.classList.add('is-visible');
        }

        const close = (value) => {
            localStorage.setItem('exterraCookieConsent', value);
            mount.classList.remove('is-visible');
        };

        qs('[data-cookie-accept]', mount)?.addEventListener('click', () => close('accepted'));
        qs('[data-cookie-decline]', mount)?.addEventListener('click', () => close('declined'));
    };

    

    const initSmoothAnchors = () => {
        qsa('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');

                if (!href || href === '#') return;

                const target = qs(href);
                if (!target) return;

                event.preventDefault();

                const header = qs('.site-header');
                const offset = header ? header.offsetHeight + 18 : 18;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top,
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
                });
            });
        });
    };

    

    const initParallax = () => {
        const layers = qsa('[data-parallax-layer]');
        if (!layers.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion) return;

        const update = () => {
            const isMobile = window.innerWidth < 900;

            layers.forEach((layer) => {
                if (isMobile) {
                    layer.style.transform = 'translate3d(0, 0, 0)';
                    return;
                }

                const parent = layer.closest('[data-parallax]');
                if (!parent) return;

                const rect = parent.getBoundingClientRect();
                const viewport = window.innerHeight;
                const progress = (viewport - rect.top) / (viewport + rect.height);
                const clamped = Math.max(0, Math.min(1, progress));
                const move = (clamped - 0.5) * 42;

                layer.style.transform = `translate3d(0, ${move}px, 0)`;
            });
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    };

    

    const init = () => {
        renderHeader();
        renderMobileMenu();
        renderSharedHero();
        renderIconStrips();
        renderFaqSections();
        renderGlobalCta();
        renderFooter();
        renderCookieBanner();

        injectConfigValues();
        setupRevealAnimations();

        refreshIcons();

        initDropdowns();
        initMobileMenu();
        initAccordions();
        initSmoothAnchors();
        initParallax();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.ExterraGlobal = {
        config: cfg,
        qs,
        qsa,
        escapeHtml,
        getValue,
        getCurrentPage,
        getServiceByPage,
        refreshIcons
    };
})();
