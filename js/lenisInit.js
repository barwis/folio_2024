gsap.config({
    force3D: true,
    nullTargetWarn: false,
    trialWarn: false,
});

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(GSDevTools);

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
