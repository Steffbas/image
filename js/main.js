document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const gallery = document.getElementById('gallery');
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const detailView = document.getElementById('detail-view');

    // 1. INTRO
    window.addEventListener('load', () => {
        setTimeout(() => {
            body.classList.remove('loading');
        }, 5500);
    });

    // 2. GESTION DU MENU OVERLAY
    menuBtn.onclick = () => {
        menuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    };

    closeMenuBtn.onclick = () => {
        menuOverlay.classList.remove('active');
        body.style.overflow = '';
    };

    // Fermer le menu si on clique sur un lien
    document.querySelectorAll('.menu-link').forEach(link => {
        link.onclick = () => {
            menuOverlay.classList.remove('active');
            body.style.overflow = '';
        };
    });

    // 3. DONNÉES ET GALERIE
    let allPhotos = [];
    
    // On utilise les données injectées via js/data.js
    if (typeof GALLERY_DATA !== 'undefined') {
        allPhotos = GALLERY_DATA;
        renderGallery(allPhotos);
        setupFilters();
    } else {
        console.error("Les données de la galerie (GALLERY_DATA) sont introuvables.");
    }

    function renderGallery(photos) {
        gallery.innerHTML = '';
        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerHTML = `
                <div class="img-container">
                    <img src="${photo.src}" alt="${photo.title}">
                </div>
                <div class="item-info" style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; opacity:0.6;">
                    <span>${photo.title}</span>
                    <span>${photo.year}</span>
                </div>
            `;
            item.onclick = () => openDetail(photo);
            gallery.appendChild(item);
            
            setTimeout(() => item.classList.add('visible'), 100 + (index * 100));
        });
    }

    // 4. LOGIQUE DES FILTRES
    function setupFilters() {
        document.querySelectorAll('#gallery-filters li').forEach(link => {
            link.onclick = () => {
                document.querySelectorAll('#gallery-filters li').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const filter = link.dataset.filter;
                const filtered = filter === 'all' ? allPhotos : allPhotos.filter(p => p.category === filter);
                
                // Effet de sortie avant refresh
                document.querySelectorAll('.grid-item').forEach(i => i.classList.remove('visible'));
                setTimeout(() => renderGallery(filtered), 400);
            };
        });
    }

    // 5. VUE DÉTAIL
    function openDetail(photo) {
        document.getElementById('detail-img').src = photo.src;
        document.getElementById('detail-title').textContent = photo.title;
        document.getElementById('detail-category').textContent = photo.category.replace('-', ' • ');
        document.getElementById('detail-year').textContent = photo.year;
        
        // On utilise la description extraite par le script sync.py
        const descElement = document.getElementById('detail-desc');
        if (photo.description) {
            descElement.innerHTML = photo.description.replace(/\n/g, '<br>');
        } else {
            descElement.textContent = "Aucune description disponible.";
        }
        
        detailView.classList.add('open');
        body.style.overflow = 'hidden';
    }

    document.getElementById('close-detail').onclick = () => {
        detailView.classList.remove('open');
        body.style.overflow = '';
    };
});