import { projects } from './data.js';
import { posts } from './posts.js';
import { headphones, vinyls, audioPreferences } from './audio.js';
import { ParticleNetwork } from './particles.js';

const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');

new ParticleNetwork('bg-canvas');

let activeFilter = 'all';
let carouselTimer = null;
const featuredProjects = projects.filter(p => p.featured);

const CATEGORY_LABEL = {
    dotnet: '.NET', infra: 'Infrastructure', java: 'Java',
    linux: 'Linux', web: 'Web', other: 'Other'
};

// ── Routing ────────────────────────────────────────────

function handleRoute() {
    if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }

    const hash = window.location.hash || '#home';
    const route = hash.slice(1);

    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href');
        const isActive = linkHash === hash ||
            (linkHash === '#projects' && route.startsWith('project/')) ||
            (linkHash === '#blog' && route.startsWith('post/'));
        link.classList.toggle('active', isActive);
    });

    renderView(route);
}

function renderView(route) {
    mainContent.innerHTML = '';

    if (route.startsWith('project/')) {
        renderDetail(route.split('/')[1]);
        return;
    }
    if (route.startsWith('post/')) {
        renderBlogPost(route.split('/')[1]);
        return;
    }

    switch (route) {
        case 'home':     renderHome();     break;
        case 'projects': activeFilter = 'all'; renderProjects(); break;
        case 'blog':     renderBlog();     break;
        case 'audio':    renderAudio();    break;
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

    mainContent.appendChild(clone);
    window.scrollTo(0, 0);
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
    const clone = document.getElementById('blog-template').content.cloneNode(true);
    const grid  = clone.querySelector('#post-grid');

    if (posts.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Nenhum post ainda. Em breve!</p>';
    } else {
        posts.forEach((post, i) => {
            const card = createPostCard(post);
            card.style.animationDelay = `${i * 0.07}s`;
            grid.appendChild(card);
        });
    }

    mainContent.appendChild(clone);
}

function createPostCard(post) {
    const div  = document.createElement('div');
    div.className = 'post-card fade-in';
    div.onclick   = () => window.location.hash = `post/${post.id}`;

    const dateFormatted = new Date(post.date + 'T12:00:00').toLocaleDateString('pt-BR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    div.innerHTML = `
        <time class="post-date">${dateFormatted}</time>
        <h3>${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="tags">
            ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <span class="post-read-more">Ler mais →</span>
    `;
    return div;
}

function renderBlogPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) { window.location.hash = 'blog'; return; }

    const clone   = document.getElementById('blog-post-template').content.cloneNode(true);
    const content = clone.querySelector('.post-content');
    const backBtn = clone.querySelector('#blog-post-back-btn');

    backBtn.onclick = () => { window.location.hash = 'blog'; };

    const dateFormatted = new Date(post.date + 'T12:00:00').toLocaleDateString('pt-BR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    content.innerHTML = `
        <time class="post-date fade-in">${dateFormatted}</time>
        <h2 class="fade-in delay-1">${post.title}</h2>
        <div class="tags fade-in delay-1">
            ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="post-body fade-in delay-2">${post.content}</div>
    `;

    mainContent.appendChild(clone);
    window.scrollTo(0, 0);
}

// ── Audio ──────────────────────────────────────────────

function renderAudio() {
    const clone = document.getElementById('audio-template').content.cloneNode(true);

    buildHeadphonesSection(clone.querySelector('#hp-grid'));
    buildVinylSection(clone.querySelector('#vinyl-grid'));
    buildPreferencesSection(clone.querySelector('#audio-pref-content'));

    mainContent.appendChild(clone);
}

function buildHeadphonesSection(container) {
    if (headphones.length === 0) {
        container.innerHTML = '<p class="empty-msg">Coleção sendo catalogada — em breve aqui.</p>';
        return;
    }
    headphones.forEach((hp, i) => {
        const card = createHeadphoneCard(hp);
        card.style.animationDelay = `${i * 0.07}s`;
        container.appendChild(card);
    });
}

function createHeadphoneCard(hp) {
    const div = document.createElement('div');
    div.className = 'hp-card fade-in';

    const statusLabels = { owned: 'Tenho', sold: 'Vendi', wishlist: 'Wishlist' };
    const statusClass  = `hp-status--${hp.status || 'owned'}`;
    const statusLabel  = statusLabels[hp.status] || hp.status;

    div.innerHTML = `
        ${hp.image ? `
            <div class="hp-card-image">
                <img src="${hp.image}" alt="${hp.name}" loading="lazy">
            </div>
        ` : ''}
        <div class="hp-card-header">
            <span class="hp-name">${hp.name}</span>
            <span class="hp-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="hp-meta">
            ${hp.type      ? `<span class="hp-meta-pill">${hp.type}</span>` : ''}
            ${hp.driver    ? `<span class="hp-meta-pill">${hp.driver}</span>` : ''}
            ${hp.signature ? `<span class="hp-signature-badge">${hp.signature}</span>` : ''}
        </div>
        ${hp.notes ? `<p class="hp-notes">${hp.notes}</p>` : ''}
        ${hp.squigUrl ? `
            <button class="squig-link" type="button"
                    data-squig-url="${hp.squigUrl}"
                    data-hp-name="${hp.name}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Ver squig
            </button>
        ` : ''}
    `;

    const squigBtn = div.querySelector('.squig-link');
    if (squigBtn) {
        squigBtn.addEventListener('click', e => {
            e.stopPropagation();
            openSquigModal(squigBtn.dataset.squigUrl, squigBtn.dataset.hpName, squigBtn);
        });
    }

    return div;
}

function buildVinylSection(container) {
    if (vinyls.length === 0) {
        container.innerHTML = '<p class="empty-msg">Discoteca sendo catalogada — em breve aqui.</p>';
        return;
    }
    vinyls.forEach((vinyl, i) => {
        const card = createVinylCard(vinyl);
        card.style.animationDelay = `${i * 0.07}s`;
        container.appendChild(card);
    });
}

function createVinylCard(vinyl) {
    const div = document.createElement('div');
    div.className = 'vinyl-card fade-in';

    div.innerHTML = `
        <div class="vinyl-art">
            ${vinyl.image
                ? `<img src="${vinyl.image}" alt="${vinyl.album}" loading="lazy">`
                : `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`
            }
        </div>
        <div class="vinyl-info">
            <div class="vinyl-album">${vinyl.album}</div>
            <div class="vinyl-artist">${vinyl.artist}</div>
            <div class="vinyl-meta">
                ${vinyl.year  ? `<span class="vinyl-year">${vinyl.year}</span>` : ''}
                ${vinyl.genre ? `<span class="vinyl-genre">${vinyl.genre}</span>` : ''}
            </div>
        </div>
    `;
    return div;
}

function buildPreferencesSection(container) {
    const { targetCurve, signatures, notes, squigs } = audioPreferences;
    const hasPrefs  = targetCurve || signatures.length || notes;
    const hasSquigs = squigs && squigs.length;

    if (!hasPrefs && !hasSquigs) {
        container.innerHTML = '<p class="empty-msg">Preferências sendo documentadas — em breve aqui.</p>';
        return;
    }

    if (hasPrefs) {
        const block = document.createElement('div');
        block.className = 'audio-pref-block fade-in';
        block.innerHTML = `
            ${targetCurve ? `
                <div class="audio-pref-row">
                    <span class="audio-pref-label">Curva alvo</span>
                    <span class="audio-pref-value">${targetCurve}</span>
                </div>
            ` : ''}
            ${signatures.length ? `
                <div class="audio-pref-row">
                    <span class="audio-pref-label">Assinaturas preferidas</span>
                    <div class="audio-sig-list">
                        ${signatures.map(s => `<span class="tag">${s}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            ${notes ? `
                <div class="audio-pref-row">
                    <span class="audio-pref-label">Notas</span>
                    <p class="hp-notes">${notes}</p>
                </div>
            ` : ''}
        `;
        container.appendChild(block);
    }

    if (hasSquigs) {
        squigs.forEach((squig, i) => {
            const card = document.createElement('div');
            card.className = 'squig-embed-card fade-in';
            card.style.animationDelay = `${i * 0.1}s`;
            card.innerHTML = `
                <div class="squig-embed-header">
                    <span class="squig-embed-label">${squig.label}</span>
                    <a href="${squig.url}" target="_blank" rel="noopener noreferrer"
                       class="btn secondary squig-external-btn">Abrir no site ↗</a>
                </div>
                <div class="squig-embed-body">
                    <iframe src="${squig.url}" title="${squig.label}" loading="lazy"></iframe>
                </div>
                ${squig.description ? `<p class="squig-embed-desc">${squig.description}</p>` : ''}
            `;
            container.appendChild(card);
        });
    }
}

// ── Squig Modal ────────────────────────────────────────

const squigModal  = document.getElementById('squig-modal');
const squigIframe = document.getElementById('squig-iframe');

function openSquigModal(url, name, triggerEl) {
    const inner = squigModal.querySelector('.squig-modal-inner');

    // Animate origin from the trigger button's screen position
    if (triggerEl) {
        const r  = triggerEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        inner.style.transformOrigin =
            `${((r.left + r.width  / 2) / vw * 100).toFixed(1)}% ` +
            `${((r.top  + r.height / 2) / vh * 100).toFixed(1)}%`;
    } else {
        inner.style.transformOrigin = '50% 50%';
    }

    squigIframe.src = url;
    document.getElementById('squig-modal-title').textContent    = name;
    document.getElementById('squig-modal-external').href        = url;
    squigModal.classList.remove('hidden');
    requestAnimationFrame(() => squigModal.classList.add('active'));
}

function closeSquigModal() {
    squigModal.classList.remove('active');
    setTimeout(() => {
        squigModal.classList.add('hidden');
        squigIframe.src = 'about:blank';
    }, 320);
}

document.getElementById('squig-modal-close').addEventListener('click', closeSquigModal);
squigModal.addEventListener('click', e => { if (e.target === squigModal) closeSquigModal(); });

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && squigModal.classList.contains('active')) closeSquigModal();
});

// ── Init ───────────────────────────────────────────────

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
