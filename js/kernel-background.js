import { kernelSource } from './kernel-source.js';

// Decorative source visualization, not actual kernel execution.
const canvas = document.getElementById('kernel-background');
const ctx = canvas?.getContext('2d', { alpha: true });
if (ctx) {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const keywords = /^(?:static|void|struct|bool|unsigned|long|int|if|else|goto|false|true|return)$/;
    let comment = false;
    const lines = kernelSource.replace(/\t/g, '    ').split('\n').map(line => {
        const tokens = line.match(/\/\*.*|\*\/|\/\/.*|[A-Za-z_]\w*|\d+|[^\w\s]|\s+/g) || [];
        return tokens.map(text => {
            if (text.startsWith('/*')) comment = true;
            const color = comment || text.startsWith('//') ? '#718776'
                : keywords.test(text) ? '#b8c58e'
                : /^[A-Z_]{2,}$/.test(text) ? '#a5ba9e' : '#89aa9a';
            if (text.includes('*/')) comment = false;
            return { text, color };
        });
    });
    let width = 0, height = 0, rowHeight = 24, fontSize = 13;
    let camera = 0, target = 0, frame = 0, previousTime = 0, activeLine = 18;
    let route = 0;
    const sectionOffsets = { home: 0, projects: 42, articles: 94, contact: 148 };

    function updateTarget() {
        const hash = location.hash.slice(1);
        const section = hash.startsWith('project/') ? 'projects'
            : /^(article\/|post\/|blog)/.test(hash) ? 'articles' : hash;
        route = sectionOffsets[section] || 0;
        target = route * rowHeight + Math.min(scrollY * .28, rowHeight * 80);
        if (motion.matches) { camera = target; draw(); } else requestDraw();
    }

    function resize() {
        width = document.documentElement.clientWidth;
        height = innerHeight;
        const ratio = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        fontSize = width < 600 ? 11 : 13;
        rowHeight = width < 600 ? 22 : 26;
        updateTarget();
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
        ctx.textBaseline = 'top';
        const columns = width > 1000 ? 2 : 1;
        const columnWidth = width / columns;
        const rows = Math.ceil(height / rowHeight) + 3;
        for (let col = 0; col < columns; col++) {
            ctx.save();
            ctx.beginPath(); ctx.rect(col * columnWidth, 0, columnWidth - 16, height); ctx.clip();
            const first = Math.floor(camera / rowHeight) + col * 67;
            for (let row = 0; row < rows; row++) {
                const index = ((first + row) % lines.length + lines.length) % lines.length;
                const y = row * rowHeight - camera % rowHeight;
                const x = col * columnWidth + 28;
                if (index === activeLine && !motion.matches) {
                    ctx.fillStyle = 'rgba(153, 183, 120, .15)';
                    ctx.fillRect(x - 6, y - 4, columnWidth - 40, rowHeight);
                    ctx.fillStyle = '#b8c58e'; ctx.fillRect(x - 6, y - 4, 2, rowHeight);
                }
                ctx.fillStyle = '#556d5c';
                ctx.fillText(String(index + 1).padStart(3, '0'), x, y);
                let textX = x + 42;
                for (const token of lines[index]) {
                    ctx.fillStyle = token.color;
                    ctx.fillText(token.text, textX, y);
                    textX += ctx.measureText(token.text).width;
                    if (textX > (col + 1) * columnWidth) break;
                }
            }
            ctx.restore();
        }
    }

    function animate(time) {
        frame = 0;
        if (document.hidden || motion.matches) return;
        const dt = Math.min(time - (previousTime || time), 64);
        previousTime = time;
        camera += (target - camera) * (1 - Math.exp(-dt / 160));
        if (Math.abs(target - camera) < .2) camera = target;
        draw();
        if (camera !== target) requestDraw();
    }
    function requestDraw() {
        if (!frame && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
    }
    // A slow highlight suggests execution; no perpetual animation loop at rest.
    const timer = setInterval(() => {
        if (document.hidden || motion.matches) return;
        activeLine = (Math.floor(camera / rowHeight) + 7 + (activeLine + 1) % 17) % lines.length;
        requestDraw();
    }, 1000);
    addEventListener('scroll', updateTarget, { passive: true });
    addEventListener('hashchange', updateTarget);
    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => { previousTime = 0; if (!document.hidden) updateTarget(); });
    motion.addEventListener('change', () => {
        cancelAnimationFrame(frame); frame = 0; camera = target; draw();
    });
    addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
    addEventListener('pageshow', () => { previousTime = 0; updateTarget(); });
    resize();
}
