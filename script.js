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
    let _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
    const h = document.body.getBoundingClientRect().height;
    console.log(viewportHeight)
    scrollBarTimeline.to('#scrollbar', {
        scrollTrigger: {
            scrub: true,
            start: 'top top',
            end: () => `${pageHeight - viewportHeight}px`
            }, 
        height: `${viewportHeight}px`
    })
}

const animateHero = () => {

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

    // gsap.to('#p1-tag', {
    //     duration: 2,
    //     text: "This is the new text",
    //     ease: "none",
    //   });

    Object.entries(elements).forEach(([id, styles]) => {
        gsap.to(id, {
            scrollTrigger: {
                scrub: true,
                start: 'top top',
                trigger: '.hero',
                end: () => `${viewportHeight}px`
            },
           ...styles
        });
    })
}

const animateSectionHeadings = () => {

    const headings = [...document.querySelectorAll('h2')];

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
    console.log(items)
    const duration = breakpoint === 'desktop' ? 2 : .5;
    const start = breakpoint === 'desktop' ? "top 80%" : "top 100%";

    items.forEach((item, index) => {
        console.log(item, index)
        const delay = breakpoint === 'desktop' ? (index % 2) / 3 : 0

        gsap.to(`#${item.id}`, {
            scrollTrigger: {
                start: start,
                trigger:`#${item.id}`,
            },
            opacity: 1,
            y: 0,
            ease: "power3.out",
            delay:  (index % 2) / 3,
            duration: duration,
        });
    });
}


const animateSkillBars = () => {

    const skillBars = [...document.querySelectorAll('.bar')]

    console.log(skillBars)

    skillBars.forEach((bar, index) => {
        const skillBar = bar.firstElementChild;
        const id = `#${skillBar.id}`;
        const width = parseInt(bar.dataset.years) * 10;
        console.log({skillBar, id, width});
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
      start: 'top -20%',
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


const mediaQuery = window.matchMedia('(min-width: 768px)')
// Check if the media query is true
if (mediaQuery.matches) {
  // Then trigger an alert
    animateScrollBar();
    animateSectionHeadings();
    animateWorks('desktop');

} else {
    animateWorks('mobile');
    animateLogo();

}

animateParagraphs()

animateHero();
animateSkillBars();





lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)