const globals = {};

const initialiseLenis = () => {
    gsap.config({
        force3D: true,
        nullTargetWarn: false,
        trialWarn: false,
    });

    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(TextPlugin);
    gsap.registerPlugin(GSDevTools);

    const lenis = new Lenis();
    globals.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    console.log('1. lenis initialised');
};

const loadSplashContent = () => {
    var svgNS = 'http://www.w3.org/2000/svg';

    let splash = document.querySelector('.splash');

    if (!splash) {
        console.log('splash element not detected; creating a new one...');
        splash = document.createElement('div');
        const insertBeforeThisNode = document.querySelector('nav');
        splash.classList.add('splash');
        document.body.insertBefore(splash, insertBeforeThisNode);
    }

    // create svg
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS(null, 'viewBox', '0 0 50 50');

    svg.setAttributeNS(null, 'preserveAspectRatio', 'none');
    svg.setAttributeNS(null, 'class', 'bg');

    const path = document.createElementNS(svgNS, 'path');
    path.id = 'mask';

    svg.appendChild(path);

    splash.prepend(svg);

    // splash.style.backgroundColor = 'transparent';
    console.log('2. splash loaded');
};

const splashOnEnter = () => {};

const animateSectionHeadings = () => {
    gsap.utils.toArray('h2').forEach((heading) => {
        gsap.set(heading, { x: -55, opacity: 0 });
        gsap.to(
            heading,
            {
                scrollTrigger: {
                    trigger: heading,
                },
                opacity: 1,
                x: 0,
                ease: 'power2.out',
                duration: globals.isDesktop ? 2 : 1,
            },
            0
        );
    });

    console.log('animateSectionHeadings');
};

const animateParagraphs = () => {};

const animateHeader = () => {
    const header = document.querySelector('header');
    const elements = {
        '#h-1': {
            transform: 'translateX(-0.5em)',
            opacity: 0,
        },
        '#h-2': {
            transform: 'translateX(0.5em)',
            opacity: 0,
        },
        '#h-tag': {
            opacity: 0,
        },
    };
    if (header.classList.contains('index')) {
        const { viewportHeight, isDesktop } = globals;
        // animate h1 on index page
        Object.entries(elements).forEach(([id, styles]) => {
            const elem = document.querySelector(id);
            if (elem) {
                gsap.to(id, {
                    scrollTrigger: {
                        scrub: true,
                        start: 'top top',
                        trigger: document.body,
                        end: () => `${globals.viewportHeight}px`,
                    },
                    ...styles,
                });
            }
        });

        // animate scroll indicator o index page

        const end = isDesktop
            ? `+=${viewportHeight}`
            : `+=${viewportHeight * 2.5}`;
        const scrollArrow = document.getElementById('scroll-arrow'),
            scrollText = document.getElementById('scroll-text-wrapper'),
            circle = document.querySelector('.circle'),
            scrollBar = document.getElementById('scrollbar');

        if (scrollArrow) {
            gsap.to(scrollArrow, {
                scrollTrigger: {
                    trigger: 'main',
                    start: 'top 100%',
                    end: end,
                    scrub: true,
                },
                y: 100,
                opacity: 0,
            });
        }

        if (scrollText) {
            gsap.to(scrollText, {
                scrollTrigger: {
                    trigger: 'main',
                    start: 'top 100%',
                    end: viewportHeight,
                    scrub: true,
                },
                opacity: isDesktop ? 1 : 0,
                rotation: 180,
            });
        }

        if (!!circle) {
            circle.addEventListener('click', () => {
                globals.lenis.scrollTo('#main', { duration: 1, lerp: 0.1 });
            });
        }
    } else {
    }
};

const animateScrollBar = () => {};

// DOM loaded
document.addEventListener('DOMContentLoaded', (event) => {
    globals.viewportHeight = window.innerHeight;
    globals.pageHeight =
        document.height !== undefined
            ? document.height
            : document.body.offsetHeight;

    const mediaQuery = window.matchMedia('(min-width: 768px)');

    globals.isDesktop = mediaQuery.matches;

    // 1.initialise lenis;
    initialiseLenis();
    // 2. load splash content
    // loadSplashContent();
    // 3. add headings anims
    animateSectionHeadings();

    animateHeader();
});

// all resources loaded
// run splash anim
window.addEventListener('load', function () {});
