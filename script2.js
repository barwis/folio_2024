gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const viewportHeight = window.innerHeight;

function createRipple(event) {
    event.preventDefault();
    event.stopPropagation();
    const itemContainer = event.target.closest('.item-container');
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
        window.location.href = button.href;
    }, 300);
}

const animateHeroSection = () => {
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
};

const randomiseHeaderText = () => {
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
        ['and I turn caffeine', 'into websites', '( weird flex, but OK... )'],
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
};

const mediaQuery = window.matchMedia('(min-width: 768px)');

if (mediaQuery.matches) {
} else {
}

document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        randomiseHeaderText();
        animateHeroSection();
    }
});
