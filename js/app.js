import { projects, designs } from './data.js';
import { ParticleNetwork } from './particles.js'; // Import logic

const app = document.getElementById('app');
const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');

// Init Particles
new ParticleNetwork('bg-canvas');

// Routing
function handleRoute() {
    const hash = window.location.hash || '#home';
    const route = hash.slice(1);
    
    // Update Nav
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === hash);
    });

    renderView(route);
}

function renderView(route) {
    mainContent.innerHTML = '';
    
    // Handle specific project details first
    if (route.startsWith('project/')) {
        const projectId = route.split('/')[1];
        renderDetail(projectId, 'dev');
        return;
    }
    
    if (route.startsWith('design/')) {
        const designId = route.split('/')[1];
        renderDetail(designId, 'design');
        return;
    }

    switch (route) {
        case 'home':
            renderHome();
            break;
        case 'dotnet':
            renderProjects('dotnet');
            break;
        case 'other':
            renderProjects('other');
            break;
        case 'design':
            renderDesigns();
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

function renderProjects(category) {
    const template = document.getElementById('projects-template');
    const clone = template.content.cloneNode(true);
    
    // Dynamic Header
    const title = clone.querySelector('#project-section-title');
    const subtitle = clone.querySelector('#project-section-subtitle');
    
    if (category === 'dotnet') {
        title.textContent = '.NET Projects';
        subtitle.textContent = 'Specialized in robust backend solutions.';
    } else {
        title.textContent = 'Other Languages';
        subtitle.textContent = 'Full stack exploration.';
    }

    const grid = clone.querySelector('#dev-grid');
    
    // Filter projects
    const filteredProjects = projects.filter(p => p.category === category);

    filteredProjects.forEach(project => {
        grid.appendChild(createCard(project, 'project'));
    });
    
    mainContent.appendChild(clone);
}

function renderDesigns() {
    const template = document.getElementById('design-template');
    const clone = template.content.cloneNode(true);
    const grid = clone.querySelector('#design-grid');
    
    designs.forEach(design => {
        grid.appendChild(createCard(design, 'design'));
    });
    
    mainContent.appendChild(clone);
}

function createCard(item, type) {
    const div = document.createElement('div');
    div.className = 'card fade-in';
    div.onclick = () => window.location.hash = `${type}/${item.id}`;
    
    div.innerHTML = `
        <div class="card-image">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
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

function renderDetail(id, type) {
    const collection = type === 'dev' ? projects : designs;
    const item = collection.find(p => p.id === id);
    
    if (!item) {
        window.location.hash = '#home';
        return;
    }

    const template = document.getElementById('detail-template');
    const clone = template.content.cloneNode(true);
    const content = clone.querySelector('.detail-content');
    
    content.innerHTML = `
        <div class="detail-cover fade-in">
            <div class="detail-glow" style="background-image: url('${item.image}')"></div>
            <img src="${item.image}" alt="${item.title}" class="detail-image" onclick="openLightbox('${item.id}', 0)"> <!-- Clickable cover too! -->
        </div>
        
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
                    ${item.features.map(feat => `<li>${feat}</li>`).join('')}
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
            ${item.demoUrl ? `<a href="${item.demoUrl}" target="_blank" class="btn secondary">Live Demo</a>` : ''}
            ${item.link ? `<a href="${item.link}" target="_blank" class="btn primary">View Design</a>` : ''}
        </div>
    `;
    
    mainContent.appendChild(clone);
    window.scrollTo(0,0);
}

// Lightbox Logic
let currentGallery = [];
let currentIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

window.openLightbox = (projectId, index) => {
    // Find project logic
    const allItems = [...projects, ...designs];
    const project = allItems.find(p => p.id === projectId);
    
    if (project && project.gallery) {
        currentGallery = project.gallery;
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.remove('hidden');
        // Slight delay to allow display:flex to apply before opacity transition
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
    }, 300); // Match transition duration
};

window.nextImage = (e) => {
    if(e) e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
};

window.prevImage = (e) => {
    if(e) e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
};

// Lightbox Event Listeners
document.getElementById('lightbox-close').addEventListener('click', window.closeLightbox);
document.getElementById('lightbox-next').addEventListener('click', window.nextImage);
document.getElementById('lightbox-prev').addEventListener('click', window.prevImage);

// Close on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) window.closeLightbox();
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowRight') window.nextImage();
    if (e.key === 'ArrowLeft') window.prevImage();
});

// Mouse Follow Effect
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Update CSS variables on body
    document.body.style.setProperty('--mouse-x', `${x}px`);
    document.body.style.setProperty('--mouse-y', `${y}px`);
});

// Init
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
