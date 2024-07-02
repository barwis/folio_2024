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
    randomiseHeaderText: () => {
        const texts = [
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
            [
                'and I turn caffeine',
                'into websites',
                '( weird flex, but OK... )',
            ],
        ];

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

        const defaultScrambleTextProps = {
            chars: 'lowerCase',
            tweenLength: true,
            speed: 0.3,
        };

        gsap.registerPlugin(ScrambleTextPlugin);

        const randomText = getRandomArrayItem(texts);

        const animate = () => {
            // clear elements' text
            span1.innerHTML = '';
            span2.innerHTML = '';
            span3.innerHTML = '';

            const textToShuffle = randomText.next().value;

            gsap.set(span3, { opacity: 0 });
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
    animateHeroSection: () => {
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

        const hero = document.querySelector('header');
        if (!hero) return;

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
    animateScrollIndicator: () => {
        const scrollArrow = document.getElementById('scroll-arrow');
        const scrollText = document.getElementById('scroll-text-wrapper');
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

        document.querySelector('.circle').addEventListener('click', () => {
            lenis.scrollTo('#main', { duration: 1, lerp: 0.1 });
        });
    },
    animateScrollBar: () => {
        let scrollBarTimeline = gsap.timeline();
        scrollBarTimeline.to('#scrollbar', {
            scrollTrigger: {
                scrub: true,
                start: 'top top',
                end: () => `${pageHeight - viewportHeight}px`,
            },
            height: `${viewportHeight}px`,
        });
    },
};

const main = {
    animateSectionHeadings: () => {
        const headings = gsap.utils.toArray('h2');
        if (headings.length === 0) return;

        headings.forEach((heading) => {
            gsap.set(heading, { x: -55, opacity: 0 });
            gsap.to(heading, {
                scrollTrigger: {
                    trigger: heading,
                    // toggleActions: 'play reset play reset',
                },
                opacity: 1,
                x: 0,
                ease: 'power2.out',
                duration: isDesktop ? 2 : 1,
            });
        });
    },
    animateParagraphs: () => {
        const paragraphs = gsap.utils.toArray(
            '.fact section, .recommendations section'
        );

        if (paragraphs.length === 0) return;

        const initialYOffset = isDesktop ? '2em' : '20px';
        paragraphs.forEach((paragraph) => {
            gsap.set(paragraph, { opacity: 0, y: initialYOffset });
            gsap.to(paragraph, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 80%',
                    // toggleActions: 'play reset play reset',
                },
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                duration: 1,
                delay: 0.2,
            });
        });
    },
    animateWorks: () => {
        const items = gsap.utils.toArray('.work a');

        if (items.length === 0) return;
        const duration = isDesktop ? 2 : 1;
        const start = isDesktop ? 'top 80%' : 'top 100%';

        items.forEach((item, index) => {
            const itemContainer = item.querySelector('.item-container');

            item.addEventListener('click', createRipple, false);
            const delay = isDesktop ? (index % 2) / 3 : 0;
            gsap.set(item, { y: 200, opacity: 0 });
            gsap.to(item, {
                scrollTrigger: {
                    start: start,
                    trigger: item,
                },
                opacity: 1,
                y: 0,
                ease: 'power3.out',
                delay: delay,
                duration: duration,
            });
        });
    },
    animateSkillBars: () => {
        const skillBars = gsap.utils.toArray('.bar');
        if (skillBars.length === 0) return;

        skillBars.forEach((bar) => {
            const skillBar = bar.firstElementChild;
            const width = parseInt(bar.dataset.years) * 10;
            gsap.set(skillBar, { width: 0 });

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
    animateLogo: () => {
        const body = document.querySelector('body');
        const logo = document.querySelector('.logo');
        /*----------------------------
        Fixed Nav
        ----------------------------*/
        ScrollTrigger.create({
            markers: false,
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
        });
    },
};

document.addEventListener('readystatechange', (event) => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    if (event.target.readyState === 'complete') {
        if (mediaQuery.matches) {
            header.animateScrollBar();
        } else {
            main.animateLogo();
            const button = document.getElementById('contact');

            if (button) {
                button.addEventListener('click', createRipple);
            }
        }
        header.animateScrollIndicator();
        header.randomiseHeaderText();
        header.animateHeroSection();

        main.animateWorks();
        main.animateParagraphs();

        main.animateSectionHeadings();
        main.animateSkillBars();
        // createRipple();
    }
});
