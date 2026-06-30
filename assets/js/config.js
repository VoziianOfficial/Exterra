'use strict';

window.EXTERRA_CONFIG = {
    brand: {
        name: 'Exterra',
        tagline: 'Independent siding provider matching',
        logo: 'assets/images/logo.svg',
        logoAlt: 'Exterra independent siding provider matching platform logo'
    },

    company: {
        name: 'Exterra',
        legalName: 'Exterra Provider Matching Platform',
        companyId: 'Update company ID before launch',
        address: 'Update business address before launch',
        serviceArea: 'Selected local service areas',
        phoneRaw: '+18005550142',
        phoneDisplay: '+1 (800) 555-0142',
        phoneButtonText: 'Call Exterra',
        email: 'support@exterra.example'
    },

    paths: {
        home: 'index.html',
        about: 'about.html',
        services: 'all-services.html',
        contact: 'contact.html',
        privacy: 'privacy-policy.html',
        terms: 'terms-of-service.html',
        cookies: 'cookie-policy.html'
    },

    disclaimers: {
        short:
            'Exterra is an independent siding provider-matching platform. Exterra does not perform siding work directly. Final pricing, scheduling, warranties, licensing, insurance, availability, and service terms are provided by participating providers.',

        footer:
            'Disclaimer: This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.'
    },

    footer: {
        description:
            'Exterra helps homeowners begin organized siding requests and compare available local provider options. Exterra is not a contractor, installer, repair company, manufacturer, retailer, or direct service provider.',
        copyright:
            '© 2026 Exterra. All rights reserved.'
    },

    services: [
        {
            id: 'siding-installation',
            title: 'Siding Installation',
            shortTitle: 'Installation',
            url: 'siding-installation.html',
            image: 'assets/images/service-1.jpg',
            icon: 'panel-top',
            summary:
                'Start a request for new siding installation and compare available provider options based on project scope, location, material preferences, and timing.',
            heroHeading: 'Siding Installation',
            heroText:
                'Submit your siding installation details and review available local provider options before deciding whether to continue.',
            overviewHeading: 'Start a clearer installation request.',
            overviewText:
                'A siding installation request may include new exterior coverage, material preferences, trim details, access considerations, and scheduling needs. Exterra helps organize the request so participating providers can review the details and discuss next steps directly with you.',
            categoryNote:
                'This category is designed for homeowners planning new exterior siding rather than repairing or replacing only isolated areas.'
        },
        {
            id: 'siding-replacement',
            title: 'Siding Replacement',
            shortTitle: 'Replacement',
            url: 'siding-replacement.html',
            image: 'assets/images/service-2.jpg',
            icon: 'replace',
            summary:
                'Compare provider options for siding replacement requests involving aging, damaged, outdated, or worn exterior materials.',
            heroHeading: 'Siding Replacement',
            heroText:
                'Share replacement details and compare available local provider options for your exterior siding project.',
            overviewHeading: 'Compare options for replacing old siding.',
            overviewText:
                'Replacement requests may involve removing worn siding, discussing material options, reviewing trim or panel changes, and comparing quote details. Exterra helps you begin with structured information, while participating providers supply final terms.',
            categoryNote:
                'This category fits projects where existing siding may need to be removed or updated across a larger area.'
        },
        {
            id: 'siding-repair',
            title: 'Siding Repair',
            shortTitle: 'Repair',
            url: 'siding-repair.html',
            image: 'assets/images/service-3.jpg',
            icon: 'wrench',
            summary:
                'Begin a siding repair request for damaged sections, storm impact, loose panels, gaps, cracks, or exterior wear.',
            heroHeading: 'Siding Repair',
            heroText:
                'Describe the siding issue and review available provider options that may discuss repair scope and timing.',
            overviewHeading: 'Organize repair details before comparing providers.',
            overviewText:
                'Repair requests may include visible damage, loose sections, water-related concerns, storm impact, or localized exterior wear. Exterra helps structure your request so available providers can discuss the potential scope directly with you.',
            categoryNote:
                'This category is useful for focused siding issues where a full replacement may not be the first request.'
        },
        {
            id: 'vinyl-siding',
            title: 'Vinyl Siding',
            shortTitle: 'Vinyl',
            url: 'vinyl-siding.html',
            image: 'assets/images/service-4.jpg',
            icon: 'layers',
            summary:
                'Explore vinyl siding provider options and compare discussions around style, maintenance, color direction, and project scope.',
            heroHeading: 'Vinyl Siding',
            heroText:
                'Submit vinyl siding preferences and compare available local provider options for material-specific requests.',
            overviewHeading: 'Review vinyl siding provider options.',
            overviewText:
                'Vinyl siding requests may focus on color, profile, maintenance expectations, replacement scope, and exterior style direction. Exterra helps you start with organized details before provider conversations.',
            categoryNote:
                'This category is focused on vinyl siding as a material preference for installation, replacement, or related exterior updates.'
        },
        {
            id: 'fiber-cement-siding',
            title: 'Fiber Cement Siding',
            shortTitle: 'Fiber Cement',
            url: 'fiber-cement-siding.html',
            image: 'assets/images/service-5.jpg',
            icon: 'blocks',
            summary:
                'Start a fiber cement siding request and compare providers that may discuss material details, exterior finish, and project requirements.',
            heroHeading: 'Fiber Cement',
            heroText:
                'Compare available provider options for fiber cement siding requests and review provider-supplied terms.',
            overviewHeading: 'Compare fiber cement siding discussions.',
            overviewText:
                'Fiber cement siding requests may include material expectations, installation considerations, trim details, finish direction, and warranty questions. Exterra helps homeowners organize these details before comparing local provider options.',
            categoryNote:
                'This category is designed for homeowners specifically interested in fiber cement siding materials and related provider discussions.'
        },
        {
            id: 'wood-composite-siding',
            title: 'Wood & Composite Siding',
            shortTitle: 'Wood & Composite',
            url: 'wood-composite-siding.html',
            image: 'assets/images/service-6.jpg',
            icon: 'tree-pine',
            summary:
                'Compare provider options for wood or composite siding projects involving texture, appearance, maintenance, and exterior design goals.',
            heroHeading: 'Wood Siding',
            heroText:
                'Share wood or composite siding preferences and compare available local provider options.',
            overviewHeading: 'Start a wood or composite siding request.',
            overviewText:
                'Wood and composite siding requests may involve facade texture, visual warmth, maintenance expectations, replacement scope, and exterior style preferences. Exterra helps organize the request before provider conversations begin.',
            categoryNote:
                'This category fits homeowners exploring wood-look, composite, or natural-style siding options.'
        }
    ],

    navigation: {
        main: [
            { label: 'Home', url: 'index.html' },
            { label: 'About', url: 'about.html' },
            { label: 'Services', url: 'all-services.html' },
            { label: 'Contact', url: 'contact.html' }
        ],

        legal: [
            { label: 'Privacy Policy', url: 'privacy-policy.html' },
            { label: 'Terms of Service', url: 'terms-of-service.html' },
            { label: 'Cookie Policy', url: 'cookie-policy.html' }
        ]
    },

    hero: {
        home: {
            kicker: 'Independent siding provider matching',
            heading: 'Smart Siding',
            text:
                'Exterra helps homeowners submit siding project details, compare available local provider options, and decide whether to continue with a provider.',
            image: 'assets/images/hero-home.jpg',
            primaryButton: {
                label: 'Start Your Request',
                url: 'contact.html'
            },
            secondaryButton: {
                label: 'View Services',
                url: 'all-services.html'
            }
        },

        about: {
            kicker: 'About the platform',
            heading: 'Why Exterra',
            text:
                'Learn how Exterra helps organize siding requests while staying independent from the providers homeowners may choose to contact.',
            image: 'assets/images/hero-about.jpg',
            primaryButton: {
                label: 'Explore Platform',
                url: '#platform'
            },
            secondaryButton: {
                label: 'Start Your Request',
                url: 'contact.html'
            }
        },

        services: {
            kicker: 'Browse siding categories',
            heading: 'All Services',
            text:
                'Review siding service categories and compare available provider options based on your project type, material interest, and location.',
            image: 'assets/images/hero-services.jpg',
            primaryButton: {
                label: 'Explore Categories',
                url: '#full-services'
            },
            secondaryButton: {
                label: 'Contact Exterra',
                url: 'contact.html'
            }
        },

        contact: {
            kicker: 'Submit project details',
            heading: 'Start Here',
            text:
                'Send your siding request details. Participating providers may contact you with provider-supplied information, availability, and terms.',
            image: 'assets/images/hero-contact.jpg',
            primaryButton: {
                label: 'Start Your Request',
                url: '#request-form'
            },
            secondaryButton: {
                label: 'View Services',
                url: 'all-services.html'
            }
        }
    },

    iconStrips: {
        home: [
            { label: 'Services', href: '#quick-needs', icon: 'layout-grid' },
            { label: 'Process', href: '#matching-process', icon: 'route' },
            { label: 'Materials', href: '#materials', icon: 'layers' },
            { label: 'Compare', href: '#compare', icon: 'list-checks' },
            { label: 'FAQ', href: '#faq', icon: 'circle-help' },
            { label: 'Contact', href: '#global-cta', icon: 'send' }
        ],

        about: [
            { label: 'Platform', href: '#platform', icon: 'badge-info' },
            { label: 'Values', href: '#values', icon: 'sparkles' },
            { label: 'How It Works', href: '#how-it-helps', icon: 'route' },
            { label: 'Checklist', href: '#checklist', icon: 'clipboard-check' },
            { label: 'FAQ', href: '#faq', icon: 'circle-help' },
            { label: 'Contact', href: '#global-cta', icon: 'send' }
        ],

        services: [
            { label: 'Installation', href: 'siding-installation.html', icon: 'panel-top' },
            { label: 'Replacement', href: 'siding-replacement.html', icon: 'replace' },
            { label: 'Repair', href: 'siding-repair.html', icon: 'wrench' },
            { label: 'Vinyl', href: 'vinyl-siding.html', icon: 'layers' },
            { label: 'Fiber Cement', href: 'fiber-cement-siding.html', icon: 'blocks' },
            { label: 'Wood', href: 'wood-composite-siding.html', icon: 'tree-pine' },
            { label: 'FAQ', href: '#faq', icon: 'circle-help' }
        ],

        contact: [
            { label: 'Request Form', href: '#request-form', icon: 'file-pen-line' },
            { label: 'Process', href: '#what-happens', icon: 'route' },
            { label: 'Service Types', href: '#popular-services', icon: 'layout-grid' },
            { label: 'Message Tips', href: '#message-tips', icon: 'message-square-text' },
            { label: 'FAQ', href: '#faq', icon: 'circle-help' },
            { label: 'Details', href: '#contact-details', icon: 'badge-info' }
        ],

        service: [
            { label: 'Overview', href: '#overview', icon: 'badge-info' },
            { label: 'Matching Path', href: '#matching-path', icon: 'route' },
            { label: 'Provider Factors', href: '#provider-discussion', icon: 'messages-square' },
            { label: 'Comparison', href: '#comparison-factors', icon: 'list-checks' },
            { label: 'FAQ', href: '#faq', icon: 'circle-help' },
            { label: 'Request', href: '#global-cta', icon: 'send' }
        ]
    },

    faq: {
        common: [
            {
                question: 'Does Exterra perform siding work directly?',
                answer:
                    'No. Exterra is an independent provider-matching platform. Siding work, pricing, scheduling, warranties, and final terms are handled by participating providers.'
            },
            {
                question: 'What happens after I submit a request?',
                answer:
                    'Your project details are organized so available participating providers may review the request and contact you with provider-supplied information.'
            },
            {
                question: 'Can I compare provider options?',
                answer:
                    'Yes. Exterra is designed to help homeowners compare available local provider options before deciding whether to continue.'
            },
            {
                question: 'Does availability vary by location?',
                answer:
                    'Yes. Provider availability, response times, services, and terms may vary by location and by provider.'
            }
        ],

        platform: [
            {
                question: 'Is Exterra a siding contractor?',
                answer:
                    'No. Exterra does not install, repair, inspect, manufacture, or sell siding. It helps homeowners begin a request and compare available provider options.'
            },
            {
                question: 'Why use an independent matching platform?',
                answer:
                    'A matching platform can help structure your request, clarify the project category, and make provider conversations easier to compare.'
            },
            {
                question: 'Does Exterra set provider prices?',
                answer:
                    'No. Pricing, quote scope, warranties, service terms, and scheduling are supplied by participating providers.'
            },
            {
                question: 'Should I verify provider details?',
                answer:
                    'Yes. Homeowners are responsible for verifying licensing, insurance, permits, warranties, and final agreement terms before hiring any provider.'
            }
        ],

        services: [
            {
                question: 'Which siding categories can I start with?',
                answer:
                    'You can begin with siding installation, replacement, repair, vinyl siding, fiber cement siding, or wood and composite siding.'
            },
            {
                question: 'Can I choose more than one siding category?',
                answer:
                    'Yes. If your request includes multiple needs, describe them in the message so providers can better understand the project scope.'
            },
            {
                question: 'Do material requests affect provider options?',
                answer:
                    'They may. Material preferences, project scope, location, and timing can influence which participating providers are available to discuss your request.'
            },
            {
                question: 'Are provider terms guaranteed?',
                answer:
                    'No. Provider terms, availability, warranties, and outcomes are not guaranteed by Exterra.'
            }
        ],

        request: [
            {
                question: 'Does submitting the form create a service agreement?',
                answer:
                    'No. Submitting a request does not create a service agreement. You choose whether to continue after reviewing provider-supplied terms.'
            },
            {
                question: 'What should I include in my message?',
                answer:
                    'Include your siding need, property type, preferred material, urgency, location, and whether photos are available.'
            },
            {
                question: 'Will providers contact me directly?',
                answer:
                    'Participating providers may contact you using the details submitted in your request.'
            },
            {
                question: 'Is Exterra responsible for provider work?',
                answer:
                    'No. Providers are independent, and Exterra does not warrant or guarantee work performed by any provider.'
            }
        ]
    },

    cta: {
        home: {
            heading: 'Ready to compare siding provider options?',
            text:
                'Start with organized project details and review available local provider options before deciding whether to continue.',
            primary: {
                label: 'Start Your Request',
                url: 'contact.html'
            },
            secondary: {
                label: 'Compare Options',
                url: 'all-services.html'
            }
        },

        about: {
            heading: 'Start with a clearer siding request.',
            text:
                'Use Exterra to organize your project details and compare available provider options with more confidence.',
            primary: {
                label: 'Start Your Request',
                url: 'contact.html'
            },
            secondary: {
                label: 'View Services',
                url: 'all-services.html'
            }
        },

        services: {
            heading: 'Find the siding category that fits.',
            text:
                'Browse siding categories, choose the closest match, and submit project details for provider review.',
            primary: {
                label: 'Start Your Request',
                url: 'contact.html'
            },
            secondary: {
                label: 'Explore Categories',
                url: 'all-services.html'
            }
        },

        contact: {
            heading: 'Send your siding request details.',
            text:
                'Share the basics of your project so participating providers may review the request and contact you with available options.',
            primary: {
                label: 'Start Your Request',
                url: '#request-form'
            },
            secondary: {
                label: 'View Services',
                url: 'all-services.html'
            }
        }
    },

    marquee:
        'INDEPENDENT SIDING PROVIDER MATCHING • COMPARE LOCAL OPTIONS • SUBMIT PROJECT DETAILS • REVIEW PROVIDER TERMS • AVAILABILITY MAY VARY BY LOCATION',

    contactForm: {
        endpoint: 'contact.php',
        recipientLabel: 'Exterra request desk',
        requiredConsentText:
            'I understand that Exterra is an independent provider-matching platform and that submitting this form does not create a service agreement.'
    }
};
