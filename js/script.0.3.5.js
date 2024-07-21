gsap.config({
    force3D: true,
    nullTargetWarn: false,
    trialWarn: false,
});

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrambleTextPlugin);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(EasePack);

const lenis = new Lenis({
    lerp: 0,
    syncTouch: true,
    smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
window.timelines = [];

if (Array.prototype.revEach === undefined) {
    Object.defineProperty(Array.prototype, 'revEach', {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function (func) {
            var i;
            var len = this.length - 1;
            for (i = len; i >= 0; i--) {
                func(this[i], i, this);
            }
        },
    });
}

function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function () {
        if (copy.length < 1) {
            copy = array.slice(0);
        }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
}

function createRipple(event) {
    if (window.isDesktop && button.href) {
        window.location.href = button.href;
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const itemContainer = event.currentTarget.querySelector('.item-container');
    const button = event.currentTarget;
    const boundingRect = button.getBoundingClientRect();
    const diameter = Math.max(boundingRect.width, boundingRect.height);

    // calculate ripple position
    const diffX = Math.round(event.clientX - boundingRect.left - diameter / 2);
    const diffY = Math.round(event.clientY - boundingRect.top - diameter / 2);

    // generate ripple element
    const circle = document.createElement('span');

    circle.classList.add('ripple');
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${diffX}px`;
    circle.style.top = `${diffY}px`;

    // remove previous ripple if exists
    const ripple = button.getElementsByClassName('ripple')[0];

    if (ripple) {
        ripple.remove();
    }

    // append new ripple element
    if (itemContainer) {
        itemContainer.appendChild(circle);
    } else {
        button.appendChild(circle);
    }

    setTimeout(() => {
        if (button.href) {
            window.location.href = button.href;
        }
    }, 300);
}

function allElementsfound(elems) {
    return ![elems].every((element) => !!element);
}

function getAllRequiredElements(selectors) {
    const elems = Array.prototype.map.call(
        selectors,
        document.querySelector,
        document
    );

    return elems.every((element) => !!element) && elems;
}

const header = {
    text: [
        ['and I make', 'the Web', '( like... really! )'],
        ["and I'm a", 'web magican', '╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ'],
        ['and I make pixels', 'dance'],
        [
            'and I debug more than',
            'I sleep',
            "( I really shouldn't though... )",
        ],
        ['and I turn coffee', 'into code', "( yeah, I'm THAT cool! )"],
        ['and I prefer spaces', 'over tabs', '( fight me! )'],
        ['and I turn caffeine', 'into websites', '( weird flex, but OK... )'],
    ],

    versionFadeOut: function () {
        const versionElem = document.querySelector('.version');
        const main = document.querySelector('main');
        if (!versionElem) return;

        gsap.to(versionElem, {
            scrollTrigger: {
                trigger: main,
                end: () => window.innerHeight,
                scrub: true,
            },
            opacity: 0,
        });
    },

    randomiseHeaderText: function () {
        const randomTagLine = randomNoRepeats(this.text);
        // get elements

        const elems = getAllRequiredElements(['#sh1', '#sh2', '#sh3']);
        if (!elems) return;

        const [span1, span2, span3] = elems;

        // prevent FOUC
        gsap.set(span1, { opacity: 1 });
        gsap.set(span2, { opacity: 1 });
        gsap.set(span3, { opacity: 0 });

        const animate = () => {
            const defaultScrambleTextProps = {
                chars: 'lowerCase',
                tweenLength: true,
                duration: 2,
            };

            const randomText = randomTagLine();
            const [span1text, span2text, span3text = ''] = randomText;

            // clear text
            [span1, span2, span3].forEach((span) => (span.innerHTML = ''));

            // update span3 - this one isn't going to be scrambled

            gsap.set(span3, { opacity: 0 });
            span3.innerHTML = span3text;

            // calculate scramble dudation based on the length of given text
            const cycleDuration = parseFloat(
                [span1, span2, span3].join('').length / 30
            ).toFixed(2);

            gsap.timeline({
                defaults: { duration: cycleDuration, ease: 'none' },
            })
                .to(span1, {
                    scrambleText: {
                        text: span1text,
                        ...defaultScrambleTextProps,
                    },
                })
                .to(span2, {
                    scrambleText: {
                        text: span2text,
                        ...defaultScrambleTextProps,
                    },
                })
                .to(span3, { opacity: 1, duration: 0.2, delay: 1 });

            setTimeout(animate, cycleDuration * 1000 + 5000);
        };

        return animate;
    },
    animateHeroSection: function () {
        const hero = document.querySelector('header.index');

        const elems = getAllRequiredElements(['#sh1', '#sh2', '#sh3']);
        if (!elems) return;

        // prevent FOUC
        elems.forEach((span) => (span.innerHTML = ''));

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

        Object.entries(elements).forEach(([id, styles]) => {
            const elem = document.querySelector(id);
            const end =
                elem.getBoundingClientRect().top +
                elem.getBoundingClientRect().height;

            gsap.to(id, {
                scrollTrigger: {
                    scrub: 0.5,
                    start: 'top top',
                    end: () => `+=${window.innerHeight}`,
                    trigger: hero,
                },
                ...styles,
                ease: 'none',
            });
        });
    },
    animateScrollIndicator: function () {
        const elems = getAllRequiredElements([
            '#scroll-arrow',
            '#scroll-text-wrapper',
            '.scroll-down-indicator',
            'main',
        ]);
        if (!elems) return;

        const [
            scrollDownArrow,
            scrollDownCircularText,
            scrollDowncontainer,
            main,
        ] = elems;

        // end marker based on viewport
        const scrollIndicatorEndPos = window.isDesktop
            ? `+=${window.viewportHeight}`
            : `+=${window.viewportHeight * 2.5}`;

        // handle FOUC
        gsap.set(scrollDowncontainer, { opacity: 1 });

        gsap.to(scrollDownArrow, {
            scrollTrigger: {
                trigger: main,
                end: scrollIndicatorEndPos,
                scrub: true,
            },
            y: 100,
            opacity: 0,
        });

        gsap.to(scrollDownCircularText, {
            scrollTrigger: {
                trigger: main,
                end: window.viewportHeight,
                scrub: true,
            },
            opacity: window.isDesktop ? 1 : 0,
            rotation: 180,
            ease: 'none',
        });

        scrollDowncontainer.addEventListener('click', () => {
            lenis.scrollTo('#main', { duration: 1, lerp: 0.1 });
        });
    },
    animateScrollBar: function () {
        const scrollBar = document.getElementById('scrollbar');

        if (!window.isDesktop || !scrollBar) return;
        gsap.to(scrollBar, {
            scrollTrigger: {
                scrub: true,
                start: 'top top',
                end: () => `${window.pageHeight - window.viewportHeight}px`,
            },
            height: `${window.viewportHeight}px`,
            ease: 'none',
        });
    },
};

const main = {
    animateSectionHeadings: function () {
        gsap.utils.toArray('h2').forEach((heading) => {
            const t = gsap.timeline({
                scrollTrigger: {
                    trigger: heading,
                    start: `top bottom-=${
                        heading.getBoundingClientRect().height
                    }px`,
                },
            });
            t.to(heading, {
                opacity: 1,
                x: 0,
                ease: 'power2.out',
                duration: window.isDesktop ? 2 : 1,
            });
        });
    },

    animateParagraphs: function () {
        const initialYOffset = window.isDesktop ? '2em' : '20px';
        const paragraphs = gsap.utils.toArray(
            '.fact section  p, .fact .diamond'
        );

        paragraphs.forEach((paragraph, index) => {
            const e =
                paragraph.tagName === 'P'
                    ? new SplitText(paragraph, { type: 'lines' }).lines
                    : paragraph;

            const val =
                parseFloat(window.getComputedStyle(paragraph).fontSize) * 2;

            gsap.set(paragraph, { opacity: 1 });

            gsap.set(e, {
                opacity: 0,
                y: val * 2,
            });

            gsap.to(e, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 80%',
                    scrub: 1,
                    end: `+=${window.innerHeight * 0.3}`,
                    duration: 2,
                },
                opacity: 1,
                ease: 'circ.out',
                y: 0,
                stagger: 0.1,
            });
        });
    },

    getItemOffset: function (item) {
        if (item.classList.contains('work-item--wide')) return 1;
        if (item.classList.contains('work-item--narrow')) return -1;
        return 0;
    },

    animateIndexShowcase: function () {
        const items = gsap.utils.toArray('.work-item.slide-up');

        items.forEach((item, index) => {
            const pictureContainer = item.querySelector('.picture-container');
            const picture = item.querySelector('picture');
            const img = item.querySelector('img');

            const start = window.isDesktop ? 'top 80%' : 'top 80%';

            const { height: pictureContainerHeight } =
                pictureContainer.getBoundingClientRect();

            const imageTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: start,
                    end: () =>
                        window.viewportHeight +
                        item.getBoundingClientRect().height,
                },
            });

            imageTimeline.to(pictureContainer, {
                opacity: 1,
                y: 0,
                ease: 'power3.out',
                duration: window.isDesktop ? 1 : 1,
            });
        });
    },

    animateCaseStudyParallax: function () {
        const items = gsap.utils.toArray('.work-item.parallax');

        items.forEach((item, index) => {
            const containerOffset = -this.getItemOffset(item);
            const pictureContainer = item.querySelector('.picture-container');

            const work = item.closest('.padded');
            const workPadding =
                parseFloat(window.getComputedStyle(work).paddingTop) * 2;

            var mapper = gsap.utils.mapRange(
                0,
                1,
                -workPadding * containerOffset,
                workPadding * containerOffset
            );
            gsap.set(pictureContainer, { y: -workPadding * containerOffset });
            gsap.to(pictureContainer, {
                scrollTrigger: {
                    trigger: item,
                    scrub: true,
                    start: 'top bottom',
                    end: 'bottom top',
                },
                ease: 'none',
                y: workPadding * containerOffset,
            });
        });
    },

    animateWorks: function () {
        this.animateIndexShowcase();
        if (isDesktop) {
            this.animateCaseStudyParallax();
        }
        // elements
        const items = gsap.utils.toArray('.work-item');

        // settings
        const start = window.isDesktop ? 'top 80%' : 'top 80%';

        items.forEach((item, index) => {
            const pictureContainer = item.querySelector('.picture-container');
            const picture = item.querySelector('picture');
            const img = item.querySelector('img');

            const { height: pictureContainerHeight } =
                pictureContainer.getBoundingClientRect();

            const imgOffset = pictureContainerHeight * 0.2;

            gsap.set(picture, {
                height: pictureContainerHeight * 1.2,
                opacity: 1,
            });

            var mapper = gsap.utils.mapRange(0, 1, -imgOffset, imgOffset);
            gsap.set(img, { y: -imgOffset });
            gsap.to(img, {
                scrollTrigger: {
                    trigger: item,
                    scrub: true,
                    start: 'top bottom',
                    end: 'bottom top',
                },
                y: imgOffset,
                ease: 'none',
            });
        });
    },
    animateSkillBars: function () {
        const skillBars = gsap.utils.toArray('.bar');

        skillBars.forEach((bar) => {
            const skillBar = bar.firstElementChild;

            gsap.set(bar.firstElementChild, { width: 0 });

            const width = parseInt(bar.dataset.years) * 10;

            var t = gsap.to(skillBar, {
                scrollTrigger: {
                    trigger: skillBar,
                    start: 'top 80%',
                    ease: 'power4.out',
                },
                width: `${width}%`,
            });
        });
    },
    animateLogo: function () {
        // if (window.isDesktop) return;
        const logo = document.querySelector('.logo');

        if (!logo) return;

        gsap.to(document.body, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                onUpdate: (self) => {
                    if (self.direction === 1) {
                        document.body.classList.add('scrolling-down');
                        document.body.classList.remove('scrolling-up');
                        if (!window.isDesktop) {
                            logo.classList.add('scrolling-down');
                            logo.classList.remove('scrolling-up');
                        }
                    } else {
                        document.body.classList.add('scrolling-up');
                        document.body.classList.remove('scrolling-down');
                        if (!window.isDesktop) {
                            logo.classList.add('scrolling-up');
                            logo.classList.remove('scrolling-down');
                        }
                    }
                },
            },
        });
    },
};

const caseStudy = {
    animateHeroImage: function () {
        const heroImage = document.querySelector('.header--big .header__image');
        if (!heroImage) return;

        gsap.to(heroImage, {
            scrollTrigger: {
                start: 'top top',
                trigger: heroImage,
                scrub: true,
                end: () => `${window.viewportHeight}px`,
                // toggleActions: "play reset play reset"
            },
            y: `-50%`,
        });
    },
    animateQuote: () => {
        const [quote, recommendationContainer] = [
            '.quote',
            '.recommendations',
        ].map((s) => document.querySelector(s));

        if (!quote) {
            return;
        }

        gsap.set(quote, { y: window.isDesktop ? '0%' : '-40%' });
        gsap.to(quote, {
            scrollTrigger: {
                trigger: recommendationContainer,
                scrub: true,
                end: () =>
                    `${
                        window.viewportHeight +
                        recommendationContainer.getBoundingClientRect().height
                    }px`,
            },
            y: window.isDesktop ? '30%' : '40%',
        });
    },
};

const pageTransition = {
    paths: {
        mask_from_right: `M0,0 L80,0 A 60,30,0,0,0,80,50 L 0,50 L 0,0Z`,
        mask_from_left: `M0,0 L80,0 A 60 30 0 0 1 80 50 L 0,50 L 0,0 Z`,
        mask_empty: 'M0,0 L0,0 A 1 80 0 0 0 0 50 L0,50 L0,0Z',
    },
    elements: {
        splash: document.querySelector('.splash'),
        mask: document.getElementById('mask'),
        main: document.querySelector('.toAnim'),
    },
    init: function () {
        var svgNS = 'http://www.w3.org/2000/svg';

        let splash = document.querySelector('.splash');

        if (!splash) {
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

        this.elements.mask = path;
        this.elements.splash = splash;
        this.elements.main = document.querySelector('.toAnim');
        splash.prepend(svg);
    },

    enter: function (onCompleteCb = () => {}) {
        let splash = document.querySelector('.splash');
        window.customTimeLine = new gsap.timeline({
            id: 'pageTransition.enter',
            timeScale: 1,
            onComplete: () => {
                onCompleteCb();
            },
        });

        const { mask } = this.elements;

        const { mask_from_right, mask_empty } = this.paths;

        if (!this.elements.main) {
            this.elements.main = document.querySelector('.toAnim');
        }

        const indexHeader = document.querySelector('header h1');
        const smallHeader = document.querySelector(
            '.header--small .header__text'
        );
        const toAnim = document.querySelector('.toAnim');

        mask.setAttributeNS(null, 'd', mask_from_right);
        splash.style.backgroundColor = 'transparent';

        // gsap

        window.customTimeLine
            .add('blueGreenSpin')
            .to(
                '.splash .icon',
                {
                    opacity: 0,
                    duration: 1,
                    ease: 'none',
                },
                0
            )
            .to(
                mask,
                {
                    morphSVG: mask_empty,
                    duration: 1,
                    ease: 'power4.inOut',
                },
                0.5
            )
            .to(
                toAnim,
                {
                    x: 0,
                    duration: 1.3,
                    ease: 'expoScale(1, 2)',
                },
                0.3
            )
            .to(
                toAnim,
                {
                    opacity: 1,
                    duration: 1.5,
                    ease: 'expoScale(1, 2)',
                },
                1
            );

        if (indexHeader && isDesktop) {
            window.customTimeLine
                .to(
                    indexHeader,
                    {
                        width: '55%',
                        duration: 1.5,
                        ease: 'expoScale(1, 2)',
                    },
                    0
                )
                .to(
                    indexHeader,
                    {
                        opacity: 1,
                        duration: 1.5,
                        ease: 'expoScale(1, 2)',
                    },
                    1
                );
        } else {
            gsap.set(indexHeader, { opacity: 0, x: '10vh' });
            window.customTimeLine
                .to(
                    indexHeader,
                    {
                        x: 0,
                        duration: 1.5,
                        ease: 'expoScale(1, 2)',
                    },
                    0
                )
                .to(
                    indexHeader,
                    {
                        opacity: 1,
                        duration: 1.5,
                        ease: 'expoScale(1, 2)',
                    },
                    1
                );
        }
        if (smallHeader) {
            gsap.set(smallHeader, {
                x: isDesktop ? '10vw' : '10vh',
                opacity: 0,
            });

            window.customTimeLine
                .to(
                    smallHeader,
                    {
                        x: 0,
                        duration: 1.3,
                        ease: 'expoScale(1, 2)',
                    },
                    0.3
                )
                .to(
                    smallHeader,
                    {
                        opacity: 1,
                        duration: 1.5,
                        ease: 'expoScale(1, 2)',
                    },
                    1
                );
        }
    },
    leave: function (onCompleteCb = () => {}) {
        // const { mask, main, splash } = this.elements;
        const elems = getAllRequiredElements(['.splash', '#mask', '.toAnim']);
        if (!elems) return;

        const [splash, mask, main] = elems;

        const { mask_from_left, mask_empty } = this.paths;

        var timeline = new TimelineMax({
            id: 'pageTransition.leave',
            onComplete: () => {
                splash.style.backgroundColor = 'black';
                mask.removeAttributeNS(null, 'd');
                onCompleteCb();
            },
        });

        gsap.set(main, { x: 0, opacity: 1 });
        mask.setAttributeNS(null, 'd', mask_empty);

        timeline.to(
            mask,
            {
                morphSVG: mask_from_left,
                duration: 1,
                ease: 'power4.inOut',
            },
            0
        );
    },
};

function Marquee(selector, speed) {
    const parentSelector = document.querySelector(selector);
    if (!parentSelector) return;
    const firstElement = parentSelector.children[0];
    let i = 0;

    setInterval(function () {
        firstElement.style.marginLeft = `-${i}px`;
        if (i > firstElement.clientWidth) {
            i = 0;
        }
        i = i + speed;
    }, 0);
}

window.addEventListener('load', function () {
    console.log('all resources loaded');

    // override anchors
});

// DOM loaded
function docReady(fn) {
    // see if DOM is already available
    if (
        document.readyState === 'complete' ||
        document.readyState === 'interactive'
    ) {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

docReady(() => {
    pageTransition.init();

    window.viewportHeight = window.innerHeight;
    window.pageHeight =
        document.height !== undefined
            ? document.height
            : document.body.offsetHeight;

    const mediaQuery = window.matchMedia('(min-width: 768px)');

    window.isDesktop = mediaQuery.matches;
});

window.onload = function () {
    // code to run animation.
    header.animateHeroSection();
    header.animateScrollBar();
    header.animateScrollIndicator();
    main.animateSectionHeadings();
    main.animateParagraphs();
    main.animateSkillBars();
    caseStudy.animateQuote();
    main.animateWorks();

    gsap.utils.toArray('a[href]').forEach((a) => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const href = e.currentTarget.getAttribute('href');

            pageTransition.leave(() => {
                window.location.href = href;
            });
        });
    });

    pageTransition.enter(() => {
        const t0 = performance.now();
        header.versionFadeOut();

        // main.updateHash();
        main.animateLogo();
        const animate = header.randomiseHeaderText();
        if (animate) animate();

        const t1 = performance.now();
        console.log(`took ${t1 - t0} milliseconds.`);
    });
};
