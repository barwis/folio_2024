gsap.config({
    force3D: true,
    nullTargetWarn: false,
    trialWarn: false,
});

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrambleTextPlugin);
gsap.registerPlugin(SplitText);

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
window.timelines = [];

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

            gsap.fromTo(
                id,
                { opacity: 1, transform: 'translateX(0)' },
                {
                    scrollTrigger: {
                        scrub: true,
                        start: 'top top',
                        trigger: hero,
                        end: () => `${window.viewportHeight}px`,
                    },
                    ...styles,
                }
            );
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
        const paragraphs = gsap.utils.toArray('.fact section  p');

        paragraphs.forEach((paragraph, index) => {
            var split = new SplitText(paragraph, { type: 'lines' });

            const val =
                parseFloat(window.getComputedStyle(paragraph).fontSize) * 2;
            gsap.set(paragraph, { opacity: 1 });

            gsap.set(split.lines, {
                opacity: 0,
                rotationX: -val,
                transformOrigin: `top center -${val}`,
            });

            gsap.to(split.lines, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 70%',
                    scrub: 1,
                    end: `+=${paragraph.getBoundingClientRect().height}`,
                },
                opacity: 1,
                rotationX: 0,
                duration: 0.3,
                stagger: 0.05,
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
            const workPadding = parseFloat(
                window.getComputedStyle(work).paddingTop
            );

            var mapper = gsap.utils.mapRange(
                0,
                1,
                -workPadding * containerOffset,
                workPadding * containerOffset
            );

            gsap.to(pictureContainer, {
                scrollTrigger: {
                    trigger: item,
                    scrub: true,
                    ease: 'none',
                    onUpdate: ({ progress }) => {
                        gsap.set(pictureContainer, {
                            y: mapper(progress),
                        });
                    },
                    end: () =>
                        `+=${
                            window.innerHeight +
                            item.getBoundingClientRect().height
                        }px`,
                },
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

            gsap.to(img, {
                scrollTrigger: {
                    trigger: item,
                    scrub: true,
                    ease: 'none',
                    onUpdate: ({ progress }) => {
                        gsap.set(img, { y: mapper(progress) });
                    },
                    end: () =>
                        `+=${
                            window.innerHeight +
                            item.getBoundingClientRect().height * 1
                        }px`,
                },
            });

            // const [picture, img] = ['picture', 'img'].map((selector) =>
            //     item.querySelector(selector)
            // );
            // const work = item.closest('.work section');
            // const workContainerHeight = work.getBoundingClientRect().height;
            // const possiblePadding = parseFloat(
            //     window.getComputedStyle(work).paddingTop
            // );
            // // reset
            // // container parallax
            // if (item.classList.contains('parallax') && window.isDesktop) {
            //     const containerOffset = this.getItemOffset(item);
            //     const diff = containerOffset * possiblePadding;
            //     gsap.set(item, {
            //         y: `${diff * -1}`,
            //         opacity: 1,
            //     });
            //     gsap.to(item, {
            //         scrollTrigger: {
            //             trigger: work,
            //             scrub: true,
            //             ease: 'none',
            //             onUpdate: ({ progress }) => {
            //                 const actualXTransform =
            //                     diff + diff * progress * -2;
            //                 // console.log('update', diff + diff * progress * -2);
            //                 gsap.set(item, { y: actualXTransform });
            //             },
            //             end: () =>
            //                 `+=${workContainerHeight * 2 + possiblePadding}`,
            //         },
            //     });
            // }
            // if (item.classList.contains('work-item--full-bleed')) {
            //     const w = img.closest('.work section');
            //     gsap.set(picture, { width: '120%', height: '120%' });
            //     w.style.outline = '1px solid red';
            //     console.log('w', w);
            //     const _workContainerHeight = w.getBoundingClientRect().height;
            //     gsap.set(img, { y: `-10%` });
            //     const diff = -50;
            //     gsap.to(img, {
            //         scrollTrigger: {
            //             trigger: w,
            //             scrub: true,
            //             ease: 'none',
            //             start: start,
            //             markers: true,
            //             onUpdate: ({ progress }) => {
            //                 const actualXTransform =
            //                     diff + diff * progress * -2;
            //                 console.log('update', diff + diff * progress * -2);
            //                 // gsap.set(item, { y: actualXTransform });
            //             },
            //             end: () =>
            //                 `+=${_workContainerHeight + window.innerHeight}px`,
            //         },
            //     });
            // }
            // img parallax
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
        if (window.isDesktop) return;
        const logo = document.querySelector('.logo');

        if (!logo) return;

        gsap.to(document.body, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                onUpdate: (self) => {
                    if (self.direction === 1) {
                        logo.classList.add('scrolling-down');
                        logo.classList.remove('scrolling-up');
                    } else {
                        logo.classList.add('scrolling-up');
                        logo.classList.remove('scrolling-down');
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
            console.log('no splash', this.elements.splash);
            console.log('splash element not detected');
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
            timeScale: 2,
            onComplete: () => {
                onCompleteCb();
            },
        });

        const { mask, main } = this.elements;

        const { mask_from_right, mask_empty } = this.paths;

        if (!this.elements.main) {
            this.elements.main = document.querySelector('.toAnim');
        }

        mask.setAttributeNS(null, 'd', mask_from_right);
        splash.style.backgroundColor = 'transparent';

        // gsap

        window.customTimeLine
            .add('blueGreenSpin')
            .to(
                '.splash .icon',
                {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'none',
                },
                0
            )
            .to(
                mask,
                {
                    morphSVG: mask_empty,
                    duration: 0.5,
                    ease: 'power4.inOut',
                },
                0.5
            );
    },
    leave: function (onCompleteCb = () => {}) {
        // const { mask, main, splash } = this.elements;
        const elems = getAllRequiredElements(['.splash', '#mask', '.toAnim']);
        console.log('elems', elems);
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
        console.log('mask', mask);

        timeline.to(
            mask,
            {
                morphSVG: mask_from_left,
                duration: 1,
                ease: 'power4.inOut',
            },
            'reveal'
        );
    },
};

function Marquee(selector, speed) {
    const parentSelector = document.querySelector(selector);
    if (!parentSelector) return;
    const firstElement = parentSelector.children[0];
    console.log(firstElement);
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

    pageTransition.enter(() => {
        const t0 = performance.now();
        header.animateScrollBar();
        header.animateScrollIndicator();
        header.animateHeroSection();
        const animate = header.randomiseHeaderText();
        if (animate) animate();
        main.animateParagraphs();
        main.animateSectionHeadings();
        main.animateSkillBars();
        caseStudy.animateQuote();

        const t1 = performance.now();
        console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
        main.animateWorks();
        gsap.utils.toArray('a[href]').forEach((a) => {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const href = e.currentTarget.getAttribute('href');
                console.log('nope', e.currentTarget.getAttribute('href'));

                pageTransition.leave(() => {
                    window.location.href = href;
                });
            });
        });
    });
};
