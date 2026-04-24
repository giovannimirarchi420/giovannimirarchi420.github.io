// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Update GSAP ScrollTrigger on Lenis Scroll
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Preloader Logic
function initPreloader() {
    let progress = 0;
    const counter = document.querySelector('.preloader-counter');
    const bar = document.querySelector('.preloader-bar');

    const updateProgress = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress > 100) progress = 100;
        
        counter.textContent = `${progress}%`;
        bar.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(updateProgress);
            animateOutPreloader();
        }
    }, 50);
}

function animateOutPreloader() {
    const tl = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
            initHeroAnimations();
        }
    });

    tl.to('.preloader-counter', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut'
    })
    .to('.preloader-bar', {
        scaleX: 0,
        transformOrigin: 'right',
        duration: 0.6,
        ease: 'power3.inOut'
    }, "-=0.6")
    .to('.preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut'
    }, "-=0.4");
}

// Hero Typography Animations
function initHeroAnimations() {
    // Split hero text
    const title = new SplitType('.hero-title', { types: 'chars' });
    const subtitle = new SplitType('.hero-subtitle', { types: 'words' });

    const tl = gsap.timeline();

    tl.from(title.chars, {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.02,
        duration: 1.2,
        ease: 'expo.out'
    })
    .from(subtitle.words, {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out'
    }, "-=0.8")
    .from('.nav', {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, "-=1")
    .from('.hero-bottom', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, "-=1");
}

// Custom Cursor & Magnetic Elements
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const magnetics = document.querySelectorAll('.magnetic');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant primary cursor
        gsap.set(cursor, {
            x: mouseX,
            y: mouseY
        });
    });

    // Lerp follower loop
    gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.35;
        followerY += (mouseY - followerY) * 0.35;
        
        gsap.set(follower, {
            x: followerX,
            y: followerY
        });
    });

    magnetics.forEach((el) => {
        const strength = el.dataset.strength || 20;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: (relX / rect.width) * strength,
                y: (relY / rect.height) * strength,
                duration: 0.4,
                ease: 'power2.out'
            });
            
            follower.classList.add('active');
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
            follower.classList.remove('active');
        });
    });
}

// Scroll Animations for Text & Sections
function initScrollAnimations() {
    // 1. Split Text reveals
    const splitTexts = document.querySelectorAll('.split-text');
    
    splitTexts.forEach((text) => {
        const split = new SplitType(text, { types: 'lines, words' });
        
        gsap.from(split.words, {
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                end: 'top 50%',
                scrub: false,
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            stagger: 0.015,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // 2. Experience Items Stagger
    const expItems = document.querySelectorAll('.experience-item');
    expItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // 3. Project Cards Parallax
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 95%',
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
            delay: i * 0.1
        });
    });
}

// Initialization Sequence
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initScrollAnimations();
    initPreloader();
});