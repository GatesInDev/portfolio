import { marked } from './vendor/marked.js';
import DOMPurify from './vendor/purify.js';

// Render repository documentation without allowing its HTML to control the page.
export function renderReadme(item) {
    const article = document.createElement('article');
    article.className = 'project-readme markdown-body';
    article.setAttribute('aria-label', 'Documentação do projeto');
    article.innerHTML = DOMPurify.sanitize(marked.parse(item.readme, { gfm: true }), {
        ALLOWED_TAGS: ['p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'del', 's', 'blockquote', 'ul', 'ol', 'li', 'pre', 'code', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'details', 'summary', 'input'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'start', 'colspan', 'rowspan', 'align', 'type', 'checked', 'disabled'],
    });
    const source = item.readmeUrl || `${item.repoUrl}/blob/master/README.md`;
    const raw = item.readmeRawUrl || source.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/');
    const resolve = (value, base, image = false) => {
        try {
            const url = new URL(value, base);
            return (url.protocol === 'https:' || (!image && ['http:', 'mailto:'].includes(url.protocol))) ? url.href : null;
        } catch { return null; }
    };
    const anchors = new Map();
    article.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(heading => {
        const slug = heading.textContent.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
        let unique = slug;
        for (let n = 1; anchors.has(unique); n++) unique = `${slug}-${n}`;
        anchors.set(unique, heading);
        heading.id = `readme-${unique}`;
    });
    article.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#')) {
            let key;
            try { key = decodeURIComponent(href.slice(1)); } catch { key = href.slice(1); }
            const target = anchors.get(key);
            if (target) {
                link.href = `#${target.id}`;
                link.addEventListener('click', event => { event.preventDefault(); target.scrollIntoView({ block: 'start' }); });
                return;
            }
        }
        const url = resolve(href, source);
        if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
        else link.removeAttribute('href');
    });
    article.querySelectorAll('img').forEach(img => {
        const url = resolve(img.getAttribute('src') || '', raw, true);
        if (!url) { img.remove(); return; }
        img.src = url;
        img.loading = 'lazy';
        img.decoding = 'async';
    });
    article.querySelectorAll('input').forEach(input => {
        if (input.type !== 'checkbox') input.remove();
        else input.disabled = true;
    });
    article.querySelectorAll('table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'readme-table';
        wrapper.tabIndex = 0;
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', 'Tabela da documentação');
        table.replaceWith(wrapper);
        wrapper.append(table);
    });
    return article;
}
