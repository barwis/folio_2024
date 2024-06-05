const colors = [
    ['#074358', '#458985','#d7d6a5','#dba67b','#a55c55'],
    [ '#1F2A40', '#586F8C', '#D9A79C', '#D9A79C', '#F23545'],
    ['#081B26', '#014034',  '#D9B6A3', '#012623', '#A6554E',],
    ['#1C2226',   '#549E8D','#A8BDBF',  '#A67041','#106973',]
]


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);


const lenis = new Lenis();

const viewportHeight = window.innerHeight;
const pageHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;

const animateScrollBar = () => {
    let scrollBarTimeline = gsap.timeline();
    // let _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
    const h = document.body.getBoundingClientRect().height;
    scrollBarTimeline.to('#scrollbar', {
        scrollTrigger: {
            scrub: true,
            start: 'top top',
            end: () => `${pageHeight - viewportHeight}px`
            }, 
        height: `${viewportHeight}px`
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
            opacity: 0
        },
        '#p1-2': {
            transform: 'translateX(5em)',
            opacity: 0
        },
        '#p1-tag': {
            opacity: 0
        }
    }

    const hero = document.querySelector('.hero');
    if (!hero) 
        return;

    Object.entries(elements).forEach(([id, styles]) => {
        const elem = document.querySelector(id);
        if (elem && hero) {
            gsap.to(id, {
                scrollTrigger: {
                    scrub: true,
                    start: 'top top',
                    trigger: '.hero',
                    end: () => `${viewportHeight}px`
                },
            ...styles
            });
        }
    })
}

const animateSectionHeadings = () => {

    const headings = [...document.querySelectorAll('h2')];
    if (headings.length === 0)
        return;

    headings.forEach(heading => {
        gsap.to(`#${heading.id}`, {
            scrollTrigger: {
                trigger:`#${heading.id}`,
                toggleActions: "play reset play reset"
            },
            opacity: 1,
            x: 0,
            ease: "power2.out",
            duration: 2,
        });
    })
}

const animateParagraphs = () => {
    const paragraphs = [...document.querySelectorAll('.slide-up')];

    if (paragraphs.length === 0)
        return;


    paragraphs.forEach(paragraph => {
        gsap.to(`#${paragraph.id}`, {
            scrollTrigger: {
                trigger:`#${paragraph.id}`,
                toggleActions: "play reset play reset"
            },
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 1,
        });
    })
}



const animateWorks = (breakpoint) => {
    const items = [...document.querySelectorAll('.item')];

    if (items.length === 0 ) 
        return;

    const duration = breakpoint === 'desktop' ? 2 : .5;
    const start = breakpoint === 'desktop' ? "top 80%" : "top 100%";

    items.forEach((item, index) => {
        const delay = breakpoint === 'desktop' ? (index % 2) / 3 : 0

        gsap.to(`#${item.id}`, {
            scrollTrigger: {
                start: start,
                trigger:`#${item.id}`,
            },
            opacity: 1,
            y: 0,
            ease: "power3.out",
            delay: delay,
            duration: duration,
        });
    });
}


const animateSkillBars = () => {
    const skillBars = [...document.querySelectorAll('.bar')]
    if (skillBars.length === 0 ) 
        return;

    skillBars.forEach((bar, index) => {
        const skillBar = bar.firstElementChild;
        const id = `#${skillBar.id}`;
        const width = parseInt(bar.dataset.years) * 10;
        gsap.to(id, {
            scrollTrigger: {
                trigger: id,
                start: "top 80%",
                ease: "power4.out",
                // toggleActions: "play reset play reset"
            }, // start the animation when ".box" enters the viewport (once)
            width: `${width}%`,
        });
    })


    
}

const animateLogo = () => {
    const body = document.querySelector('body');

    /*----------------------------
    Fixed Nav
    ----------------------------*/
    ScrollTrigger.create({
      markers: false,
      trigger: body,
      start: 'top top',
      onUpdate: self => {
        if (self.direction === 1) {
          body.classList.add('scrolling-down');
          body.classList.remove('scrolling-up');
        } else {
          body.classList.add('scrolling-up');
          body.classList.remove('scrolling-down');
        }
      },
    });
}


const animateSCrollIndicator = (breakpoint) => {
    const scrollArrow = document.querySelector('#scroll-line');
    const scrollText = document.querySelector('#scroll-text-wrapper');
    const trigger = document.querySelector('#page');


    const end = breakpoint === 'desktop' ? `+=${viewportHeight}` : `+=${viewportHeight *2.5}`
        gsap.to(scrollArrow, {
            scrollTrigger: {
                trigger: '#page1',
                start: 'top 100%',
                end: end,
                scrub: true,
            },
            y: 100,
        });

    gsap.to(scrollText, {
        scrollTrigger: {
            trigger: '#page1',
            start: 'top 100%',
            end: viewportHeight,
            scrub: true,
        },
        opacity: breakpoint === 'desktop' ? 1 : 0,
        rotation: 180,
    });
}

const animateChatBubble = () => {
    const button = document.querySelector('#message-bubble');
    // gsap.to(button, {
    let tl = gsap.timeline({
        scrollTrigger: {
          start: 'top bottom',
          end: '+=500',
          trigger: '#contact-page',
          toggleActions: 'play none none reverse',
          toggleClass: 'hidden'
        },
      });

    tl.from(button, {opacity: 1, duration: .1})
        .to(button, {opacity: 0, duration: .1})
}


lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)


function createRipple(event) {
    const button = event.currentTarget;

    const targetId = event.target.id;

    console.log(event)
    event.preventDefault();
    event.stopPropagation();

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const diff = Math.round(event.clientY - button.getBoundingClientRect().top - (button.getBoundingClientRect().height /2));
    console.log(diff, event.clientY, button.getBoundingClientRect().top, button.offsetTop)

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${diff}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }
    const itemContainer = event.target.closest('.item-container')

    if (itemContainer) {
        itemContainer.appendChild(circle);
    } else {
        button.appendChild(circle);
    }
    console.log(button.href)

    setTimeout(() => {
        window.location.href = button.href;
    }, 300)
}

const parallaxImages = () => {
    const items = [...document.querySelectorAll('.item')];
    if (items.length === 0 )
        return;

    items.forEach(item => {
        const { id: itemId } = item;
        const image = document.querySelector(`#${itemId} img`);
        const imageId = image.id;

        console.log(item, itemId, image)
        gsap.to(`#${imageId}`, {
            scrollTrigger: {
                trigger: `#${itemId}`,
                start: "top top",
                scrub: true,
            },
            top: -200,
            ease: "none",
        });

    })
}


const mediaQuery = window.matchMedia('(min-width: 768px)')
// Check if the media query is true
if (mediaQuery.matches) {
  // Then trigger an alert
    animateScrollBar();
    animateSectionHeadings();
    animateWorks('desktop');
    animateSCrollIndicator('desktop')
} else {
    animateWorks('mobile');
    animateLogo();
    animateSCrollIndicator();
    // animateChatBubble();
    const button = document.getElementById('contact');
    if (button) {
        button.addEventListener("click", createRipple);
    }

    // bubble.addEventListener("click", createRipple);
}


[...document.querySelectorAll('a.item')].forEach(item => item.addEventListener("click", createRipple))

animateParagraphs();
animateHeroSection();
animateSkillBars();


// TweenLite.set('#asdasd',{scale:0, transformOrigin:'center'})

//var action = new TimelineMax({repeat:5, yoyo:true, repeatDelay:1, ease: Power0.easeNone})
//.to('#circle',2,{borderRadius:'0%',scale:1.5, transformOrigin:'center'})


// TweenMax.to('#asdasd',2,{borderRadius:'0%',scale:1.5, transformOrigin:'center', ease: Power0.easeNone})


const wave = document.querySelector('#wave')

// const shape2 = 'M469.539032,263.986786H-0.000001L0,229.890961c310.649475,58.156982,255.61113-98.5,469.539032-65.062302V263.986786z'
// const shape3 = 'M469.539032,263.986786H-0.000001L0,0c226.11113,0,182.887283-0.414484,469.539032,0V263.986786zz'

const start = "M45.01,0s-15.11,23.24-15.11,50,15.11,50,15.11,50H0V0H45.01Z";
const end = "M0 0h10.06 v100H0Z";

// new TimelineMax({
//     repeat: -1,
//     repeatDelay: 1
// })
// .to(wave, .8, {
//     attr: { d: start },
//     ease: Power2.easeIn
// })
// .to(wave, .8, {
//     attr: { d: end },
//     ease: Power2.easeOut,
//     fill: '#77aeff'
// })
// // .from(logo, .8, {
// //     y: 75
// // }, '-=.8')

// parallax background
// https://gsap.com/community/forums/topic/30623-parallax-image-backgrounds-with-scrolltrigger-smooth-scrollbar-js-and-scrollerproxy/


// ScrollTrigger.create({
//     trigger: '#body',
//     start: 'top top',
//     onToggle: (self) => console.log('toggled, isActive:', self.isActive),
//     onUpdate: (self) => {
//         console.log(
//             'progress:',
//             self.progress.toFixed(3),
//             'direction:',
//             self.direction,
//             'velocity',
//             self.getVelocity()
//         );
//     }
// });