document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const closeBtn = document.querySelector('.close-btn');

    let allPhotos = [];

    // 1. Charger les données depuis data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allPhotos = data;
            renderGallery(allPhotos); // Afficher toutes les photos au démarrage
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));

    // 2. Fonction pour afficher la galerie
    function renderGallery(photos) {
        gallery.innerHTML = ''; // Vider la galerie
        photos.forEach(photo => {
            const item = document.createElement('div');
            item.classList.add('gallery-item');
            item.dataset.category = photo.category;
            
            item.innerHTML = `
                <img src="${photo.src}" alt="${photo.title}">
                <div class="overlay">
                    <h3>${photo.title}</h3>
                </div>
            `;
            
            // Ouvrir la lightbox au clic
            item.addEventListener('click', () => openLightbox(photo));
            gallery.appendChild(item);
        });
    }

    // 3. Gestion des filtres
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mise à jour de la classe active
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            
            if (filter === 'all') {
                renderGallery(allPhotos);
            } else {
                const filteredPhotos = allPhotos.filter(photo => photo.category === filter);
                renderGallery(filteredPhotos);
            }
        });
    });

    // 4. Gestion de la Lightbox
    function openLightbox(photo) {
        lightbox.classList.remove('hidden');
        // Petit délai pour permettre la transition CSS (fade-in)
        requestAnimationFrame(() => {
            lightbox.classList.add('visible');
        });
        
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.title;
        lightboxTitle.textContent = photo.title;
        
        // Charger la description depuis le fichier texte
        lightboxDesc.textContent = "Chargement...";
        fetch(photo.descSrc)
            .then(res => {
                if (!res.ok) throw new Error('Pas de description');
                return res.text();
            })
            .then(text => {
                lightboxDesc.textContent = text;
            })
            .catch(() => {
                lightboxDesc.textContent = "Aucune description disponible pour cette photo.";
            });
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        // Attendre la fin de la transition avant de masquer
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightboxImg.src = '';
            lightboxDesc.textContent = '';
        }, 300);
    }

    // Fermer au clic sur le bouton croix
    closeBtn.addEventListener('click', closeLightbox);

    // Fermer au clic en dehors du contenu (sur le fond sombre)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Fermer avec la touche Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
            closeLightbox();
        }
    });
});