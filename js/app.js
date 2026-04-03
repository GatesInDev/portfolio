import { projects } from './data.js';
import { ParticleNetwork } from './particles.js';

const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');

// Init Particles
new ParticleNetwork('bg-canvas');

// Active filter state
let activeFilter = 'all';

// Routing
function handleRoute() {
    const hash = window.location.hash || '#home';
    const route = hash.slice(1);
    
    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href');
        const isActive = linkHash === hash ||
            (linkHash === '#projects' && route.startsWith('project/'));
        link.classList.toggle('active', isActive);
    });

    renderView(route);
}

function renderView(route) {
    mainContent.innerHTML = '';
    
    if (route.startsWith('project/')) {
        const projectId = route.split('/')[1];
        renderDetail(projectId);
        return;
    }

    switch (route) {
        case 'home':
            renderHome();
            break;
        case 'projects':
            activeFilter = 'all';
            renderProjects();
            break;
        case 'contact':
            renderContact();
            break;
        default:
            renderHome();
    }
}

// Render Functions
function renderHome() {
    const template = document.getElementById('home-template');
    const clone = template.content.cloneNode(true);
    mainContent.appendChild(clone);
}

function renderProjects() {
    const template = document.getElementById('projects-template');
    const clone = template.content.cloneNode(true);
    const grid = clone.querySelector('#dev-grid');
    const chips = clone.querySelectorAll('.filter-chip');

    // Set active chip
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
    const template = document.getElementById('contact-template');
    const clone = template.content.cloneNode(true);
    mainContent.appendChild(clone);
}

function createCard(item) {
    const div = document.createElement('div');
    div.className = 'card fade-in';
    div.onclick = () => window.location.hash = `project/${item.id}`;
    
    const categoryLabel = {
        dotnet: '.NET',
        infra: 'Infrastructure',
        web: 'Web',
        other: 'Other'
    }[item.category] || item.category;

    div.innerHTML = `
        ${item.image
            ? `<div class="card-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <span class="card-category-badge">${categoryLabel}</span>
               </div>`
            : `<div class="card-image card-image--placeholder">
                <div class="card-placeholder-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <span class="card-category-badge">${categoryLabel}</span>
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

function renderDetail(id) {
    const item = projects.find(p => p.id === id);
    
    if (!item) {
        window.location.hash = '#home';
        return;
    }

    const template = document.getElementById('detail-template');
    const clone = template.content.cloneNode(true);
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
                    ${item.features.map(feat => `<li><span class="feat-icon">◈</span>${feat}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${item.gallery ? `
            <div class="detail-section fade-in delay-3">
                <h3>Gallery</h3>
                <div class="gallery-grid">
                    ${item.gallery.map((img, index) => 
                        `<img src="${img}" alt="Project screenshot" loading="lazy" onclick="openLightbox('${item.id}', ${index})">`
                    ).join('')}
                </div>
            </div>
        ` : ''}
        
        <div class="detail-links fade-in delay-3">
            ${item.repoUrl ? `<a href="${item.repoUrl}" target="_blank" class="btn primary">View Code</a>` : ''}
            ${item.demoUrl && item.demoUrl !== '#' ? `<a href="${item.demoUrl}" target="_blank" class="btn secondary">Live Demo</a>` : ''}
        </div>
    `;
    
    mainContent.appendChild(clone);
    window.scrollTo(0, 0);
}

// Lightbox Logic
let currentGallery = [];
let currentIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

window.openLightbox = (projectId, index) => {
    const project = projects.find(p => p.id === projectId);
    
    if (project && project.gallery) {
        currentGallery = project.gallery;
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.remove('hidden');
        requestAnimationFrame(() => lightbox.classList.add('active'));
    }
};

function updateLightboxImage() {
    lightboxImg.src = currentGallery[currentIndex];
}

window.closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
    }, 300);
};

window.nextImage = (e) => {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
};

window.prevImage = (e) => {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
};

document.getElementById('lightbox-close').addEventListener('click', window.closeLightbox);
document.getElementById('lightbox-next').addEventListener('click', window.nextImage);
document.getElementById('lightbox-prev').addEventListener('click', window.prevImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) window.closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowRight') window.nextImage();
    if (e.key === 'ArrowLeft') window.prevImage();
});

// Init
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
