/* ════════════════════════════════════════════════════════
   chicken-canvas.js
   Scroll-driven evolution: Telur → DOC → Remaja → Dewasa
════════════════════════════════════════════════════════ */
(function () {

    /* ── canvas setup ── */
    const canvas = document.getElementById('chicken-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    const particles = [];
    let lastStage = -1;

    function setSize() {
        const s = Math.round(Math.min(
            window.innerWidth  * 0.68,
            window.innerHeight * 0.62,
            640
        ));
        canvas.width  = s;
        canvas.height = s;
        canvas.style.width  = s + 'px';
        canvas.style.height = s + 'px';
    }
    setSize();
    window.addEventListener('resize', setSize);

    /* ── scroll progress 0→1 ── */
    function progress() {
        const sec = document.getElementById('evolution');
        if (!sec) return 0;
        const scrolled = window.scrollY - sec.offsetTop;
        const range    = sec.offsetHeight - window.innerHeight;
        return Math.max(0, Math.min(1, scrolled / range));
    }

    /* ── stage opacity  (fade-in from i0→i1, full i1→o0, fade-out o0→o1) ── */
    function stageAlpha(p, i0, i1, o0, o1) {
        if (p <= i0 || p >= o1) return 0;
        if (p >= i1 && p <= o0) return 1;
        if (p < i1)  return (p - i0) / (i1 - i0);
        return 1 - (p - o0) / (o1 - o0);
    }

    /* ── particle burst ── */
    class Spark {
        constructor(x, y, vx, vy, color, r, life) {
            Object.assign(this, { x, y, vx, vy, color, r, life, maxLife: life });
        }
        tick() { this.x += this.vx; this.y += this.vy; this.vy += 0.22; this.life--; }
        draw(c) {
            const a = Math.pow(this.life / this.maxLife, 0.7);
            c.save();
            c.globalAlpha = a;
            c.fillStyle   = this.color;
            c.beginPath();
            c.arc(this.x, this.y, this.r * a, 0, Math.PI * 2);
            c.fill();
            c.restore();
        }
    }
    function burst(x, y, color, n, spread) {
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * spread + 1.2;
            particles.push(new Spark(x, y, Math.cos(a) * s, Math.sin(a) * s - Math.random() * 2,
                color, Math.random() * 4 + 2, Math.random() * 45 + 18));
        }
    }

    /* ── ground shadow ── */
    function shadow(cx, cy, w) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w);
        g.addColorStop(0, 'rgba(0,0,0,0.22)');
        g.addColorStop(1, 'transparent');
        ctx.save();
        ctx.scale(1, 0.28);
        ctx.beginPath();
        ctx.ellipse(cx, cy / 0.28, w, w * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
    }

    /* ══════════════════════════════
       STAGE 0 — EGG
    ══════════════════════════════ */
    function drawEgg(cx, cy, r, crack) {
        ctx.save();

        /* shell body */
        const g = ctx.createRadialGradient(cx - r * .13, cy - r * .2, r * .04, cx, cy, r * .74);
        g.addColorStop(0,   '#fffdf2');
        g.addColorStop(0.4, '#f2e8d0');
        g.addColorStop(0.8, '#ddd0aa');
        g.addColorStop(1,   '#c8b888');
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * .55, r * .71, 0, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = '#b8a870';
        ctx.lineWidth   = r * .016;
        ctx.stroke();

        /* sheen */
        ctx.beginPath();
        ctx.ellipse(cx - r * .16, cy - r * .26, r * .11, r * .18, -.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();

        /* speckles */
        const spots = [[.18,.15],[-.22,.1],[.08,.32],[-.12,-.1],[.28,-.05],[-.05,.42]];
        spots.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.ellipse(cx + dx * r, cy + dy * r, r * .022, r * .016, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(160,130,80,0.25)';
            ctx.fill();
        });

        /* cracks */
        if (crack > 0) {
            ctx.strokeStyle = '#8a6c40';
            ctx.lineWidth   = r * .014;
            ctx.lineCap     = 'round';
            const f = crack;

            /* main crack zig-zag */
            ctx.beginPath();
            ctx.moveTo(cx - r * .04,  cy - r * .22);
            ctx.lineTo(cx + r * .08 * f, cy - r * .05 * f);
            ctx.lineTo(cx - r * .03 * f, cy + r * .1  * f);
            ctx.stroke();

            /* branch crack */
            ctx.beginPath();
            ctx.moveTo(cx + r * .05 * f, cy - r * .12 * f);
            ctx.lineTo(cx + r * .2  * f, cy - r * .18 * f);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx + r * .07 * f, cy - r * .03 * f);
            ctx.lineTo(cx + r * .16 * f, cy + r * .08 * f);
            ctx.stroke();

            /* peek of DOC inside */
            if (crack > 0.55) {
                const peek = (crack - 0.55) / 0.45;
                ctx.save();
                ctx.globalAlpha = peek * 0.9;
                /* tiny yellow beak poking out */
                const bx = cx + r * .04, by = cy - r * .14;
                ctx.beginPath();
                ctx.ellipse(bx, by, r * .2 * peek, r * .16 * peek, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#f5c030';
                ctx.fill();
                /* tiny eye */
                ctx.beginPath();
                ctx.arc(bx + r * .08 * peek, by - r * .04 * peek, r * .03 * peek, 0, Math.PI * 2);
                ctx.fillStyle = '#1a0800';
                ctx.fill();
                ctx.restore();
            }
        }

        ctx.restore();
    }

    /* ══════════════════════════════
       STAGE 1 — DOC (Day Old Chick)
    ══════════════════════════════ */
    function drawDOC(cx, cy, r) {
        ctx.save();

        /* body */
        const bg = ctx.createRadialGradient(cx - r * .09, cy + r * .06, r * .04, cx, cy + r * .15, r * .38);
        bg.addColorStop(0,   '#fff070');
        bg.addColorStop(0.65,'#f5c030');
        bg.addColorStop(1,   '#e8a000');
        ctx.beginPath();
        ctx.arc(cx, cy + r * .15, r * .38, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();

        /* wing bumps */
        ctx.beginPath();
        ctx.ellipse(cx - r * .29, cy + r * .1, r * .18, r * .12, -.38, 0, Math.PI * 2);
        ctx.fillStyle = '#e8a000';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * .29, cy + r * .1, r * .15, r * .1, .38, 0, Math.PI * 2);
        ctx.fillStyle = '#e8a000';
        ctx.fill();

        /* head */
        const hg = ctx.createRadialGradient(cx - r * .06, cy - r * .22, r * .03, cx, cy - r * .2, r * .26);
        hg.addColorStop(0, '#fff070');
        hg.addColorStop(1, '#f5c030');
        ctx.beginPath();
        ctx.arc(cx, cy - r * .2, r * .26, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();

        /* tiny comb */
        ctx.beginPath();
        ctx.moveTo(cx - r * .04, cy - r * .44);
        ctx.bezierCurveTo(cx - r * .05, cy - r * .54, cx + r * .02, cy - r * .54, cx + r * .02, cy - r * .44);
        ctx.fillStyle = '#dd2020';
        ctx.fill();

        /* beak */
        ctx.beginPath();
        ctx.moveTo(cx + r * .24,  cy - r * .2);
        ctx.lineTo(cx + r * .4,   cy - r * .14);
        ctx.lineTo(cx + r * .24,  cy - r * .1);
        ctx.closePath();
        ctx.fillStyle = '#e87010';
        ctx.fill();

        /* eye */
        ctx.beginPath();
        ctx.arc(cx + r * .1, cy - r * .24, r * .052, 0, Math.PI * 2);
        ctx.fillStyle = '#1a0800';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * .12, cy - r * .265, r * .015, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        /* blush */
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.ellipse(cx - r * .1, cy - r * .14, r * .1, r * .06, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ff7070';
        ctx.fill();
        ctx.restore();

        /* feet */
        ctx.strokeStyle = '#e87010';
        ctx.lineWidth   = r * .036;
        ctx.lineCap     = 'round';
        [[cx - r * .1, cx - r * .1], [cx + r * .1, cx + r * .1]].forEach(([x, xb]) => {
            ctx.beginPath();
            ctx.moveTo(x,  cy + r * .5);
            ctx.lineTo(xb, cy + r * .65);
            ctx.stroke();
            ctx.lineWidth = r * .022;
            ctx.beginPath();
            ctx.moveTo(xb, cy + r * .65); ctx.lineTo(xb - r * .14, cy + r * .73);
            ctx.moveTo(xb, cy + r * .65); ctx.lineTo(xb,            cy + r * .77);
            ctx.moveTo(xb, cy + r * .65); ctx.lineTo(xb + r * .12, cy + r * .73);
            ctx.stroke();
            ctx.lineWidth = r * .036;
        });

        ctx.restore();
    }

    /* ══════════════════════════════
       STAGE 2 — REMAJA (Young)
    ══════════════════════════════ */
    function drawYoung(cx, cy, r) {
        ctx.save();

        /* tail feathers (drawn behind body) */
        [[-2.55, r * .75, .062], [-2.35, r * .86, .052], [-2.15, r * .79, .058]].forEach(([ang, len, w]) => {
            ctx.save();
            ctx.translate(cx - r * .33, cy - r * .04);
            ctx.rotate(ang);
            ctx.beginPath();
            ctx.ellipse(0, -len / 2, r * w, len / 2, 0, 0, Math.PI * 2);
            const tg = ctx.createLinearGradient(-r * w, 0, r * w, 0);
            tg.addColorStop(0,   '#3a2010');
            tg.addColorStop(0.5, '#6a3e1a');
            tg.addColorStop(1,   '#3a2010');
            ctx.fillStyle = tg;
            ctx.fill();
            ctx.restore();
        });

        /* body */
        const bg = ctx.createRadialGradient(cx - r * .1, cy, r * .05, cx, cy + r * .08, r * .46);
        bg.addColorStop(0,   '#d8a855');
        bg.addColorStop(0.5, '#b07830');
        bg.addColorStop(1,   '#885018');
        ctx.beginPath();
        ctx.ellipse(cx, cy + r * .08, r * .39, r * .49, .15, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();

        /* wing */
        ctx.beginPath();
        ctx.ellipse(cx - r * .18, cy + r * .1, r * .33, r * .2, .4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(155, 85, 18, 0.68)';
        ctx.fill();
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - r * .38 + i * r * .078, cy + r * .26);
            ctx.bezierCurveTo(cx - r * .36 + i * r * .078, cy + r * .06, cx - r * .23 + i * r * .078, cy, cx - r * .19 + i * r * .078, cy - r * .1);
            ctx.strokeStyle = 'rgba(75,35,6,0.32)';
            ctx.lineWidth   = r * .014;
            ctx.stroke();
        }

        /* saddle feathers */
        ctx.beginPath();
        ctx.ellipse(cx - r * .04, cy - r * .25, r * .22, r * .31, -.18, 0, Math.PI * 2);
        const sg = ctx.createLinearGradient(cx, cy - r * .52, cx, cy - r * .04);
        sg.addColorStop(0, '#e8c060');
        sg.addColorStop(1, '#a07030');
        ctx.fillStyle = sg;
        ctx.fill();

        /* neck */
        ctx.beginPath();
        ctx.ellipse(cx + r * .12, cy - r * .33, r * .155, r * .29, -.12, 0, Math.PI * 2);
        ctx.fillStyle = '#c08840';
        ctx.fill();

        /* head */
        const hhg = ctx.createRadialGradient(cx + r * .1, cy - r * .5, r * .04, cx + r * .15, cy - r * .48, r * .22);
        hhg.addColorStop(0, '#d49850');
        hhg.addColorStop(1, '#a87030');
        ctx.beginPath();
        ctx.arc(cx + r * .15, cy - r * .48, r * .215, 0, Math.PI * 2);
        ctx.fillStyle = hhg;
        ctx.fill();

        /* comb (2 bumps) */
        ctx.beginPath();
        ctx.moveTo(cx + r * .08,  cy - r * .64);
        ctx.bezierCurveTo(cx + r * .06,  cy - r * .79, cx + r * .17, cy - r * .79, cx + r * .17, cy - r * .64);
        ctx.bezierCurveTo(cx + r * .21,  cy - r * .83, cx + r * .31, cy - r * .82, cx + r * .29, cy - r * .64);
        ctx.fillStyle = '#cc2015';
        ctx.fill();

        /* wattle */
        ctx.beginPath();
        ctx.ellipse(cx + r * .1, cy - r * .38, r * .062, r * .082, .22, 0, Math.PI * 2);
        ctx.fillStyle = '#cc2015';
        ctx.fill();

        /* beak */
        ctx.beginPath();
        ctx.moveTo(cx + r * .33, cy - r * .48);
        ctx.lineTo(cx + r * .49, cy - r * .43);
        ctx.lineTo(cx + r * .34, cy - r * .38);
        ctx.closePath();
        ctx.fillStyle = '#d48010';
        ctx.fill();

        /* eye */
        ctx.beginPath();
        ctx.arc(cx + r * .22, cy - r * .52, r * .052, 0, Math.PI * 2);
        ctx.fillStyle = '#c06010';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * .22, cy - r * .52, r * .03, 0, Math.PI * 2);
        ctx.fillStyle = '#1a0800';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * .24, cy - r * .54, r * .01, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        /* legs */
        ctx.strokeStyle = '#c89010';
        ctx.lineWidth   = r * .048;
        ctx.lineCap     = 'round';
        [[cx - r * .05, cx - r * .09], [cx + r * .19, cx + r * .23]].forEach(([x, xb]) => {
            ctx.beginPath();
            ctx.moveTo(x, cy + r * .55); ctx.lineTo(xb, cy + r * .77); ctx.stroke();
            ctx.lineWidth = r * .028;
            ctx.beginPath();
            ctx.moveTo(xb, cy + r * .77); ctx.lineTo(xb - r * .17, cy + r * .87);
            ctx.moveTo(xb, cy + r * .77); ctx.lineTo(xb + r * .01, cy + r * .9);
            ctx.moveTo(xb, cy + r * .77); ctx.lineTo(xb + r * .17, cy + r * .85);
            ctx.stroke();
            ctx.lineWidth = r * .048;
        });

        ctx.restore();
    }

    /* ══════════════════════════════
       STAGE 3 — DEWASA (Adult)
    ══════════════════════════════ */
    function drawAdult(cx, cy, r, breathe) {
        ctx.save();
        const bob = breathe * r * .013;

        /* === tail feathers (drawn first, behind body) === */
        [
            { a: -2.58, l: r * 1.05, w: .075, base: '#1a1525', shimmer: 'rgba(25,120,55,0.5)'  },
            { a: -2.38, l: r * 1.18, w: .062, base: '#1a1525', shimmer: 'rgba(18,100,48,0.45)' },
            { a: -2.18, l: r * 1.1,  w: .070, base: '#1a1525', shimmer: 'rgba(38,145,65,0.4)'  },
            { a: -2.72, l: r * .92,  w: .055, base: '#1a1525', shimmer: 'rgba(10,90,40,0.35)'  },
        ].forEach(d => {
            ctx.save();
            ctx.translate(cx - r * .44, cy - r * .04 + bob);
            ctx.rotate(d.a);
            ctx.beginPath();
            ctx.ellipse(0, -d.l / 2, r * d.w, d.l / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = d.base;
            ctx.fill();
            ctx.fillStyle = d.shimmer;
            ctx.fill();
            /* quill */
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -d.l);
            ctx.strokeStyle = 'rgba(55,85,55,0.28)';
            ctx.lineWidth   = r * .007;
            ctx.stroke();
            ctx.restore();
        });

        /* === body === */
        const bg = ctx.createRadialGradient(cx - r * .12, cy - r * .07 + bob, r * .06, cx, cy + r * .08 + bob, r * .55);
        bg.addColorStop(0,    '#de8e55');
        bg.addColorStop(0.42, '#b46030');
        bg.addColorStop(0.84, '#843010');
        bg.addColorStop(1,    '#5a1e08');
        ctx.beginPath();
        ctx.ellipse(cx, cy + r * .08 + bob, r * .45, r * .55, .15, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();

        /* wing overlay */
        ctx.beginPath();
        ctx.ellipse(cx - r * .2, cy + r * .08 + bob, r * .41, r * .27, .32, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(135, 65, 15, 0.62)';
        ctx.fill();
        /* wing feather lines */
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - r * .44 + i * r * .072, cy + r * .3  + bob);
            ctx.bezierCurveTo(
                cx - r * .42 + i * r * .072, cy + r * .08 + bob,
                cx - r * .28 + i * r * .072, cy + r * .02 + bob,
                cx - r * .22 + i * r * .072, cy - r * .1  + bob
            );
            ctx.strokeStyle = 'rgba(55,20,4,0.28)';
            ctx.lineWidth   = r * .013;
            ctx.stroke();
        }

        /* saddle feathers (golden) */
        ctx.beginPath();
        ctx.ellipse(cx - r * .04, cy - r * .27 + bob, r * .24, r * .35, -.2, 0, Math.PI * 2);
        const sg = ctx.createLinearGradient(cx, cy - r * .6 + bob, cx, cy - r * .02 + bob);
        sg.addColorStop(0,   '#f8d870');
        sg.addColorStop(0.5, '#d4983a');
        sg.addColorStop(1,   '#a07020');
        ctx.fillStyle = sg;
        ctx.fill();

        /* neck hackle */
        ctx.beginPath();
        ctx.ellipse(cx + r * .14, cy - r * .39 + bob, r * .145, r * .31, -.1, 0, Math.PI * 2);
        ctx.fillStyle = '#cc9040';
        ctx.fill();
        /* hackle sheen */
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(cx + r * .14 + i * r * .038, cy - r * .09 + bob);
            ctx.lineTo(cx + r * .14 + i * r * .028, cy - r * .64 + bob);
            ctx.strokeStyle = 'rgba(255,225,110,0.11)';
            ctx.lineWidth   = r * .011;
            ctx.stroke();
        }

        /* head */
        const hhg = ctx.createRadialGradient(cx + r * .12, cy - r * .62 + bob, r * .05, cx + r * .2, cy - r * .6 + bob, r * .24);
        hhg.addColorStop(0,   '#dca058');
        hhg.addColorStop(0.6, '#b07838');
        hhg.addColorStop(1,   '#885020');
        ctx.beginPath();
        ctx.arc(cx + r * .2, cy - r * .6 + bob, r * .235, 0, Math.PI * 2);
        ctx.fillStyle = hhg;
        ctx.fill();

        /* large comb (3 lobes) */
        ctx.beginPath();
        ctx.moveTo(cx + r * .1,  cy - r * .79 + bob);
        ctx.bezierCurveTo(cx + r * .07, cy - r * .98 + bob, cx + r * .18, cy - r * .99 + bob, cx + r * .18, cy - r * .8  + bob);
        ctx.bezierCurveTo(cx + r * .21, cy - r * 1.01 + bob, cx + r * .31, cy - r * 1.0  + bob, cx + r * .29, cy - r * .81 + bob);
        ctx.bezierCurveTo(cx + r * .31, cy - r * .97 + bob, cx + r * .41, cy - r * .96  + bob, cx + r * .38, cy - r * .8  + bob);
        ctx.lineTo(cx + r * .1, cy - r * .79 + bob);
        ctx.fillStyle = '#cc1515';
        ctx.fill();

        /* wattles */
        ctx.beginPath();
        ctx.ellipse(cx + r * .12, cy - r * .5  + bob, r * .072, r * .1,   .26, 0, Math.PI * 2);
        ctx.fillStyle = '#cc1515';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * .22, cy - r * .5  + bob, r * .066, r * .092, -.26, 0, Math.PI * 2);
        ctx.fillStyle = '#cc1515';
        ctx.fill();

        /* beak */
        ctx.beginPath();
        ctx.moveTo(cx + r * .4,  cy - r * .62 + bob);
        ctx.lineTo(cx + r * .58, cy - r * .57 + bob);
        ctx.lineTo(cx + r * .41, cy - r * .5  + bob);
        ctx.closePath();
        ctx.fillStyle = '#d4880a';
        ctx.fill();
        /* nostril */
        ctx.beginPath();
        ctx.moveTo(cx + r * .42, cy - r * .6  + bob);
        ctx.lineTo(cx + r * .52, cy - r * .585 + bob);
        ctx.strokeStyle = 'rgba(0,0,0,0.28)';
        ctx.lineWidth   = r * .01;
        ctx.stroke();

        /* eye */
        ctx.beginPath();
        ctx.arc(cx + r * .285, cy - r * .64 + bob, r * .07, 0, Math.PI * 2);
        ctx.fillStyle = '#c86010';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * .285, cy - r * .64 + bob, r * .04, 0, Math.PI * 2);
        ctx.fillStyle = '#1a0800';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * .3,   cy - r * .66 + bob, r * .013, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        /* eyelid ring */
        ctx.beginPath();
        ctx.arc(cx + r * .285, cy - r * .64 + bob, r * .078, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(155,75,18,0.45)';
        ctx.lineWidth   = r * .011;
        ctx.stroke();

        /* legs */
        ctx.strokeStyle = '#c89010';
        ctx.lineWidth   = r * .058;
        ctx.lineCap     = 'round';
        [[cx - r * .06, cx - r * .1], [cx + r * .2, cx + r * .24]].forEach(([x, xb]) => {
            ctx.beginPath();
            ctx.moveTo(x,  cy + r * .6  + bob);
            ctx.lineTo(xb, cy + r * .85 + bob);
            ctx.stroke();
            ctx.lineWidth = r * .033;
            ctx.beginPath();
            ctx.moveTo(xb, cy + r * .85 + bob); ctx.lineTo(xb - r * .19, cy + r * .95 + bob);
            ctx.moveTo(xb, cy + r * .85 + bob); ctx.lineTo(xb + r * .01, cy + r * .98 + bob);
            ctx.moveTo(xb, cy + r * .85 + bob); ctx.lineTo(xb + r * .19, cy + r * .93 + bob);
            ctx.moveTo(xb, cy + r * .85 + bob); ctx.lineTo(xb - r * .12, cy + r * .76 + bob);
            ctx.stroke();
            ctx.lineWidth = r * .058;
        });

        /* iridescent tail sheen */
        ctx.save();
        ctx.translate(cx - r * .44, cy - r * .04 + bob);
        for (let i = 0; i < 4; i++) {
            ctx.rotate(-.18);
            ctx.beginPath();
            ctx.ellipse(0, -r * .62, r * .022, r * .52, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(50,200,95,0.2)';
            ctx.fill();
        }
        ctx.restore();

        ctx.restore();
    }

    /* ══════════════════════════════
       UI updates
    ══════════════════════════════ */
    function updateUI(p) {
        /* progress bar */
        const bar = document.getElementById('stage-bar-fill');
        if (bar) bar.style.width = (p * 100) + '%';

        /* current stage */
        const stage = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;

        if (stage !== lastStage) {
            lastStage = stage;

            /* dot states */
            document.querySelectorAll('.sdot').forEach((el, i) => {
                el.classList.toggle('active', i === stage);
            });

            /* descriptions */
            document.querySelectorAll('.stage-desc').forEach((el, i) => {
                el.classList.toggle('visible', i === stage);
            });

            /* burst on stage entry */
            const bColors = ['#f0e0a0', '#f5c030', '#88d840', '#e8a030'];
            burst(canvas.width / 2, canvas.height * .38, bColors[stage], 16, 4.5);
        }

        /* hide scroll hint once user has scrolled a bit */
        const hint = document.getElementById('scroll-hint');
        if (hint) hint.classList.toggle('hidden', p > 0.04);

        /* sky gradient shift */
        const sky = document.getElementById('evo-sky');
        if (sky) {
            const gradients = [
                'linear-gradient(180deg,#0a2040 0%,#0d4a6e 22%,#1a80b8 50%,#2ab8d0 72%,#28c870 88%,#1eb840 100%)',
                'linear-gradient(180deg,#082218 0%,#0c4a20 25%,#1a8035 55%,#2ab058 75%,#38c870 90%,#45e060 100%)',
                'linear-gradient(180deg,#0a2808 0%,#165a20 22%,#22903a 50%,#30b850 70%,#42d060 85%,#50e870 100%)',
                'linear-gradient(180deg,#181408 0%,#3a3010 22%,#6a6020 45%,#90a018 65%,#a8c020 80%,#c0d830 100%)',
            ];
            sky.style.background = gradients[stage];
        }
    }

    /* ══════════════════════════════
       RENDER LOOP
    ══════════════════════════════ */
    let prevP = -1;

    function render() {
        requestAnimationFrame(render);
        frame++;

        const p  = progress();
        const w  = canvas.width;
        const h  = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const cx      = w / 2;
        const cy      = h / 2;
        const r       = Math.min(w, h) * .34;
        const breathe = Math.sin(frame * .034);
        const hop     = -Math.abs(Math.sin(frame * .088)) * r * .04;

        updateUI(p);

        /* ground glow */
        const gg = ctx.createRadialGradient(cx, cy + r * .84, 0, cx, cy + r * .84, r * .55);
        gg.addColorStop(0,  'rgba(80,200,80,0.18)');
        gg.addColorStop(1,  'transparent');
        ctx.beginPath();
        ctx.ellipse(cx, cy + r * .84, r * .55, r * .12, 0, 0, Math.PI * 2);
        ctx.fillStyle = gg;
        ctx.fill();

        /* stage alphas — non-overlapping transitions */
        /* egg starts fully visible at p=0 (section entry) rather than fading in from blank */
        const aEgg   = stageAlpha(p, -0.01, 0.0,  0.2,  0.3);
        const aDOC   = stageAlpha(p,  0.2,  0.3,  0.44, 0.54);
        const aYoung = stageAlpha(p,  0.44, 0.54, 0.7,  0.78);
        const aAdult = stageAlpha(p,  0.7,  0.78, 1.0,  1.05);

        /* crack progresses in last third of egg stage */
        const crack  = p < 0.12 ? 0 : Math.min(1, (p - 0.12) / 0.1);

        /* particle burst on first crack */
        if (crack > 0.01 && prevP < 0.12) {
            burst(cx, cy - r * .1, '#e0c880', 14, 3.2);
        }
        prevP = p;

        if (aEgg > 0) {
            ctx.save();
            ctx.globalAlpha = aEgg;
            const floatY = Math.sin(frame * .024) * r * .016;
            drawEgg(cx, cy + floatY, r, crack);
            ctx.restore();
        }

        if (aDOC > 0) {
            ctx.save();
            ctx.globalAlpha = aDOC;
            shadow(cx, cy + r * .55 + hop, r * .26);
            drawDOC(cx, cy * .93 + hop, r * .76);
            ctx.restore();
        }

        if (aYoung > 0) {
            ctx.save();
            ctx.globalAlpha = aYoung;
            shadow(cx, cy + r * .65, r * .33);
            drawYoung(cx, cy * .95 + breathe * r * .008, r * .9);
            ctx.restore();
        }

        if (aAdult > 0) {
            ctx.save();
            ctx.globalAlpha = aAdult;
            shadow(cx, cy + r * .72, r * .4);
            drawAdult(cx, cy * .93, r, breathe);
            ctx.restore();
        }

        /* particles */
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].tick();
            particles[i].draw(ctx);
            if (particles[i].life <= 0) particles.splice(i, 1);
        }
    }

    /* ── parallax on scroll ── */
    window.addEventListener('scroll', () => {
        const sec = document.getElementById('evolution');
        if (!sec) return;
        const scrolled = window.scrollY - sec.offsetTop;
        const total    = sec.offsetHeight - window.innerHeight;
        const pv       = Math.max(0, Math.min(1, scrolled / total));
        const shift    = (pv - 0.5) * 50;

        const layers = [
            ['.nl-mountains',  0.06, 12 ],
            ['.nl-trees-far',  0.14, 22 ],
            ['.nl-trees-near', 0.26, 38 ],
            ['.nl-bushes',     0.4,  52 ],
            ['.nl-grass',      0.58, 68 ],
        ];
        layers.forEach(([sel, xs, ys]) => {
            const el = document.querySelector(sel);
            if (el) el.style.transform = `translateX(${shift * xs}px) translateY(${pv * ys}px)`;
        });
    }, { passive: true });

    render();

})();
