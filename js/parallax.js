/* ═══════════════════════════════════════════════════
   PARALLAX.JS — Nature layer depth effects via GSAP
═══════════════════════════════════════════════════ */

(function() {

gsap.registerPlugin(ScrollTrigger);

// ─── HERO NATURE LAYERS ───
// Sky doesn't move (fixed to hero)
// Far layers move slightly, near layers move more → depth illusion

gsap.to('#hero-mountains', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('#hero-trees-far', {
    yPercent: 22, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('#hero-trees-near', {
    yPercent: 38, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('#hero-grass', {
    yPercent: 58, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});

// Hero background image parallax
gsap.to('.hero-sky', {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});

// Hero content fades and lifts
gsap.to('.hero-content', {
    yPercent: 20, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '55% top', scrub: true }
});

// ─── EVOLUTION NATURE LAYERS ───
// These move as the section scrolls WITHIN the sticky container
// We read window.scrollY relative to section start

const evoSection = document.getElementById('evolution');
if (evoSection) {
    function getEvoProg() {
        const scrolled = window.scrollY - evoSection.offsetTop;
        const total = evoSection.offsetHeight - window.innerHeight;
        return Math.max(0, Math.min(1, scrolled / total));
    }

    // On scroll, nudge nature layers slightly based on progress
    // Far layers shift less, near layers shift more (horizontal and vertical)
    window.addEventListener('scroll', () => {
        const p = getEvoProg();
        const shift = (p - 0.5) * 60; // -30px to +30px horizontal

        // Subtle horizontal parallax: far moves less, near moves more
        const hills = document.querySelector('.evo-hills');
        const treesFar = document.querySelector('.evo-trees-far');
        const treesNear = document.querySelector('.evo-trees-near');
        const bushes = document.querySelector('.evo-bushes');
        const grassFront = document.querySelector('.evo-grass-front');

        if (hills) hills.style.transform = `translateX(${shift * 0.08}px) translateY(${p * 15}px)`;
        if (treesFar) treesFar.style.transform = `translateX(${shift * 0.15}px) translateY(${p * 25}px)`;
        if (treesNear) treesNear.style.transform = `translateX(${shift * 0.28}px) translateY(${p * 40}px)`;
        if (bushes) bushes.style.transform = `translateX(${shift * 0.42}px) translateY(${p * 55}px)`;
        if (grassFront) grassFront.style.transform = `translateX(${shift * 0.6}px) translateY(${p * 70}px)`;
    }, { passive: true });
}

// ─── STORY IMAGE PARALLAX ───
gsap.fromTo('#story-img',
    { yPercent: -8 },
    { yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true }
    }
);

// ─── HORIZONTAL SCROLL ───
if (window.innerWidth > 900) {
    const panels = gsap.utils.toArray('.phase');

    const hTween = gsap.to('#h-track', {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
            trigger: '.h-outer',
            pin: true,
            scrub: 1.5,
            snap: {
                snapTo: 1 / (panels.length - 1),
                duration: { min: 0.3, max: 0.6 },
                ease: 'power2.inOut'
            },
            end: () => '+=' + (panels.length - 1) * window.innerWidth
        }
    });

    // Per-panel: parallax photo, animate rule, fade copy
    panels.forEach((panel) => {
        const photo = panel.querySelector('.phase-photo');
        const rule = panel.querySelector('.ph-rule');
        const copy = panel.querySelector('.phase-copy');

        if (photo) {
            gsap.fromTo(photo,
                { backgroundPosition: '38% center' },
                { backgroundPosition: '62% center', ease: 'none',
                  scrollTrigger: {
                      trigger: panel, containerAnimation: hTween,
                      start: 'left right', end: 'right left', scrub: true
                  }
                }
            );
        }
        if (rule) {
            gsap.to(rule, {
                width: 75, ease: 'none',
                scrollTrigger: {
                    trigger: panel, containerAnimation: hTween,
                    start: 'left 80%', end: 'left 40%', scrub: true
                }
            });
        }
        if (copy) {
            gsap.fromTo(copy,
                { opacity: 0, x: 35 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
                  scrollTrigger: {
                      trigger: panel, containerAnimation: hTween,
                      start: 'left 70%', toggleActions: 'play none none reverse'
                  }
                }
            );
        }
    });
}

// ─── CTA PARALLAX ───
gsap.to('#cta-bg', {
    yPercent: 28, ease: 'none',
    scrollTrigger: { trigger: '.cta-wrap', start: 'top bottom', end: 'bottom top', scrub: true }
});

})();
