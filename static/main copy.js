'JSEOF'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYmI0M2NkMy0xMzFjLTRmYmMtOTg3ZC03MDgxOWFmMGJmNzgiLCJpZCI6MzYwNDM1LCJpYXQiOjE3NjMxMzUzNjl9.xoeEZG1S5zP6292-7MBC6t1aZ-LnuarRwpvehU7bX-M';

let currentView = 'home';
let currentPage = 0;
let isAnimating = false;
let viewers = {};
let charts = {};

function createParticles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.setProperty('--tx', (Math.random() * 200 - 100) + 'px');
        particle.style.setProperty('--ty', (Math.random() * 200 - 100) + 'px');
        container.appendChild(particle);
    }
}

function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    document.getElementById('view-' + viewName).classList.add('active');
    
    const links = document.querySelectorAll('.nav-link');
    if (viewName === 'home' && links[0]) links[0].classList.add('active');
    if (viewName === 'book' && links[1]) links[1].classList.add('active');
    
    currentView = viewName;
    
    if (viewName === 'book' && document.querySelectorAll('.page-spread').length === 0) {
        initBook();
    }
}

function openCity(cityCode) {
    // Cherche l'index de la ville en utilisant les différents champs possibles
    const index = CITIES_DATA.findIndex(c => 
        c.code_insee === cityCode || 
        c.code_commune === cityCode || 
        c.com_code === cityCode
    );

    if (index !== -1) {
        currentPage = index;
        showView('book');
        setTimeout(() => turnToPage(currentPage), 100);
    } else {
        console.warn("Ville non trouvée pour le code :", cityCode);
    }
}



function initBook() {
    const container = document.getElementById('bookContainer');
    
    CITIES_DATA.forEach((city, index) => {
        const pageSpread = document.createElement('div');
        pageSpread.className = 'page-spread';
        pageSpread.dataset.page = index;
        
        if (index === 0) {
            pageSpread.classList.add('current');
        } else {
            pageSpread.classList.add('hidden');
        }

        // PAGE GAUCHE
        const pageLeft = document.createElement('div');
        pageLeft.className = 'page-left';
        
        // Ligne de marge rouge
        const marginLine = document.createElement('div');
        marginLine.style.cssText = `
            position: absolute;
            left: 60px;
            top: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom,
                transparent 0%,
                rgba(220, 38, 38, 0.25) 3%,
                rgba(220, 38, 38, 0.35) 5%,
                rgba(220, 38, 38, 0.35) 95%,
                rgba(220, 38, 38, 0.25) 97%,
                transparent 100%);
            box-shadow: 0 0 2px rgba(220, 38, 38, 0.2);
            z-index: 1;
            pointer-events: none;
        `;
        pageLeft.appendChild(marginLine);

        // Crée le dashboard et les graphiques
        const dashboardHtml = createDashboard(city, index);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = dashboardHtml;
        while(tempDiv.firstChild) {
            pageLeft.appendChild(tempDiv.firstChild);
        }

        // Après que les <canvas> soient ajoutés au DOM, on crée les charts
        createDynamicCharts(city);

        // PAGE DROITE
        const pageRightWrapper = document.createElement('div');
        pageRightWrapper.className = 'page-right-wrapper';
        
        const pageRight = document.createElement('div');
        pageRight.className = 'page-right';
        const lat = city.centroid_com?.lat ?? city.geolocalisation?.lat ?? 0;
        const lon = city.centroid_com?.lon ?? city.geolocalisation?.lon ?? 0;

        pageRight.innerHTML = `
            <div class="cesium-container" id="cesium${index}"></div>
            <div class="map-overlay">
                <h4><i class="fas fa-map-marker-alt"></i> ${city.nom}</h4>
                <p>${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E</p>
                <p style="margin-top: 10px; color: ${city.color}; font-weight: 700;">
                    <i class="fas fa-users"></i> ${city.population_ensemble?.toLocaleString('fr-FR') || "0"} habitants
                </p>
            </div>
            <div class="page-number">${(index * 2) + 2}</div>
        `;
        pageRightWrapper.appendChild(pageRight);

        const pageBack = document.createElement('div');
        pageBack.className = 'page-right-back';
        pageBack.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-book" style="font-size: 4em; margin-bottom: 20px;"></i>
                <p style="font-size: 1.2em;">Page ${(index * 2) + 3}</p>
            </div>
        `;
        pageRightWrapper.appendChild(pageBack);

        // Ajout des pages gauche et droite dans le spread
        pageSpread.appendChild(pageLeft);
        pageSpread.appendChild(pageRightWrapper);
        container.appendChild(pageSpread);
    });

    // Numérotation des pages gauches
    document.querySelectorAll('.page-left').forEach((page, index) => {
        const pageNum = document.createElement('div');
        pageNum.className = 'page-number';
        pageNum.textContent = (index * 2) + 1;
        page.appendChild(pageNum);
    });

    document.getElementById('totalPages').textContent = CITIES_DATA.length;
    document.getElementById('currentPage').textContent = 1;

    // Initialisation de Cesium pour la première ville
    setTimeout(() => {
        initCesium(0);
    }, 500);
}

function createDashboard(city, index) {
    if (!city.data || city.data.length === 0) return '';

    let chartsHtml = '';
    city.data.forEach((serie, i) => {
        chartsHtml += `
            <div class="chart-section">
                <h3 class="chart-title"><i class="fas fa-chart-line"></i> ${serie.empty}</h3>
                <div class="chart-container">
                    <canvas id="chart${city.id}_${i}"></canvas>
                </div>
            </div>
        `;
    });

    return `
        <div class="city-header">
            <h1 class="city-title">${city.title}</h1>
            <p class="city-subtitle">${city.description}</p>
            
        </div>
        ${chartsHtml}
    `;
}

function createDynamicCharts(city) {
    if (!city.data || city.data.length === 0) return;
    console.log(city.data.length);

    city.data.forEach((serie, i) => {
        const ctx = document.getElementById(`chart${city.id}_${i}`);
        console.log(ctx);

        if (!ctx) return;

        const years = Object.keys(serie).filter(k => k !== "empty");
        const values = years.map(y => serie[y] ?? null);
        console.log(years, values);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years.map(y => y.replace(/_/g, ' à ')),
                datasets: [{
                    label: serie.empty,
                    data: values,
                    borderColor: '#8b5cf6',
                    backgroundColor: '#8b5cf622',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: false },
                    x: { grid: { display: false } }
                }
            }
        });
    });
}



   

function nextPage() {
    if (isAnimating || currentPage >= CITIES_DATA.length - 1) return;
    
    isAnimating = true;
    const currentSpread = document.querySelector(`.page-spread[data-page="${currentPage}"]`);
    const nextSpread = document.querySelector(`.page-spread[data-page="${currentPage + 1}"]`);
    
    currentSpread.classList.add('turning');
    nextSpread.classList.remove('hidden');
    nextSpread.classList.add('current');
    nextSpread.style.zIndex = '5';
    
    setTimeout(() => {
        currentSpread.classList.remove('current', 'turning');
        currentSpread.classList.add('turned');
        currentSpread.style.zIndex = '1';
        
        nextSpread.style.zIndex = '10';
        
        currentPage++;
        updatePageIndicator();
        
        if (!viewers[currentPage]) {
            initCesium(currentPage);
        }
        
        isAnimating = false;
    }, 2000);
}

function previousPage() {
    if (isAnimating || currentPage <= 0) return;
    
    isAnimating = true;
    const currentSpread = document.querySelector(`.page-spread[data-page="${currentPage}"]`);
    const prevSpread = document.querySelector(`.page-spread[data-page="${currentPage - 1}"]`);
    
    prevSpread.classList.remove('turned');
    prevSpread.classList.add('turning-back', 'current');
    prevSpread.style.zIndex = '15';
    
    currentSpread.style.zIndex = '5';
    
    setTimeout(() => {
        prevSpread.classList.remove('turning-back');
        prevSpread.style.zIndex = '10';
        
        const wrapper = prevSpread.querySelector('.page-right-wrapper');
        if (wrapper) wrapper.style.transform = 'rotateY(0deg)';
        
        currentSpread.classList.remove('current');
        currentSpread.classList.add('hidden');
        
        currentPage--;
        updatePageIndicator();
        
        isAnimating = false;
    }, 2000);
}

function turnToPage(targetPage) {
    if (targetPage === currentPage || isAnimating) return;
    
    if (targetPage > currentPage) {
        nextPage();
        if (targetPage > currentPage + 1) {
            setTimeout(() => turnToPage(targetPage), 2100);
        }
    } else {
        previousPage();
        if (targetPage < currentPage - 1) {
            setTimeout(() => turnToPage(targetPage), 2100);
        }
    }
}

function updatePageIndicator() {
    document.getElementById('currentPage').textContent = currentPage + 1;
    document.getElementById('prevBtn').disabled = currentPage === 0;
    document.getElementById('nextBtn').disabled = currentPage >= CITIES_DATA.length - 1;
}

document.addEventListener('keydown', (e) => {
    if (currentView === 'book' && !isAnimating) {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') previousPage();
    }
});

async function initCesium(index) {
    const city = CITIES_DATA[index];
    const containerId = `cesium${index}`;
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    const viewer = new Cesium.Viewer(containerId, {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false
    });
    
    try {
        viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
    } catch (error) {
        console.log('Terrain 3D non disponible');
    }
    const lon = city.coordinates?.lon ?? city.centroid_com?.lon ?? city.geolocalisation?.lon ?? 0;
    const lat = city.coordinates?.lat ?? city.centroid_com?.lat ?? city.geolocalisation?.lat ?? 0;
    const height = city.coordinates?.height ?? 1500;

   viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0.0
    },
    duration: 3
});

    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, height),

        point: {
            pixelSize: 18,
            color: Cesium.Color.fromCssColorString(city.color),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3
        },
        label: {
            text: city.name.toUpperCase(),
            font: '22px Space Grotesk, sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20)
        }
    });
    
    viewers[index] = viewer;
}




document.addEventListener('DOMContentLoaded', () => {
    createParticles('particles');
    createParticles('particles2');
    
    showView('home');
    
    document.querySelectorAll('.city-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            const rotateY = ((x - 50) / 50) * 10;
            const rotateX = -((y - 50) / 50) * 10;
            
            card.style.transform = `translateY(-15px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    console.log('📖 LIVRE RÉALISTE chargé !');

    console.log('📊', CITIES_DATA.length, 'villes disponibles');
});