/* Poultry Nation — site.js */
(function () {

    /* ── Nav scroll ── */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    /* ── Mobile menu ── */
    const burger = document.getElementById('nav-burger');
    const mMenu  = document.getElementById('mobile-menu');
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mMenu.classList.toggle('open');
        document.body.style.overflow = mMenu.classList.contains('open') ? 'hidden' : '';
    });
    mMenu.querySelectorAll('.mm-link').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('open');
            mMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ── Hero floating particles ── */
    const pCont = document.getElementById('hero-particles');
    if (pCont) {
        const colors = [
            'rgba(61,187,92,0.55)',
            'rgba(212,168,50,0.45)',
            'rgba(240,200,74,0.35)',
            'rgba(180,220,255,0.2)',
            'rgba(255,255,255,0.18)'
        ];
        for (let i = 0; i < 40; i++) {
            const el = document.createElement('div');
            el.className = 'hp';
            const size = Math.random() * 3.5 + 1;
            const dur  = Math.random() * 18 + 10;
            const del  = Math.random() * 14;
            const dx   = (Math.random() - 0.5) * 140;
            el.style.cssText = [
                `width:${size}px`, `height:${size}px`,
                `left:${Math.random() * 100}%`,
                `top:${75 + Math.random() * 25}%`,
                `background:${colors[Math.floor(Math.random() * colors.length)]}`,
                `animation-duration:${dur}s`,
                `animation-delay:-${del}s`,
                `--dx:${dx}px`,
            ].join(';');
            pCont.appendChild(el);
        }
    }

    /* ── Scroll reveal (IntersectionObserver) ──
       Cards are ALWAYS visible by default (no opacity:0 base state).
       When .visible is added, CSS triggers a fadeUp animation.
       Fallback: force-show everything after 4s in case observer misfires.
    ── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal-card').forEach(el => observer.observe(el));

    /* Fallback: show any cards still hidden after 4 seconds */
    setTimeout(() => {
        document.querySelectorAll('.reveal-card:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 4000);

    /* ── Smooth anchor scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


})();
