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

const lenis = new Lenis()

const viewportHeight = window.innerHeight;
const pageHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;

const animateScrollBar = () => {
    let scrollBarTimeline = gsap.timeline();
    let _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
    scrollBarTimeline.to('#scrollbar', {
        scrollTrigger: {
            scrub: true,
            start: 'top top',
            end: () => `${pageHeight - viewportHeight}px`
            }, 
        height: '100%'

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

animateScrollBar();
animateHero();

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