import './kernel-background.js';
import { projects, syncProjects } from './data.js';
import { posts, loadArticles } from './posts.js';

const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');



let catalogLoading = true;
let activeFilter = 'all';
let carouselTimer = null;
const featuredProjects = projects.filter(p => p.featured);

const CATEGORY_LABEL = {
    dotnet: '.NET', infra: 'Infrastructure', java: 'Java',
    linux: 'Linux', web: 'Web', other: 'Other'
};

// ── Routing ────────────────────────────────────────────

function handleRoute({ resetScroll = true } = {}) {
    if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }

    const hash = window.location.hash || '#home';
    const route = hash.slice(1).replace(/^blog$/, 'articles').replace(/^post\//, 'article/');

    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href');
        const isActive = linkHash === `#${route}` ||
            (linkHash === '#projects' && route.startsWith('project/')) ||
            (linkHash === '#articles' && route.startsWith('article/'));
        link.classList.toggle('active', isActive);
    });

    renderView(route);
    // Route changes start at the top without animating the previous page's scroll.
    if (resetScroll) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function renderView(route) {
    mainContent.innerHTML = '';

    if (route.startsWith('project/')) {
        renderDetail(route.split('/')[1]);
        return;
    }
    if (route.startsWith('article/')) {
        renderBlogPost(route.split('/')[1]);
        return;
    }

    switch (route) {
        case 'home':     renderHome();     break;
        case 'projects': activeFilter = 'all'; renderProjects(); break;
        case 'articles':     renderBlog();     break;
        case 'contact':  renderContact();  break;
        default:         renderHome();
    }
}

// ── Render Functions ───────────────────────────────────

function renderHome() {
    const clone = document.getElementById('home-template').content.cloneNode(true);
    mainContent.appendChild(clone);
}

function renderProjects() {
    const clone = document.getElementById('projects-template').content.cloneNode(true);
    const grid   = clone.querySelector('#dev-grid');
    const chips  = clone.querySelectorAll('.filter-chip');
    const section = clone.querySelector('.projects-view');

    if (featuredProjects.length > 0) {
        section.insertBefore(buildCarousel(featuredProjects, true), section.firstChild);
    }

    chips.forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === activeFilter);
        chip.addEventListener('click', () => {
            activeFilter = chip.dataset.filter;
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderCards(grid);
        });
    });

    renderCards(grid);
    mainContent.appendChild(clone);
}

function renderCards(grid) {
    grid.innerHTML = '';
    const filtered = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.category === activeFilter);

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No projects in this category yet. Stay tuned!</p>';
        return;
    }

    filtered.forEach((project, i) => {
        const card = createCard(project);
        card.style.animationDelay = `${i * 0.07}s`;
        grid.appendChild(card);
    });
}

function renderContact() {
    const clone = document.getElementById('contact-template').content.cloneNode(true);
    mainContent.appendChild(clone);
}

// ── Featured Carousel ──────────────────────────────────

function buildCarousel(items, topLevel) {
    const section = document.createElement('section');
    section.className = topLevel
        ? 'featured-section featured-section--top'
        : 'featured-section';
    section.setAttribute('aria-label', 'Featured projects');

    section.innerHTML = `
        <div class="featured-header">
            <span class="section-rune" aria-hidden="true">◈</span>
            <span>Featured</span>
        </div>
        <div class="carousel-wrap">
            <div class="carousel-viewport">
                <div class="carousel-track">
                    ${items.map((item, i) => {
                        return `
                        <div class="carousel-slide ${item.image ? '' : 'carousel-slide--no-img'}" role="group" aria-label="Slide ${i + 1} of ${items.length}">
                            ${item.image ? `<img src="${item.image}" alt="${item.title}" loading="${i === 0 ? 'eager' : 'lazy'}">` : ''}
                            <div class="carousel-overlay">
                                <span class="carousel-badge">${CATEGORY_LABEL[item.category] || item.category}</span>
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <div class="carousel-ctas">
                                    <a href="#project/${item.id}" class="btn primary" onclick="event.stopPropagation()">View Details</a>
                                    ${item.demoUrl ? `<a href="${item.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn secondary" onclick="event.stopPropagation()">Live Demo ↗</a>` : ''}
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
            <button class="carousel-prev" aria-label="Previous slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <button class="carousel-next" aria-label="Next slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
        </div>
        <div class="carousel-dots" role="tablist" aria-label="Go to slide">
            ${items.map((_, i) => `
                <button class="carousel-dot ${i === 0 ? 'active' : ''}"
                        data-index="${i}" role="tab"
                        aria-selected="${i === 0}"
                        aria-label="Slide ${i + 1}"></button>
            `).join('')}
        </div>
    `;

    const track    = section.querySelector('.carousel-track');
    const dots     = section.querySelectorAll('.carousel-dot');
    const prevBtn  = section.querySelector('.carousel-prev');
    const nextBtn  = section.querySelector('.carousel-next');
    const viewport = section.querySelector('.carousel-viewport');
    const total    = items.length;
    let   index    = 0;

    function goTo(n) {
        index = ((n % total) + total) % total;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
            d.setAttribute('aria-selected', i === index);
        });
    }

    function start() {
        carouselTimer = setInterval(() => goTo(index + 1), 5000);
    }

    function reset() { clearInterval(carouselTimer); start(); }

    prevBtn.addEventListener('click', () => { reset(); goTo(index - 1); });
    nextBtn.addEventListener('click', () => { reset(); goTo(index + 1); });
    dots.forEach(d => d.addEventListener('click', () => { reset(); goTo(+d.dataset.index); }));

    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 50) { reset(); goTo(index + (dx < 0 ? 1 : -1)); }
    });

    viewport.addEventListener('mouseenter', () => clearInterval(carouselTimer));
    viewport.addEventListener('mouseleave', start);

    start();
    return section;
}

// ── Project Cards ──────────────────────────────────────

function createCard(item) {
    const div = document.createElement('div');
    div.className = 'card fade-in';
    div.onclick = () => window.location.hash = `project/${item.id}`;

    const label = CATEGORY_LABEL[item.category] || item.category;

    div.innerHTML = `
        ${item.image
            ? `<div class="card-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <span class="card-category-badge">${label}</span>
               </div>`
            : `<div class="card-image card-image--placeholder">
                <div class="card-placeholder-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <span class="card-category-badge">${label}</span>
               </div>`
        }
        <div class="card-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    return div;
}

// ── Detail View ────────────────────────────────────────

function renderDetail(id) {
    const item = projects.find(p => p.id === id);
    if (!item) { window.location.hash = '#home'; return; }

    const clone   = document.getElementById('detail-template').content.cloneNode(true);
    const content = clone.querySelector('.detail-content');

    content.innerHTML = `
        ${item.image ? `
        <div class="detail-cover fade-in">
            <div class="detail-glow" style="background-image: url('${item.image}')"></div>
            <img src="${item.image}" alt="${item.title}" class="detail-image" onclick="openLightbox('${item.id}', 0)">
        </div>` : ''}

        <h2 class="fade-in delay-1">${item.title}</h2>

        <div class="detail-meta fade-in delay-2">
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>

        <div class="detail-desc fade-in delay-2">
            <p>${item.fullDescription}</p>
        </div>

        ${item.features ? `
            <div class="detail-section fade-in delay-2">
                <h3>Key Features</h3>
                <ul class="feature-list">
                    ${item.features.map(f => `<li><span class="feat-icon">◈</span>${f}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${item.gallery && item.gallery.length ? `
            <div class="detail-section fade-in delay-3">
                <h3>Gallery</h3>
                <div class="gallery-grid">
                    ${item.gallery.map((img, i) =>
                        `<img src="${img}" alt="Project screenshot" loading="lazy" onclick="openLightbox('${item.id}', ${i})">`
                    ).join('')}
                </div>
            </div>
        ` : ''}

        <div class="detail-links fade-in delay-3">
            ${item.repoUrl ? `<a href="${item.repoUrl}" target="_blank" class="btn primary">View Code</a>` : ''}
            ${item.demoUrl ? `<a href="${item.demoUrl}" target="_blank" class="btn secondary">Live Demo</a>` : ''}
        </div>
    `;

    if (item.readme) {
        const section = document.createElement('section');section.className='project-readme';
        const heading = document.createElement('h3');heading.textContent='README';
        const body=document.createElement('pre');body.textContent=item.readme;
        section.append(heading,body);content.append(section);
    }
    mainContent.appendChild(clone);

}

// ── Lightbox ───────────────────────────────────────────

let currentGallery = [];
let currentIndex   = 0;
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

window.openLightbox = (projectId, index) => {
    const project = projects.find(p => p.id === projectId);
    if (project && project.gallery && project.gallery.length) {
        currentGallery = project.gallery;
        currentIndex   = index;
        updateLightboxImage();
        lightbox.classList.remove('hidden');
        requestAnimationFrame(() => lightbox.classList.add('active'));
    }
};

function updateLightboxImage() { lightboxImg.src = currentGallery[currentIndex]; }

window.closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => { lightbox.classList.add('hidden'); lightboxImg.src = ''; }, 300);
};

window.nextImage = e => {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
};

window.prevImage = e => {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
};

document.getElementById('lightbox-close').addEventListener('click', window.closeLightbox);
document.getElementById('lightbox-next').addEventListener('click', window.nextImage);
document.getElementById('lightbox-prev').addEventListener('click', window.prevImage);
lightbox.addEventListener('click', e => { if (e.target === lightbox) window.closeLightbox(); });

document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      window.closeLightbox();
    if (e.key === 'ArrowRight')  window.nextImage();
    if (e.key === 'ArrowLeft')   window.prevImage();
});

// ── Blog ───────────────────────────────────────────────

function renderBlog() {
    const clone = document.getElementById('articles-template').content.cloneNode(true);
    const grid  = clone.querySelector('#post-grid');

    if (posts.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Nenhum artigo publicado ainda.</p>';
    } else {
        posts.forEach((post, i) => {
            const card = createPostCard(post);
            card.style.animationDelay = `${i * 0.07}s`;
            grid.appendChild(card);
        });
    }

    mainContent.appendChild(clone);
    if (window.articleCatalogNotice) mainContent.appendChild(window.articleCatalogNotice.cloneNode(true));
}

function createPostCard(post) {
    const div  = document.createElement('div');
    div.className = 'post-card fade-in';
    const open = () => window.location.hash = `article/${post.id}`;
    div.onclick = open;
    div.tabIndex = 0;
    div.setAttribute('role', 'link');
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

    const dateFormatted = post.date ? new Date(post.date + 'T12:00:00').toLocaleDateString('pt-BR', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : 'Artigo em PDF';

    div.innerHTML = `
        <time class="post-date">${dateFormatted}</time>
        <h3>${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="tags">
            ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <span class="post-read-more">${post.type === 'pdf' ? 'Acessar PDF →' : 'Ler mais →'}</span>
    `;
    return div;
}

function renderBlogPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post && catalogLoading) {
        mainContent.innerHTML = '<p class="empty-msg" role="status">Carregando artigo…</p>';
        return;
    }
    if (!post) {
        mainContent.innerHTML = '<p class="empty-msg">Artigo não encontrado. <a href="#articles">Ver artigos</a></p>';
        return;
    }

    const clone   = document.getElementById('articles-post-template').content.cloneNode(true);
    const content = clone.querySelector('.post-content');
    const backBtn = clone.querySelector('#articles-post-back-btn');

    backBtn.onclick = () => { window.location.hash = 'articles'; };

    const dateFormatted = post.date ? new Date(post.date + 'T12:00:00').toLocaleDateString('pt-BR', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : 'Artigo em PDF';

    let contentHtml = '';
    
    if (post.type === 'pdf') {
        contentHtml = `
            <time class="post-date fade-in">${dateFormatted}</time>
            <h2 class="fade-in delay-1">${post.title}</h2>
            <div class="tags fade-in delay-1">
                ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div class="pdf-metadata fade-in delay-2">
                <div class="metadata-item"><strong>Autor:</strong> ${post.metadata.author}</div>
                <div class="metadata-item"><strong>Instituição:</strong> ${post.metadata.university}</div>
                <div class="metadata-item"><strong>Local:</strong> ${post.metadata.location}</div>
                
                <h3 class="abstract-title">Resumo</h3>
                <p class="abstract-text">${post.metadata.abstract}</p>
                
                ${post.supplementUrl ? `<div class="article-supplement"><h3>Nota técnica complementar</h3><p>Reprodutibilidade e geração de carga de testes.</p><a href="${post.supplementUrl}" target="_blank" rel="noopener noreferrer" class="btn secondary">Ler nota técnica ↗</a></div>` : ''}
                <div class="pdf-actions">
                    <a href="${post.pdfUrl}" class="btn primary" download>Baixar PDF</a>
                    <a href="${post.pdfUrl}" class="btn secondary" target="_blank">Abrir no Navegador</a>
                </div>
            </div>
        `;
    } else {
        contentHtml = `
            <time class="post-date fade-in">${dateFormatted}</time>
            <h2 class="fade-in delay-1">${post.title}</h2>
            <div class="tags fade-in delay-1">
                ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div class="post-body fade-in delay-2">${post.content}</div>
        `;
    }

    content.innerHTML = contentHtml;

    mainContent.appendChild(clone);

}

// ── Init ───────────────────────────────────────────────

window.addEventListener('hashchange', () => handleRoute());
async function initializePortfolio() {
    handleRoute();
    syncProjects().then(() => { if (location.hash.startsWith('#project')) handleRoute({ resetScroll: false }); }).catch(() => {});
    try { await loadArticles(); } catch {
        const notice = document.createElement('p');
        notice.className = 'catalog-notice';
        notice.textContent = 'Não foi possível atualizar o catálogo. Tente recarregar a página ou consulte os PDFs no GitHub.';
        const link = document.createElement('a');
        link.href = 'https://github.com/GatesInDev/portfolio/tree/master/pdfs';
        link.textContent = ' Ver artigos no GitHub';
        notice.appendChild(link);
        window.articleCatalogNotice = notice;
    }
    catalogLoading = false;
    // Background discovery must not restart a project carousel or move the page.
    if (/^#(articles|article\/|blog|post\/)/.test(window.location.hash)) {
        handleRoute({ resetScroll: false });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio, { once: true });
} else {
    initializePortfolio();
}
// The optional GPU scene must never delay the initial content.
import('./kernel-scene.js').catch(error => console.info('Scene unavailable:', error.message));

import './terminal.js';
