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
            const splash = document.createElement('div');
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
        window.customTimeLine = new TimelineMax({
            id: 'pageTransition.enter',
            timeScale: 2,
            paused: true,
            onComplete: () => {
                console.log('test');
                onCompleteCb();
            },
        });
        const { mask, splash, main } = this.elements;

        const { mask_from_right, mask_empty } = this.paths;

        if (!this.elements.main) {
            this.elements.main = document.querySelector('.toAnim');
        }

        const logoIcon = document.createElement('div');
        logoIcon.classList.add('icon', 'splash-logo');
        logoIcon.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 155.88 194.62"><polygon id="logo" fill="currentColor" points=".5 149.33 .5 30.29 51.46 .87 51.46 119.91 77.94 135.19 104.42 119.91 104.42 89.33 52.96 59.62 103.92 30.19 155.38 59.91 155.38 149.33 77.94 194.04 .5 149.33"/></svg>';
        splash.appendChild(logoIcon);

        mask.setAttributeNS(null, 'd', mask_from_right);

        // gsap

        window.customTimeLine
            .to('.splash .icon', {
                opacity: 0,
                duration: 0.5,
            })
            .to(
                mask,
                {
                    morphSVG: mask_empty,
                    duration: 1,
                    ease: 'power4.inOut',
                },
                0
            )
            .fromTo(
                main,
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    ease: 'power4.out',
                    duration: 1,
                    delay: 0.5,
                },
                0
            );

        window.customTimeLine.resume();
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

window.pageTransition = pageTransition;
