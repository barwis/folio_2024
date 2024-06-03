const colors = [
    ['#074358', '#458985','#d7d6a5','#dba67b','#a55c55'],
    [ '#1F2A40', '#586F8C', '#D9A79C', '#D9A79C', '#F23545'],
    ['#081B26', '#014034',  '#D9B6A3', '#012623', '#A6554E',],
    ['#1C2226',   '#549E8D','#A8BDBF',  '#A67041','#106973',]
]

// color-4: text
// color-1: body bg
// color-5: highlights, headings


// --color-5 - "I make the"

// const addColors = (colorsArray) => {

//     const stylesArray = colorsArray.map((color, index) => `--color-${index +1}: ${color};`)
//     const styleString = `:root { ${stylesArray.join(' ')} }`
//     return styleString
// }


// const stylesArray =  Object.entries(colors).map(([rule, value]) => `${rule}: ${value};`)
// const styleString = addColors(colors[2]);



// var styleSheet = document.createElement("style")
// styleSheet.innerText +=  styleString
// document.head.appendChild(styleSheet)


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
        // '#p1-tag': {
        //     opacity: 0
        // }
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
            }, // start the animation when ".box" enters the viewport (once)
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
            }, // start the animation when ".box" enters the viewport (once)
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
            }, // start the animation when ".box" enters the viewport (once)
            opacity: 1,
            y: 0,
            ease: "power3.out",
            delay:  (index % 2) / 3,
            duration: duration,
        });
    });


    // work-aside
    // gsap.to(`#work-aside`, {
    //       scrollTrigger: {
    //             trigger:`#work-aside`,
    //             start: 'top top',
    //             pin: true,
    //         },

    //     });


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

const mediaQuery = window.matchMedia('(min-width: 768px)')
// Check if the media query is true
if (mediaQuery.matches) {
  // Then trigger an alert
    animateScrollBar();
    animateSectionHeadings();
    animateWorks('desktop');

} else {
    animateWorks('mobile');

}

animateParagraphs()

animateHero();
animateSkillBars();


// const getEndPos = (elem) => {
//     const e = document.querySelector(elem);
//     return Math.round(e.getBoundingClientRect().top + e.offsetHeight)
// }


// const defaulTriggerOptions = {
//     scrub: true,
//     start: 'top top',
// }

// let tl = gsap.timeline();


// // snap h1s
// ['#page2-heading','#page4-heading'].forEach(heading => {
// // [...document.querySelectorAll('h2')].forEach(heading => {

//     const parentHeight = document.querySelector(heading).closest('.page').getBoundingClientRect().height;
    

//     tl.to(heading, {
//       scrollTrigger: {
//         ...defaulTriggerOptions,
//         trigger: heading,
//         pin: true,
//         end: () => `+=${parentHeight - document.querySelector(heading).offsetHeight}`,
//     },
// });
// })


// tl.to('#p1-1', {
//     scrollTrigger: {
//         ...defaulTriggerOptions,
//         trigger: '.page1',
//         end: () => `+=${getEndPos('.p1-1')}`,
//     },
//     opacity: 0,
//     x: -50
// })
// tl.to('#p1-2', {
//     scrollTrigger: {
//         ...defaulTriggerOptions,
//         trigger: '.page1',
//         end: () => `+=${getEndPos('.p1-2')}`,
//     },
//     opacity: 0,
//     x: 50
// });




// const setSkillsBarWidth = () => {
//     const skillBarContainer = document.getElementById("skills");
//     const skillsBarMaxWidth = Math.floor(skillBarContainer.getBoundingClientRect().width / 10) * 10;
//     skillBarContainer.style.width = `${skillsBarMaxWidth}px`

//     const skillBarWidth = (skillsBarMaxWidth - 16) / 4 * 3;
//     console.log(skillsBarMaxWidth, skillBarWidth)

// }


// // setSkillsBarWidth();

// const animateSkillBars = () => {
//     const bars = [...document.querySelectorAll(".skill-bar")];

//     bars.forEach((bar, index) => {
//         const id = `#${bar.id}`;
//         const width = `${bar.dataset.width}%`
//         // tl.to(id, {
//         //     scrollTrigger: {
//         //         ...defaulTriggerOptions,
//         //         start: 'top bottom',
//         //         trigger: id,
//         //         end: () => `+=500px`,
//         //     },
//         //     width: width,
//         // });

//         // tl.to(id, { duration: .5, width: width, ease: "power4.inOut" })


//         console.log({id, width})

//         // tl
//         // .from(id, {width: 0})
//         // .to(id, {
//         //     width: width,
//         // });
//         gsap.to(id, {
//             scrollTrigger: {
//                 trigger: id,
//                 toggleActions: "play reset play reset"
//             }, // start the animation when ".box" enters the viewport (once)
//             width: width,
//             delay: index / 5
//         });


//     })


// }

// animateSkillBars()



// tl
//     .from('.box', {opacity: 1})
//     .to()
// // add animations and labels to the timeline
// tl.addLabel('start')
//     .addLabel('color')
//     .from('.box', { backgroundColor: '#28a92b' })
//     .addLabel('end');


// gsap.to(".box-2", {
//   y: -120,
//   backgroundColor: "#1e90ff",
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".box-2",
//     containerAnimation: scrollTween,
//     start: "center 80%",
//     end: "center 20%",
//     scrub: true,
//     id: "2"
//   }
// });

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)