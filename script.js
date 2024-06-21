const colors = [
    ['#074358', '#458985', '#d7d6a5', '#dba67b', '#a55c55'],
    ['#1F2A40', '#586F8C', '#D9A79C', '#D9A79C', '#F23545'],
    ['#081B26', '#014034', '#D9B6A3', '#012623', '#A6554E'],
    ['#1C2226', '#549E8D', '#A8BDBF', '#A67041', '#106973'],
]

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(TextPlugin)

const lenis = new Lenis()

const viewportHeight = window.innerHeight
const pageHeight =
    document.height !== undefined ? document.height : document.body.offsetHeight

const animateBackground = () => {
    gsap.to(document.body, {
        scrollTrigger: {
            trigger: document.body,
            start: 'top 100%',
            end: document.body.innerHeight,
            scrub: true,
        },
        backgroundPosition: `0px -${viewportHeight}px` /* negative width of background image your animating - left top */,
    })
}

const animateScrollBar = () => {
    let scrollBarTimeline = gsap.timeline()
    // let _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
    const h = document.body.getBoundingClientRect().height
    scrollBarTimeline.to('#scrollbar', {
        scrollTrigger: {
            scrub: true,
            start: 'top top',
            end: () => `${pageHeight - viewportHeight}px`,
        },
        height: `${viewportHeight}px`,
    })
}

const animateHeroSection = () => {
    /**
     * elements object:
     * key: id
     * value: end styles
     */
    const elements = {
        '#p1-1': {
            transform: 'translateX(-5em)',
            opacity: 0,
        },
        '#p1-2': {
            transform: 'translateX(5em)',
            opacity: 0,
        },
        '#p1-tag': {
            opacity: 0,
        },
    }

    const hero = document.querySelector('.hero')
    if (!hero) return

    Object.entries(elements).forEach(([id, styles]) => {
        const elem = document.querySelector(id)
        if (elem && hero) {
            gsap.to(id, {
                scrollTrigger: {
                    scrub: true,
                    start: 'top top',
                    trigger: '.hero',
                    end: () => `${viewportHeight}px`,
                },
                ...styles,
            })
        }
    })
}

const animateSectionHeadings = () => {
    const headings = gsap.utils.toArray('h2')
    if (headings.length === 0) return

    headings.forEach((heading) => {
        gsap.to(`#${heading.id}`, {
            scrollTrigger: {
                trigger: `#${heading.id}`,
                // toggleActions: 'play reset play reset',
            },
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            duration: 2,
        })
    })
}

const animateParagraphs = () => {
    const paragraphs = gsap.utils.toArray('.slide-up')

    if (paragraphs.length === 0) return

    paragraphs.forEach((paragraph) => {
        gsap.to(`#${paragraph.id}`, {
            scrollTrigger: {
                trigger: `#${paragraph.id}`,
                toggleActions: 'play reset play reset',
            },
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 1,
        })
    })
}

const animateWorks = (breakpoint) => {
    const items = gsap.utils.toArray('.item')

    if (items.length === 0) return

    const duration = breakpoint === 'desktop' ? 2 : 0.5
    const start = breakpoint === 'desktop' ? 'top 80%' : 'top 100%'

    items.forEach((item, index) => {
        const delay = breakpoint === 'desktop' ? (index % 2) / 3 : 0
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
        })
    })
}

const animateSkillBars = () => {
    const skillBars = gsap.utils.toArray('.bar')
    if (skillBars.length === 0) return

    skillBars.forEach((bar) => {
        const skillBar = bar.firstElementChild
        const id = `#${skillBar.id}`
        const width = parseInt(bar.dataset.years) * 10
        gsap.to(id, {
            scrollTrigger: {
                trigger: id,
                start: 'top 80%',
                ease: 'power4.out',
            },
            width: `${width}%`,
        })
    })
}

const animateLogo = () => {
    const body = document.querySelector('body')

    /*----------------------------
    Fixed Nav
    ----------------------------*/
    ScrollTrigger.create({
        markers: false,
        trigger: body,
        start: 'top top',
        onUpdate: (self) => {
            if (self.direction === 1) {
                body.classList.add('scrolling-down')
                body.classList.remove('scrolling-up')
            } else {
                body.classList.add('scrolling-up')
                body.classList.remove('scrolling-down')
            }
        },
    })
}

const animateSCrollIndicator = (breakpoint) => {
    const scrollArrow = document.getElementById('scroll-line')
    const scrollText = document.getElementById('scroll-text-wrapper')
    const end =
        breakpoint === 'desktop'
            ? `+=${viewportHeight}`
            : `+=${viewportHeight * 2.5}`

    if (scrollArrow) {
        gsap.to(scrollArrow, {
            scrollTrigger: {
                trigger: '#page1',
                start: 'top 100%',
                end: end,
                scrub: true,
            },
            y: 100,
        })
    }

    if (scrollText) {
        gsap.to(scrollText, {
            scrollTrigger: {
                trigger: '#page1',
                start: 'top 100%',
                end: viewportHeight,
                scrub: true,
            },
            opacity: breakpoint === 'desktop' ? 1 : 0,
            rotation: 180,
        })
    }
}

const animateChatBubble = () => {
    const button = document.getElementById('message-bubble')
    // gsap.to(button, {
    let tl = gsap.timeline({
        scrollTrigger: {
            start: 'top bottom',
            end: '+=500',
            trigger: '#contact-page',
            toggleActions: 'play none none reverse',
            toggleClass: 'hidden',
        },
    })

    tl.from(button, { opacity: 1, duration: 0.1 }).to(button, {
        opacity: 0,
        duration: 0.1,
    })
}

// gsap.to("#clouds", 30,{
//     backgroundPosition: "-2247px 0px", /* negative width of background image your animating - left top */
//     ease: Linear.easeNone /* make sure you use Linear.easeNone so its smooth */
//   });

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

function createRipple(event) {
    event.preventDefault()
    event.stopPropagation()
    const itemContainer = event.target.closest('.item-container')
    const button = event.currentTarget
    const boundingRect = button.getBoundingClientRect()
    const diameter = Math.max(boundingRect.width, boundingRect.height)

    // calculate ripple position
    const diffX = Math.round(event.clientX - boundingRect.left - diameter / 2)
    const diffY = Math.round(event.clientY - boundingRect.top - diameter / 2)

    // generate ripple element
    const circle = document.createElement('span')

    circle.classList.add('ripple')
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${diffX}px`
    circle.style.top = `${diffY}px`

    // remove previous ripple if exists
    const ripple = button.getElementsByClassName('ripple')[0]

    if (ripple) {
        ripple.remove()
    }

    // append new ripple element
    if (itemContainer) {
        itemContainer.appendChild(circle)
    } else {
        button.appendChild(circle)
    }

    setTimeout(() => {
        window.location.href = button.href
    }, 300)
}

const animateShowcaseItems = () => {
    const items = gsap.utils.toArray('.showcase-item')

    if (items.length === 0) return

    const showcaseItemsContainerHeight = document
        .querySelector('.showcase')
        .getBoundingClientRect().height

    items.forEach((item) => {
        const img = item.querySelector('img')
        const container = item.querySelector('.showcase-item-container')

        const containerOffset = item.classList.contains('wide') ? -1 : 1

        gsap.set(img, { y: '-10%' })
        gsap.set(container, { y: `${containerOffset * -10}%` })

        gsap.to(img, {
            scrollTrigger: {
                trigger: item,
                scrub: true,
                end: () => `${viewportHeight + showcaseItemsContainerHeight}px`,
                // toggleActions: "play reset play reset"
            },
            y: '10%',
        })

        gsap.to(container, {
            scrollTrigger: {
                trigger: item,
                scrub: true,
                end: () => `${viewportHeight}px`,
                // toggleActions: "play reset play reset"
            },
            y: `${containerOffset * 5}%`,
        })
    })

    // items.forEach((heading) => {
    //     gsap.to(item, {
    //         scrollTrigger: {
    //             trigger: item,
    //             scrub: true,
    //             end: () => `${viewportHeight}px`,
    //             // toggleActions: "play reset play reset"
    //         },
    //         y: offset,
    //     })
    // })
}

// const parallaxImages = () => {
//     const items = gsap.utils.toArray('.item');
//     if (items.length === 0 )
//         return;

//     items.forEach(item => {
//         const { id: itemId } = item;
//         const image = document.querySelector(`#${itemId} img`);
//         const imageId = image.id;

//         console.log(item, itemId, image)
//         gsap.to(`#${imageId}`, {
//             scrollTrigger: {
//                 trigger: `#${itemId}`,
//                 start: "top top",
//                 scrub: true,
//             },
//             top: -200,
//             ease: "none",
//         });

//     })
// }

const parallaxBackground = () => {
    const parallaxSections = gsap.utils.toArray('.parallax-background')
    console.log(parallaxSections)

    parallaxSections.forEach((section) => {
        gsap.set(section, { y: 0 })
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                scrub: true,
                start: 'top top',
                end: () => `${viewportHeight}px`,
                // toggleActions: "play reset play reset"
            },
            // y: `${containerOffset * 5}%`,
            y: `${viewportHeight / 2}`,
            ease: 'none',
        })
    })
}

animateBackground()
animateParagraphs()
animateHeroSection()
animateSkillBars()

parallaxBackground()
const mediaQuery = window.matchMedia('(min-width: 768px)')
// Check if the media query is true
if (mediaQuery.matches) {
    // Then trigger an alert
    animateScrollBar()
    animateSectionHeadings()
    animateWorks('desktop')
    animateSCrollIndicator('desktop')
    animateShowcaseItems()
} else {
    animateWorks('mobile')
    animateLogo()
    animateSCrollIndicator()
    // animateChatBubble();
    const button = document.getElementById('contact')
    if (button) {
        button.addEventListener('click', createRipple)
    }

    // bubble.addEventListener("click", createRipple);
}

const texts = [
    ['and I make', 'the Web', '( like... really! )'],
    ["and I'm a", 'web magican', '╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ'],
    ['and I make pixels', 'dance'],
    ['and I debug more than', 'I sleep', "( I really shouldn't though... )"],
    ['and I turn coffee', 'into code', "( yeah, I'm THAT cool! )"],
    ['and I prefer spaces', 'over tabs', '( fight me! )'],
    ['and I turn caffeine', 'into websites', '( weird flex, but OK... )'],
]

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

function* random(array) {
    let index = Infinity
    const items = array.slice() //take a copy of the array;

    while (true) {
        if (index >= array.length) {
            shuffle(items)
            index = 0
        }

        yield items[index++]
    }
}

const scrambleText = () => {
    const span1 = document.querySelector('#p1-tag-span')
    const span2 = document.querySelector('#p1-tag-span-orange')
    const span3 = document.querySelector('#p1-tag-sidenote')

    const defaultProps = {
        chars: 'lowerCase',
        tweenLength: true,
        speed: 0.3,
    }
    if (!span1 || !span2) return

    gsap.registerPlugin(ScrambleTextPlugin)

    const randomText = random(texts)

    const animate = () => {
        span1.innerHTML = ''
        span2.innerHTML = ''
        span3.innerHTML = ''

        const textToShuffle = randomText.next().value
        gsap.set(span3, { opacity: 0 })

        span3.innerHTML = textToShuffle[2] || ''

        const newDuration = parseFloat(
            textToShuffle.join('').length / 30
        ).toFixed(2)

        var tlscramble = gsap.timeline({
            defaults: { duration: newDuration, ease: 'none' },
        })

        tlscramble
            .to(span1, {
                scrambleText: {
                    text: textToShuffle[0],
                    ...defaultProps,
                },
            })
            .to(span2, {
                scrambleText: {
                    text: textToShuffle[1],
                    ...defaultProps,
                },
            })
            .to(span3, { opacity: 1, duration: 0.2, delay: 1 })

        setTimeout(animate, newDuration * 1000 + 5000)
    }

    animate()
}

document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        scrambleText()
    }
})
;[...document.querySelectorAll('a.item')].forEach((item) =>
    item.addEventListener('click', createRipple)
)
