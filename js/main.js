/* ═══════════════════════════════════════════════════
   MAIN.JS — Cursor, Nav, Entrance, Reveals, Counters
═══════════════════════════════════════════════════ */

(function() {

gsap.registerPlugin(ScrollTrigger);

// ─── CUSTOM CURSOR ───
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
if (cur && ring) {
    let mx=0, my=0, rx=0, ry=0;
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
    gsap.ticker.add(() => {
        cur.style.left = mx+'px'; cur.style.top = my+'px';
        rx += (mx-rx) * 0.1; ry += (my-ry) * 0.1;
        ring.style.left = rx+'px'; ring.style.top = ry+'px';
    });
    // Bigger ring on links/buttons
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '56px'; ring.style.height = '56px';
            ring.style.borderColor = 'rgba(201,168,76,0.7)';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '36px'; ring.style.height = '36px';
            ring.style.borderColor = 'rgba(201,168,76,0.45)';
        });
    });
}

// ─── NAV SCROLL ───
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── HERO ENTRANCE ───
gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.eyebrow',  { y:25, opacity:0 }, { y:0, opacity:1, duration:1.1 }, 0.4)
    .fromTo('.hero-h1',  { y:55, opacity:0 }, { y:0, opacity:1, duration:1.5 }, 0.55)
    .fromTo('.hero-p',   { y:30, opacity:0 }, { y:0, opacity:1, duration:1.2 }, 0.85)
    .fromTo('.hero-btn', { y:20, opacity:0 }, { y:0, opacity:1, duration:1.0 }, 1.1)
    .fromTo('#scroll-bar', { scaleY:0 }, { scaleY:1, duration:1.5, ease:'power2.out' }, 1.4);

// ─── GOLD PARTICLES (hero) ───
const pCont = document.getElementById('hero-particles');
if (pCont) {
    const colors = ['#fce478','#f5b830','#ffffff','#ffe090'];
    for (let i=0; i<45; i++) {
        const el = document.createElement('div');
        el.className = 'particle';
        const s = Math.random()*2.5 + 0.5;
        const c = colors[Math.floor(Math.random()*colors.length)];
        el.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;top:${Math.random()*100}%;background:${c};opacity:0;`;
        pCont.appendChild(el);
        gsap.to(el, {
            opacity: Math.random()*0.55+0.05,
            y: -(Math.random()*260+80),
            x: (Math.random()-0.5)*140,
            duration: Math.random()*14+8,
            repeat: -1, yoyo: true,
            ease: 'sine.inOut', delay: Math.random()*8
        });
    }
}

// ─── SCROLL REVEALS ───
gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.to(el, {
        opacity:1, y:0, duration:1.1, ease:'power3.out',
        scrollTrigger: { trigger:el, start:'top 87%', toggleActions:'play none none none' }
    });
});
gsap.utils.toArray('.fade-left').forEach(el => {
    gsap.to(el, {
        opacity:1, x:0, duration:1.2, ease:'power3.out',
        scrollTrigger: { trigger:el, start:'top 87%', toggleActions:'play none none none' }
    });
});

// ─── COUNTING NUMBERS ───
document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    ScrollTrigger.create({
        trigger: el, start: 'top 82%', once: true,
        onEnter() {
            gsap.to({ n:0 }, {
                n: target, duration: 2.2, ease: 'power2.out',
                onUpdate() { el.textContent = Math.round(this.targets()[0].n)+'+'; }
            });
        }
    });
});

// ─── EVOLUTION SECTION: title fade ───
// The evo-title is inside the sticky, not tracked by normal scroll
// Just do a simple fade on the section entering
ScrollTrigger.create({
    trigger: '#evolution',
    start: 'top 80%',
    once: true,
    onEnter() {
        gsap.fromTo('.evo-title', {y:30,opacity:0},{y:0,opacity:1,duration:1.2,ease:'power3.out'});
        gsap.fromTo('.evo-progress-bar', {opacity:0},{opacity:1,duration:1,delay:0.4});
        gsap.fromTo('.evo-stages', {y:20,opacity:0},{y:0,opacity:1,duration:1,delay:0.5});
        gsap.fromTo('.evo-stage-info', {y:20,opacity:0},{y:0,opacity:1,duration:1,delay:0.7});
    }
});

// ─── QUALITY CARDS STAGGER ───
const qCards = gsap.utils.toArray('.q-card');
qCards.forEach((card, i) => {
    gsap.fromTo(card,
        { y:50, opacity:0 },
        { y:0, opacity:1, duration:1, ease:'power3.out', delay: i*0.12,
          scrollTrigger: { trigger:card, start:'top 88%', toggleActions:'play none none none' }
        }
    );
});

})();
