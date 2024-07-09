gsap.config({
    force3D: true,
    nullTargetWarn: false,
    trialWarn: false,
});

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const viewportHeight = window.innerHeight;
const pageHeight =
    document.height !== undefined
        ? document.height
        : document.body.offsetHeight;

const mediaQuery = window.matchMedia('(min-width: 768px)');

const isDesktop = mediaQuery.matches;

function createRipple(event) {
    if (isDesktop && button.href) {
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
    elements: {
        span1: document.querySelector('#sh1'),
        span2: document.querySelector('#sh2'),
        span3: document.querySelector('#sh3'),
        hero: document.querySelector('header'),
        scrollArrow: document.getElementById('scroll-arrow'),
        scrollText: document.getElementById('scroll-text-wrapper'),
        circle: document.querySelector('.circle'),
        scrollBar: document.getElementById('scrollbar'),
    },

    reset: function () {
        const { span1, span2, span3 } = this.elements;
        span1 ? (span1.innerHTML = '') : null;
        span2 ? (span2.innerHTML = '') : null;
        span3 ? (span3.innerHTML = '') : null;
        gsap.set(span3, { opacity: 0 });
    },

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
        const { span1, span2, span3 } = this.elements;

        if (!span1 || !span2) return;

        const defaultScrambleTextProps = {
            chars: 'lowerCase',
            tweenLength: true,
            speed: 0.3,
        };

        gsap.registerPlugin(ScrambleTextPlugin);

        const randomText = getRandomArrayItem(this.text);

        const animate = () => {
            // clear elements' text
            span1.innerHTML = '';
            span2.innerHTML = '';
            span3.innerHTML = '';

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

        animate();
    },
    animateHeroSection: function () {
        // const hero = document.querySelector('header');
        const { hero } = this.elements;

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
                        end: () => `${viewportHeight}px`,
                    },
                    ...styles,
                });
            }
        });
    },
    animateScrollIndicator: function () {
        const { scrollArrow, scrollText, circle } = this.elements;

        const end = isDesktop
            ? `+=${viewportHeight}`
            : `+=${viewportHeight * 2.5}`;

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
                lenis.scrollTo('#main', { duration: 1, lerp: 0.1 });
            });
        }
    },
    animateScrollBar: function () {
        const { scrollBar } = this.elements;
        if (!isDesktop || !scrollBar) return;
        gsap.to(scrollBar, {
            scrollTrigger: {
                scrub: true,
                start: 'top top',
                end: () => `${pageHeight - viewportHeight}px`,
            },
            height: `${viewportHeight}px`,
            ease: 'none',
        });
    },
};

const main = {
    elements: {
        body: document.querySelector('body'),
        logo: document.querySelector('.logo'),
        headings: gsap.utils.toArray('h2'),
        paragraphs: gsap.utils.toArray(
            '.fact section, .recommendations section'
        ),
        items: gsap.utils.toArray('.work-item'),
        skillBars: gsap.utils.toArray('.bar'),
    },

    reset: function () {
        const initialYOffset = isDesktop ? '2em' : '20px';

        this.elements.paragraphs.forEach((paragraph) =>
            gsap.set(paragraph, { opacity: 0, y: initialYOffset })
        );
        this.elements.headings?.forEach((heading) =>
            gsap.set(heading, { x: -55, opacity: 0 })
        );
    },

    animateSectionHeadings: function () {
        this.elements.headings?.forEach((heading) => {
            gsap.to(heading, {
                scrollTrigger: {
                    trigger: heading,
                },
                opacity: 1,
                x: 0,
                ease: 'power2.out',
                duration: isDesktop ? 2 : 1,
            });
        });
    },

    animateParagraphs: function () {
        this.elements.paragraphs?.forEach((paragraph) => {
            gsap.to(paragraph, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                duration: 1,
                delay: 0.2,
            });
        });
    },

    reset: function () {
        this.elements.items?.forEach((item) => {
            const i = gsap.utils.selector(item);

            const pictureContainer = i('.test');
            const picture = i('picture');
            const image = i('img');
            if (document.body.classList.contains('index')) {
                gsap.set(pictureContainer, { y: 200, opacity: 0 });
            }
            gsap.set(picture, { width: '120%', height: '120%' });
            gsap.set(image, { y: `${-20}%` });
        });

        this.elements.skillBars.forEach((bar) => {
            gsap.set(bar.firstElementChild, { width: 0 });
        });
    },

    animateWorks: () => {
        const classes = {
            item: '.work.item',
            pictureContainer: '.test',
            picture: 'picture',
        };

        const items = gsap.utils.toArray('.work-item');

        if (items.length === 0) return;

        const duration = isDesktop ? 1 : 1;
        const start = isDesktop ? 'top 80%' : 'top 100%';

        items.forEach((item) => {
            const i = gsap.utils.selector(item);

            const itemHeight = i('.test')[0]?.getBoundingClientRect().height;

            const pictureContainer = i('.test');
            const picture = i('picture');
            const image = i('img');

            if (pictureContainer && document.body.classList.contains('index')) {
                gsap.to(pictureContainer, {
                    scrollTrigger: {
                        start: start,
                        trigger: pictureContainer,
                        end: viewportHeight + itemHeight,
                    },
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    duration: duration,
                });
            }

            // img parallax
            if (picture && image) {
                gsap.to(image, {
                    scrollTrigger: {
                        trigger: pictureContainer,
                        scrub: true,
                        end: () => `${viewportHeight + itemHeight}px`,
                        // toggleActions: "play reset play reset"
                    },
                    y: `${20}%`,
                });
            }
        });
    },
    animateSkillBars: function () {
        const { skillBars } = this.elements;

        skillBars.forEach((bar) => {
            const skillBar = bar.firstElementChild;
            const width = parseInt(bar.dataset.years) * 10;

            gsap.to(skillBar, {
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
        if (isDesktop) return;
        const { body, logo } = this.elements;
        /*----------------------------
        Fixed Nav
        ----------------------------*/
        if (!logo) return;

        gsap.to(body, {
            scrollTrigger: {
                trigger: body,
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
    elements: {
        heroImage: document.querySelector('.header--big .header__image'),
        showcase: document.querySelector('.showcase'),
        items: gsap.utils.toArray('.showcase .work-item'),
    },
    reset: function () {
        const { showcase, items } = this.elements;

        gsap.set(showcase, {
            paddingTop: '10%',
            paddingBottom: '10%',
        });

        items.forEach((item) => {
            if (item.classList.contains('work-item--full-bleed')) return;
            const itemHeight = item.getBoundingClientRect().height * 0.1;
            const containerOffset = item.classList.contains('work-item--wide')
                ? -1
                : 1;
            gsap.set(item, { y: `${itemHeight * containerOffset * -1}` });
        });
    },
    animateHeroImage: function () {
        const { heroImage } = this.elements;
        if (!heroImage) return;

        gsap.to(heroImage, {
            scrollTrigger: {
                trigger: heroImage,
                start: 'top top',
                scrub: true,
                end: () => `${viewportHeight}px`,
                // toggleActions: "play reset play reset"
            },
            y: `-50%`,
        });
    },
    animateShowcaseItems: function () {
        if (!isDesktop) return;
        const { showcase, items } = this.elements;

        const showcaseItemsContainerHeight =
            showcase?.getBoundingClientRect().height;

        items.forEach((item) => {
            if (item.classList.contains('work-item--full-bleed')) return;

            const itemHeight = item.getBoundingClientRect().height * 0.1;
            const containerOffset = item.classList.contains('work-item--wide')
                ? -1
                : 1;

            gsap.to(item, {
                scrollTrigger: {
                    trigger: showcase,
                    start: 'top bottom',
                    scrub: true,
                    ease: 'none',
                    end: `${
                        showcaseItemsContainerHeight * 1.5 + viewportHeight
                    }`,
                    // toggleActions: "play reset play reset"
                },
                y: `${containerOffset * itemHeight}`,
            });
        });
    },
    animateQuote: () => {
        const quote = document.querySelector('.quote');
        const recommendationContainer =
            document.querySelector('.recommendations');

        if (!quote) {
            return;
        }

        // mobile: y: -100% - 100%;
        // desktop: y: - 0% - 30%;
        gsap.set(quote, { y: isDesktop ? '0%' : '-40%' });
        gsap.to(quote, {
            scrollTrigger: {
                trigger: recommendationContainer,
                scrub: true,
                end: () =>
                    `${
                        viewportHeight +
                        recommendationContainer.getBoundingClientRect().height
                    }px`,
            },
            y: isDesktop ? '30%' : '40%',
        });
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

const resetStylesForAnimation = () => {
    const splash = document.querySelector('.splash');
    if (splash) {
        var timeline = new TimelineMax({
            onComplete: () => {
                document.querySelector('.splash')?.remove();
            },
        });

        timeline
            .to(
                '.splash .icon',
                {
                    opacity: 0,
                },
                0.5
            )
            .to('.splash', 1, {
                opacity: 0,
            });
    }
};

// TODO:
// combine animateWorks and animateShowcaseItems into one

document.addEventListener('readystatechange', (event) => {
    header.reset();
    main.reset();
    caseStudy.reset();

    if (event.target.readyState === 'complete') {
        const button = document.getElementById('contact');

        if (button) {
            button.addEventListener('click', createRipple);
        }
        header.animateScrollBar();
        header.animateScrollIndicator();
        header.randomiseHeaderText();
        header.animateHeroSection();

        main.animateLogo();
        main.animateWorks();
        main.animateParagraphs();
        main.animateSectionHeadings();
        main.animateSkillBars();

        caseStudy.animateHeroImage();
        caseStudy.animateShowcaseItems();
        caseStudy.animateQuote();
        Marquee('.marquee', 0.5);

        // createRipple();
    }
});
