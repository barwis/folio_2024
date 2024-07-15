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
        function shuffleArray(array) {
            let currentIndex = array.length,
                temporaryValue,
                randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        function* getRandomArrayItem(array) {
            let index = Infinity;
            const items = array.slice(); //take a copy of the array;

            while (true) {
                if (index >= array.length) {
                    shuffleArray(items);
                    index = 0;
                }

                yield items[index++];
            }
        }

        // get elements
        const span1 = document.querySelector('#sh1');
        const span2 = document.querySelector('#sh2');
        const span3 = document.querySelector('#sh3');

        if (!span1 || !span2) return;

        const animate = () => {
            const defaultScrambleTextProps = {
                chars: 'lowerCase',
                tweenLength: true,
                duration: 2,
            };

            const randomText = getRandomArrayItem(this.text);

            // clear elements' text
            span1.innerHTML = '';
            span2.innerHTML = '';
            span3.innerHTML = '';
            gsap.set(span3, { opacity: 0 });

            const textToShuffle = randomText.next().value;

            span3.innerHTML = textToShuffle[2] || '';

            // calculate scramble dudation based on a length of the text
            const newDuration = parseFloat(
                textToShuffle.join('').length / 30
            ).toFixed(2);

            let tlscramble = gsap.timeline({
                defaults: { duration: newDuration, ease: 'none' },
            });

            tlscramble
                .to(span1, {
                    scrambleText: {
                        text: textToShuffle[0],
                        ...defaultScrambleTextProps,
                    },
                })
                .to(span2, {
                    scrambleText: {
                        text: textToShuffle[1],
                        ...defaultScrambleTextProps,
                    },
                })
                .to(span3, { opacity: 1, duration: 0.2, delay: 1 });

            setTimeout(animate, newDuration * 1000 + 5000);
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

            if (elem && hero) {
                gsap.to(id, {
                    scrollTrigger: {
                        scrub: true,
                        start: 'top top',
                        trigger: hero,
                        end: () => `${window.viewportHeight}px`,
                    },
                    ...styles,
                });
            }
        });
    },
    animateScrollIndicator: function () {
        // const [scrollArrow, scrollText, circle] = Array.prototype.map.apply(
        //     ['#scroll-arrow', '#scroll-text-wrapper', '.circle'],
        //     [document.querySelector, document]
        // );

        const [scrollArrow, scrollText, circle] = Array.prototype.map.call(
            ['#scroll-arrow', '#scroll-text-wrapper', '.circle'],
            document.querySelector,
            document
        );

        // end marker based on viewport
        const end = window.isDesktop
            ? `+=${window.viewportHeight}`
            : `+=${window.viewportHeight * 2.5}`;

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
                    end: window.viewportHeight,
                    scrub: true,
                },
                opacity: window.isDesktop ? 1 : 0,
                rotation: 180,
            });
        }

        if (!!circle) {
            circle.addEventListener('click', () => {
                lenis.scrollTo('#main', { duration: 1, lerp: 0.1 });
            });
        }
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
        // section headings

        gsap.utils.toArray('h2').forEach((heading) => {
            // gsap.set(heading, { x: -55, opacity: 0 });

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

            let paragraphAnimation = gsap.timeline({
                id: `paragraph-${index}`,
                // timeScale: 2,
                scrollTrigger: {
                    trigger: paragraph,
                },
            });
            gsap.set(paragraph, { opacity: 1 });
            paragraphAnimation.fromTo(
                split.lines,
                {
                    opacity: 0,
                    rotationX: -120,
                    transformOrigin: 'top center -150',
                },
                {
                    opacity: 1,
                    rotationX: 0,
                    transformOrigin: 'top center -150',
                    duration: 0.5,
                    stagger: 0.1,
                }
            );
        });
    },

    getItemOffset: function (item) {
        if (item.classList.contains('work-item--wide')) return 1;
        if (item.classList.contains('work-item--narrow')) return -1;
        return 0;
    },

    animateIndexShowcase: function () {
        const items = gsap.utils.toArray('.work-item.slide-up');
        console.log('items', items);

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

            gsap.set(picture, {
                height: pictureContainerHeight * 1.2,
            });

            imageTimeline.to(pictureContainer, {
                opacity: 1,
                y: 0,
                ease: 'power3.out',
                duration: window.isDesktop ? 1 : 1,
            });

            const diff = pictureContainerHeight * 0.2;

            const hDiff = (window.innerHeight - pictureContainerHeight) / 10;
            console.log(diff, hDiff);

            gsap.set(img, { y: -diff });

            gsap.to(img, {
                scrollTrigger: {
                    trigger: item,
                    scrub: true,
                    ease: 'none',
                    markers: index === 1,
                    onUpdate: ({ progress }) => {
                        const actualXTransform = diff * 2 * progress - diff;

                        gsap.set(img, { y: actualXTransform * 2 });
                    },
                    end: () =>
                        `+=${
                            window.innerHeight +
                            item.getBoundingClientRect().height
                        }px`,
                },
                y: diff,
            });
        });
    },

    animateWorks: function () {
        this.animateIndexShowcase();
        // elements
        const items = gsap.utils.toArray('.work-item');

        // settings
        const start = window.isDesktop ? 'top 80%' : 'top 80%';

        items.forEach((item, index) => {
            const [picture, img] = ['picture', 'img'].map((selector) =>
                item.querySelector(selector)
            );

            const work = item.closest('.work section');

            const workContainerHeight = work.getBoundingClientRect().height;

            const possiblePadding = parseFloat(
                window.getComputedStyle(work).paddingTop
            );

            // reset

            if (item.classList.contains('slide-up')) {
                // const imageTimeline = gsap.timeline({
                //     scrollTrigger: {
                //         trigger: item,
                //         start: start,
                //         end: window.viewportHeight + itemHeight,
                //     },
                // });
                // gsap.set(pictureContainer, { y: 200, opacity: 0 });
                // imageTimeline.to(pictureContainer, {
                //     opacity: 1,
                //     y: 0,
                //     ease: 'power3.out',
                //     duration: window.isDesktop ? 1 : 1,
                // });
                // gsap.set(img, { y: `${possiblePadding * -2}` });
                // gsap.to(img, {
                //     scrollTrigger: {
                //         trigger: work,
                //         scrub: true,
                //         ease: 'none',
                //         start: start,
                //         markers: index === 1,
                //         end: () =>
                //             `+=${workContainerHeight * 2 + possiblePadding}px`,
                //         // toggleActions: "play reset play reset"
                //     },
                //     y: `${possiblePadding * 2}`,
                // });
            }

            // container parallax
            if (item.classList.contains('parallax') && window.isDesktop) {
                const containerOffset = this.getItemOffset(item);
                const diff = containerOffset * possiblePadding;

                gsap.set(item, {
                    y: `${diff * -1}`,
                    opacity: 1,
                });

                gsap.to(item, {
                    scrollTrigger: {
                        trigger: work,
                        scrub: true,
                        ease: 'none',
                        onUpdate: ({ progress }) => {
                            const actualXTransform =
                                diff + diff * progress * -2;
                            // console.log('update', diff + diff * progress * -2);
                            gsap.set(item, { y: actualXTransform });
                        },
                        end: () =>
                            `+=${workContainerHeight * 2 + possiblePadding}`,
                    },
                });
            }

            if (item.classList.contains('work-item--full-bleed')) {
                const w = img.closest('.work section');
                gsap.set(picture, { width: '120%', height: '120%' });

                w.style.outline = '1px solid red';

                console.log('w', w);
                const _workContainerHeight = w.getBoundingClientRect().height;

                gsap.set(img, { y: `-10%` });

                const diff = -50;

                gsap.to(img, {
                    scrollTrigger: {
                        trigger: w,
                        scrub: true,
                        ease: 'none',
                        start: start,
                        markers: true,
                        onUpdate: ({ progress }) => {
                            const actualXTransform =
                                diff + diff * progress * -2;
                            console.log('update', diff + diff * progress * -2);
                            // gsap.set(item, { y: actualXTransform });
                        },
                        end: () =>
                            `+=${_workContainerHeight + window.innerHeight}px`,
                    },
                });
            }

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
        console.log('animateHeroImage');
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

        console.log(quote);

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

        splash.style.backgroundColor = 'transparent';
    },
    enter: function (onCompleteCb = () => {}) {
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
    // leave: function (onCompleteCb = () => {}) {
    //     const { mask, main, splash } = this.elements;

    //     console.log('splash!,', splash);
    //     const { mask_from_left, mask_from_right, mask_empty } = this.paths;

    //     var timeline = new TimelineMax({
    //         id: 'pageTransition.leave',
    //         onComplete: () => {
    //             splash.style.backgroundColor = 'black';
    //             mask.removeAttributeNS(null, 'd');
    //             onCompleteCb();
    //         },
    //     });

    //     gsap.set(main, { x: 0, opacity: 1 });
    //     mask.setAttributeNS(null, 'd', mask_empty);
    //     console.log('mask', mask);

    //     timeline.to(
    //         mask,
    //         {
    //             morphSVG: mask_from_left,
    //             duration: 1,
    //             ease: 'power4.inOut',
    //         },
    //         'reveal'
    //     );
    // },
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

// const resetStylesForAnimation = () => {
//     const splash = document.querySelector('.splash');
//     if (splash) {
//         var timeline = new TimelineMax({
//             onComplete: () => {
//                 document.querySelector('.splash')?.remove();
//                 const button = document.getElementById('contact');

//                 if (button) {
//                     button.addEventListener('click', createRipple);
//                 }
//                 header.animateScrollBar();
//                 header.animateScrollIndicator();
//                 header.randomiseHeaderText();
//                 header.animateHeroSection();

//                 caseStudy.animateHeroImage();
//                 caseStudy.animateQuote();
//                 Marquee('.marquee', 0.5);
//             },
//         });

//         timeline
//             .to(
//                 '.splash .icon',
//                 {
//                     opacity: 0,
//                 },
//                 0.5
//             )
//             .to('.splash', 1, {
//                 opacity: 0,
//             });
//     }
// };

window.addEventListener('load', function () {
    console.log('all resources loaded');

    // window.timelines.forEach((timeline) => timeline.resume());
});

// DOM loaded
document.addEventListener('DOMContentLoaded', (event) => {
    // GSDevTools.create();

    console.log('test');
    pageTransition.init();

    pageTransition.enter(() => {
        main.animateParagraphs();

        main.animateSectionHeadings();
        main.animateSkillBars();
        main.animateWorks();
    });

    window.viewportHeight = window.innerHeight;
    window.pageHeight =
        document.height !== undefined
            ? document.height
            : document.body.offsetHeight;

    const mediaQuery = window.matchMedia('(min-width: 768px)');

    window.isDesktop = mediaQuery.matches;

    // header.animateScrollBar();
    // header.animateScrollIndicator();
    // const animate = header.randomiseHeaderText();
    // if (animate) animate();

    // header.animateHeroSection();

    // main.animateLogo();
    // main.animateParagraphs();
    //

    // caseStudy.animateHeroImage();
    // caseStudy.animateQuote();
});
