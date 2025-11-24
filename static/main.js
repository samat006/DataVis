// ════════════════════════════════════════════════════════════════════════════════
// 📚 LIVRE 3D INTERACTIF - CODE COMPLET AVEC MODULE QUALITÉ DE L'EAU
// VERSION FINALE - Intégration complète
// ════════════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION GLOBALE
// ════════════════════════════════════════════════════════════════════════════════

// Token Cesium
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYmI0M2NkMy0xMzFjLTRmYmMtOTg3ZC03MDgxOWFmMGJmNzgiLCJpZCI6MzYwNDM1LCJpYXQiOjE3NjMxMzUzNjl9.xoeEZG1S5zP6292-7MBC6t1aZ-LnuarRwpvehU7bX-M';

// Variables globales
const STATE = {
    currentView: 'home',
    currentPage: 0,
    isAnimating: false,
    viewers: {},
    charts: {}
};

// Coordonnées par défaut (Corse)
const DEFAULT_COORDS = {
    lon: 9.0,
    lat: 42.0,
    height: 50000
};

// ════════════════════════════════════════════════════════════════════════════════
// 🔧 UTILITAIRE - NORMALISATION DES DONNÉES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Convertit city.data en Array (que ce soit Object ou Array)
 * @param {Object|Array} data - Données à normaliser
 * @returns {Array} Données normalisées en Array
 */
function normalizeDataToArray(data) {
    if (!data) {
        return [];
    }
    
    if (Array.isArray(data)) {
        return data;
    } 
    else if (typeof data === 'object' && data !== null) {
        // Convertir Object en Array
        return [data];
    }
    
    return [];
}

// ════════════════════════════════════════════════════════════════════════════════
// 🎯 NAVIGATION - GESTION DES VUES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Affiche une vue spécifique (home, book, etc.)
 * @param {string} viewName - Nom de la vue à afficher
 */
function showView(viewName) {
    // Masquer toutes les vues
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // Afficher la vue demandée
    const viewElement = document.getElementById('view-' + viewName);
    if (viewElement) viewElement.classList.add('active');
    
    // Activer le lien de navigation
    const links = document.querySelectorAll('.nav-link');
    if (viewName === 'home' && links[0]) links[0].classList.add('active');
    if (viewName === 'book' && links[1]) links[1].classList.add('active');
    
    STATE.currentView = viewName;
    
    // Initialiser le livre si nécessaire
    if (viewName === 'book' && document.querySelectorAll('.page-spread').length === 0) {
        initBook();
    }
}

// ════════════════════════════════════════════════════════════════════════════════
// 📖 LIVRE - INITIALISATION ET STRUCTURE
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Initialise le livre avec toutes les pages
 */
function initBook() {
    const container = document.getElementById('bookContainer');
    if (!container) return;
    
    CITIES_DATA.forEach((city, index) => {
        const pageSpread = createPageSpread(city, index);
        container.appendChild(pageSpread);
    });
    
    addPageNumbers();
    updatePageIndicator();
    
    // Initialiser Cesium pour la première page
    setTimeout(() => initCesium(0), 500);
}

/**
 * Crée un spread de pages (gauche + droite)
 * @param {Object} city - Données de la ville
 * @param {number} index - Index du chapitre
 * @returns {HTMLElement}
 */
function createPageSpread(city, index) {
    const pageSpread = document.createElement('div');
    pageSpread.className = 'page-spread';
    pageSpread.dataset.page = index;
    
    // Gérer la visibilité
    if (index === 0) {
        pageSpread.classList.add('current');
    } else {
        pageSpread.classList.add('hidden');
    }
    
    // Créer les pages
    const pageLeft = createPageLeft(city, index);
    const pageRightWrapper = createPageRight(city, index);
    
    pageSpread.appendChild(pageLeft);
    pageSpread.appendChild(pageRightWrapper);
    
    return pageSpread;
}

/**
 * Crée la page gauche avec le contenu
 * @param {Object} city - Données de la ville
 * @param {number} index - Index du chapitre
 * @returns {HTMLElement}
 */
function createPageLeft(city, index) {
    const pageLeft = document.createElement('div');
    pageLeft.className = 'page-left';
    
    // Ajouter la ligne de marge rouge
    pageLeft.appendChild(createMarginLine());
    
    // Ajouter le contenu du dashboard
    const dashboardHtml = createDashboard(city, index);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = dashboardHtml;
    
    while(tempDiv.firstChild) {
        pageLeft.appendChild(tempDiv.firstChild);
    }
    
    return pageLeft;
}

/**
 * Crée la ligne de marge rouge
 * @returns {HTMLElement}
 */
function createMarginLine() {
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
    return marginLine;
}

/**
 * Crée la page droite avec Cesium
 * @param {Object} city - Données de la ville
 * @param {number} index - Index du chapitre
 * @returns {HTMLElement}
 */
function createPageRight(city, index) {
    const pageRightWrapper = document.createElement('div');
    pageRightWrapper.className = 'page-right-wrapper';
    
    const pageRight = document.createElement('div');
    pageRight.className = 'page-right';
    
    let legendHtml = '';
    const dataArray = normalizeDataToArray(city.data);
    
    dataArray.forEach(dataObj => {
        if (dataObj.population_corse && dataObj.population_corse.length > 0) {
            legendHtml = createMapLegend(dataObj.population_corse);
        }
    });
    
    pageRight.innerHTML = `
        <div class="cesium-container" id="cesium${index}"></div>
        <div class="map-overlay">
            <h4><i class="fas fa-map-marker-alt"></i> ${city.title}</h4>
            <p>Chapitre ${city.id}</p>
            <p style="margin-top: 10px; color: #8b5cf6; font-weight: 700;">
                <i class="fas fa-book"></i> ${city.description}
            </p>
        </div>
        ${legendHtml}
        <div class="page-number">${(index * 2) + 2}</div>
    `;
    
    pageRightWrapper.appendChild(pageRight);
    
    // Ajouter la page arrière
    const pageBack = createPageBack(index);
    pageRightWrapper.appendChild(pageBack);
    
    return pageRightWrapper;
}

/**
 * Crée la page arrière
 * @param {number} index - Index du chapitre
 * @returns {HTMLElement}
 */
function createPageBack(index) {
    const pageBack = document.createElement('div');
    pageBack.className = 'page-right-back';
    pageBack.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-book" style="font-size: 4em; margin-bottom: 20px;"></i>
            <p style="font-size: 1.2em;">Page ${(index * 2) + 3}</p>
        </div>
    `;
    return pageBack;
}

/**
 * Ajoute les numéros de page
 */
function addPageNumbers() {
    document.querySelectorAll('.page-left').forEach((page, index) => {
        const pageNum = document.createElement('div');
        pageNum.className = 'page-number';
        pageNum.textContent = (index * 2) + 1;
        page.appendChild(pageNum);
    });
}

// ════════════════════════════════════════════════════════════════════════════════
// 📄 NAVIGATION DES PAGES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Passe à la page suivante
 */
function nextPage() {
    if (STATE.isAnimating || STATE.currentPage >= CITIES_DATA.length - 1) return;
    
    STATE.isAnimating = true;
    const currentSpread = document.querySelector(`.page-spread[data-page="${STATE.currentPage}"]`);
    const nextSpread = document.querySelector(`.page-spread[data-page="${STATE.currentPage + 1}"]`);
    
    if (!currentSpread || !nextSpread) {
        STATE.isAnimating = false;
        return;
    }
    
    // Animation de tournage
    currentSpread.classList.add('turning');
    nextSpread.classList.remove('hidden');
    nextSpread.classList.add('current');
    nextSpread.style.zIndex = '5';
    
    setTimeout(() => {
        currentSpread.classList.remove('current', 'turning');
        currentSpread.classList.add('turned');
        currentSpread.style.zIndex = '1';
        nextSpread.style.zIndex = '10';
        
        STATE.currentPage++;
        updatePageIndicator();
        
        // Initialiser Cesium si nécessaire
        if (!STATE.viewers[STATE.currentPage]) {
            initCesium(STATE.currentPage);
        }
        
        STATE.isAnimating = false;
    }, 2000);
}

/**
 * Revient à la page précédente
 */
function previousPage() {
    if (STATE.isAnimating || STATE.currentPage <= 0) return;
    
    STATE.isAnimating = true;
    const currentSpread = document.querySelector(`.page-spread[data-page="${STATE.currentPage}"]`);
    const prevSpread = document.querySelector(`.page-spread[data-page="${STATE.currentPage - 1}"]`);
    
    if (!currentSpread || !prevSpread) {
        STATE.isAnimating = false;
        return;
    }
    
    // Animation de retour
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
        
        STATE.currentPage--;
        updatePageIndicator();
        STATE.isAnimating = false;
    }, 2000);
}

/**
 * Met à jour l'indicateur de page
 */
function updatePageIndicator() {
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentPageEl) currentPageEl.textContent = STATE.currentPage + 1;
    if (totalPagesEl) totalPagesEl.textContent = CITIES_DATA.length;
    if (prevBtn) prevBtn.disabled = STATE.currentPage === 0;
    if (nextBtn) nextBtn.disabled = STATE.currentPage >= CITIES_DATA.length - 1;
}

// ════════════════════════════════════════════════════════════════════════════════
// 📊 DASHBOARD 
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Crée le dashboard pour une ville
 * @param {Object} city - Données de la ville
 * @param {number} index - Index du chapitre
 * @returns {string} HTML du dashboard
 */
function createDashboard(city, index) {
    if (!city.data) {
        return createEmptyDashboard(city);
    }
    
    let content = {
        tables: '',
        pyramid: '',
        pollution: '',
        water: '',
        rivers: '',
        groundwater: '',
        score: '',
        birthRate: 0,
        deathRate: 0
    };
    
    const dataArray = normalizeDataToArray(city.data);
    
    // Parcourir les données
    dataArray.forEach((dataObj, i) => {
        try {
            // Pyramide des âges
            if (dataObj['insee-population-par-sexe-et-age-en-2020-pop-t3']) {
                content.pyramid = createAgePyramid(dataObj['insee-population-par-sexe-et-age-en-2020-pop-t3']);
            }
          
           
            // Démographie INSEE
            if (dataObj.insee_demographiques_depuis_1968) {
                const result = processDemographicData(dataObj.insee_demographiques_depuis_1968);
                content.tables = result.tables;
                content.birthRate += result.birthRate;
                content.deathRate += result.deathRate;
            }
            
            // ✅ MODULE QUALITÉ DE L'EAU - ADAPTATION ET VISUALISATIONS
            //const waterData = adaptWaterData(dataObj.DonneEau);

             if (dataObj["prelevements-resultats-d-analyses-et-conclusions-sanitaires-issus-du-controle-sa"]) {
                content.pollution += createWaterDashboard(dataObj["prelevements-resultats-d-analyses-et-conclusions-sanitaires-issus-du-controle-sa"]);}
            
        } catch (error) {
            console.error(`❌ Erreur dataObj[${i}]:`, error);
        }
    });

   


    
    // Diagramme circulaire
    const circleChart = createCircleChart(content.birthRate, content.deathRate);
    
    // Animer les barres
    setTimeout(() => animateBars(), 300);
    
    return `
        <div class="city-header">
            <h1 class="city-title">${city.title}</h1>
            <p class="city-subtitle">${city.description}</p>
        </div>
        ${content.water}
        ${content.rivers}
        ${content.groundwater}
        ${content.score}
        ${content.pollution}
        ${content.pyramid}
        ${circleChart}
        ${content.tables}
    `;
}

/**
 * Crée un dashboard vide
 * @param {Object} city - Données de la ville
 * @returns {string} HTML
 */
function createEmptyDashboard(city) {
    return `
        <div class="city-header">
            <h1 class="city-title">${city.title}</h1>
            <p class="city-subtitle">${city.description}</p>
        </div>
        <div class="empty-content">
            <i class="fas fa-file-alt" style="font-size: 5em; color: #ccc; margin-bottom: 20px;"></i>
            <p style="color: #999; font-size: 1.2em;">Contenu en préparation</p>
        </div>
    `;
}

/**
 * Traite les données démographiques INSEE
 * @param {Array} data - Données brutes
 * @returns {Object} { tables, birthRate, deathRate }
 */
function processDemographicData(data) {
    let tablesHtml = '';
    let birthRate = 0;
    let deathRate = 0;
    
    data.forEach(serie => {
        const keys = Object.keys(serie).filter(k => k !== "empty");
        const values = keys.map(k => serie[k]);
        const total = values.reduce((sum, val) => sum + (val ?? 0), 0);
        
        // Calculer natalité/mortalité
        if (/natalit/i.test(serie.empty)) birthRate += total;
        if (/mortalit/i.test(serie.empty)) deathRate += total;
        
        // Créer le tableau
        const tableHtml = createDemographicTable(serie, keys, values);
        if (tableHtml) tablesHtml += tableHtml;
    });
    
    return { tables: tablesHtml, birthRate, deathRate };
}

/**
 * Crée un tableau démographique
 * @param {Object} serie - Série de données
 * @param {Array} keys - Clés
 * @param {Array} values - Valeurs
 * @returns {string} HTML du tableau
 */
function createDemographicTable(serie, keys, values) {
    const maxValue = Math.max(...values.filter(v => v !== null));
    let rows = '';
    
    keys.forEach((key, j) => {
        const value = values[j];
        if (value === null || value === undefined) return;
        
        const label = key.replace(/_/g, ' ');
        const widthPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const glow = `0 0 ${10 + widthPercent / 10}px rgba(139,92,246,0.8)`;
        
        rows += `
            <tr>
                <td>${label}</td>
                <td>
                    <div class="bar-container glass">
                        <div class="bar neon-bar"
                            style="width:0%; box-shadow:${glow};"
                            data-width="${widthPercent}%"
                            data-value="${value.toFixed(1)}">
                        </div>
                        <span class="bar-value" style="opacity:0;">${value.toFixed(1)}</span>
                    </div>
                </td>
            </tr>
        `;
    });
    
    if (!rows) return '';
    
    return `
        <div class="chart-section futuristic">
            <h3 class="chart-title">${serie.empty}</h3>
            <table class="data-table">
                <thead>
                    <tr><th>Période</th><th>Valeur</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

/**
 * Crée le diagramme circulaire natalité/mortalité
 * @param {number} birthRate - Taux de natalité
 * @param {number} deathRate - Taux de mortalité
 * @returns {string} HTML
 */
function createCircleChart(birthRate, deathRate) {
    if (birthRate <= 0 && deathRate <= 0) return '';
    
    const total = birthRate + deathRate;
    const birthPercent = (birthRate / total * 100);
    
    return `
        <div class="circle-chart-wrapper">
            <h3 class="circle-title">Répartition Natalité / Mortalité</h3>
            <div class="circle-chart">
                <div class="circle-glow"></div>
                <div class="circle"
                    style="background: conic-gradient(
                        #22c55e 0% ${birthPercent}%,
                        #ef4444 ${birthPercent}% 100%
                    );">
                </div>
                <div class="circle-center">
                    <div class="circle-text">
                        <div class="birth">Naissance ${birthRate.toFixed(1)}</div>
                        <div class="death">Décès ${deathRate.toFixed(1)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Anime les barres du dashboard
 */
function animateBars() {
    document.querySelectorAll('.neon-bar').forEach(bar => {
        bar.style.width = bar.dataset.width;
        const span = bar.parentElement.querySelector('.bar-value');
        if (span) span.style.opacity = 1;
    });
}

// ════════════════════════════════════════════════════════════════════════════════
// 🗺️ CESIUM - INITIALISATION ET GESTION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Initialise Cesium pour une page donnée
 * @param {number} index - Index de la page
 */
async function initCesium(index) {
    const city = CITIES_DATA[index];
    const containerId = `cesium${index}`;
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    container.classList.add('loading');
    
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
        infoBox: true,
        selectionIndicator: true
    });
    
    // Terrain 3D
    try {
        viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
    } catch (error) {
        console.log('Terrain 3D non disponible');
    }
    
    STATE.viewers[index] = viewer;
    container.classList.remove('loading');
    
    // Charger les données
    loadCesiumData(viewer, city, index);
}

/**
 * Charge les données dans Cesium
 * @param {Object} viewer - Viewer Cesium
 * @param {Object} city - Données de la ville
 * @param {number} index - Index
 */
function loadCesiumData(viewer, city, index) {
    let dataLoaded = false;
    
    const dataArray = normalizeDataToArray(city.data);
    
    dataArray.forEach(dataObj => {
        // Communes
        if (dataObj.population_corse && dataObj.population_corse.length > 0) {
            createCesiumMap(dataObj.population_corse, index);
            dataLoaded = true;
        }
        
        // Pollution - recherche flexible
        const pollutionKey = Object.keys(dataObj || {}).find(k =>
            k.includes("DonneEnv") || k.includes("poll")
        );
        
        
        // ✅ MODULE QUALITÉ DE L'EAU - CARTE CESIUM
       //(dataObj);
        
        displayWaterSourcesCesium(viewer, dataObj["eau-qualite-des-nappes-d-eau-souterraine-stations"]);

    });
    
    // Vue par défaut si pas de données
    if (!dataLoaded) {
        setDefaultView(viewer, city);
    }
}

/**
 * Définit la vue par défaut sur la Corse
 * @param {Object} viewer - Viewer Cesium
 * @param {Object} city - Données de la ville
 */
function setDefaultView(viewer, city) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            DEFAULT_COORDS.lon,
            DEFAULT_COORDS.lat,
            DEFAULT_COORDS.height
        ),
        orientation: {
            heading: Cesium.Math.toRadians(5),
            pitch: Cesium.Math.toRadians(-70),
            roll: 0.0
        },
        duration: 3
    });
    
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(DEFAULT_COORDS.lon, DEFAULT_COORDS.lat),
        point: {
            pixelSize: 18,
            color: Cesium.Color.fromCssColorString('#8b5cf6'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3
        },
        label: {
            text: city.title.toUpperCase(),
            font: '22px Space Grotesk, sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20)
        }
    });
}

// ════════════════════════════════════════════════════════════════════════════════
// 📍 CESIUM - CARTE DES COMMUNES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Crée la carte 3D des communes
 * @param {Array} communes - Liste des communes
 * @param {number} viewerIndex - Index du viewer
 */
function createCesiumMap(communes, viewerIndex) {
    if (!communes || communes.length === 0) return;
    
    const viewer = STATE.viewers[viewerIndex];
    if (!viewer) return;
    
    viewer.entities.removeAll();
    
    // Stats pour les couleurs
    const populations = communes.map(c => c.population_ensemble || 0).filter(p => p > 0);
    const avgPop = populations.reduce((a, b) => a + b, 0) / populations.length;
    
    // Ajouter chaque commune
    communes.forEach(commune => {
        if (!commune.geom_com?.geometry) return;
        
        const pop = commune.population_ensemble || 0;
        const color = getCommuneColor(pop, avgPop);
        const height = Math.sqrt(pop) * 50; // Échelle racine carrée
        
        addCommuneEntity(viewer, commune, color, height);
    });
    
    // Zoom sur l'ensemble
    setTimeout(() => {
        viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(-35),
            60000
        ));
    }, 500);
    
    viewer.infoBox.frame.src = 'about:blank';
}

/**
 * Obtient la couleur selon la population
 * @param {number} pop - Population
 * @param {number} avgPop - Population moyenne
 * @returns {Cesium.Color}
 */
function getCommuneColor(pop, avgPop) {
    if (!pop || pop === 0) {
        return Cesium.Color.LIGHTGRAY.withAlpha(0.85);
    }
    
    if (pop < avgPop * 0.8) {
        return Cesium.Color.fromCssColorString('#60a5fa').withAlpha(0.85); // Bleu
    } else if (pop < avgPop * 1.5) {
        return Cesium.Color.fromCssColorString('#a78bfa').withAlpha(0.85); // Violet
    } else {
        return Cesium.Color.fromCssColorString('#f472b6').withAlpha(0.85); // Rose
    }
}

/**
 * Ajoute une entité commune à Cesium
 * @param {Object} viewer - Viewer Cesium
 * @param {Object} commune - Données commune
 * @param {Cesium.Color} color - Couleur
 * @param {number} height - Hauteur d'extrusion
 */
function addCommuneEntity(viewer, commune, color, height) {
    try {
        const geometry = commune.geom_com.geometry;
        const entity = viewer.entities.add({
            name: commune.nom,
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArray(geometry.coordinates[0][0].flat())
                ),
                material: color,
                extrudedHeight: height,
                height: 0,
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 1.5
            },
            description: createCommuneDescription(commune)
        });
        
        // Effet highlight
        entity.polygon.material = new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty(() => {
                return viewer.selectedEntity === entity 
                    ? color.brighten(0.3, new Cesium.Color())
                    : color;
            }, false)
        );
    } catch (error) {
        console.warn(`Erreur pour ${commune.nom}:`, error);
    }
}

/**
 * Crée la description HTML d'une commune
 * @param {Object} commune - Données commune
 * @returns {string} HTML
 */
function createCommuneDescription(commune) {
    const pop = commune.population_ensemble || 0;
    
    return `
        <div style="font-family: 'Space Grotesk', sans-serif; padding: 20px; min-width: 280px;">
            <h3 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 1.6em; border-bottom: 3px solid #8b5cf6; padding-bottom: 10px;">
                ${commune.nom}
            </h3>
            <div style="display: grid; gap: 12px; font-size: 1.1em;">
                <div style="display: flex; justify-content: space-between; padding: 12px; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 10px; font-weight: 600;">
                    <span>👥 Population</span>
                    <span style="color: #8b5cf6; font-size: 1.2em;">${pop.toLocaleString('fr-FR')}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="padding: 10px; background: #dbeafe; border-radius: 8px; text-align: center;">
                        <div style="color: #3b82f6; font-size: 1.3em; font-weight: 800;">${(commune.population_hommes || 0).toLocaleString('fr-FR')}</div>
                        <div style="font-size: 0.85em; color: #1e40af; margin-top: 4px;">👨 Hommes</div>
                    </div>
                    <div style="padding: 10px; background: #fce7f3; border-radius: 8px; text-align: center;">
                        <div style="color: #ec4899; font-size: 1.3em; font-weight: 800;">${(commune.population_femmes || 0).toLocaleString('fr-FR')}</div>
                        <div style="font-size: 0.85em; color: #be185d; margin-top: 4px;">👩 Femmes</div>
                    </div>
                </div>
                <div style="padding: 10px; background: #f3f4f6; border-radius: 8px; text-align: center; font-size: 0.9em; color: #6b7280;">
                    🏛️ Code INSEE: <strong>${commune.code_insee}</strong>
                </div>
            </div>
        </div>
    `;
}

/**
 * Crée la légende de la carte
 * @param {Array} communes - Liste des communes
 * @returns {string} HTML
 */
function createMapLegend(communes) {
    const populations = communes.map(c => c.population_ensemble || 0).filter(p => p > 0);
    const avgPop = populations.reduce((a, b) => a + b, 0) / populations.length;
    
    return `
        <div class="map-legend-simple">
            <h4><i class="fas fa-info-circle"></i> Population</h4>
            <div class="legend-items">
                <div class="legend-row">
                    <div class="legend-color" style="background: #60a5fa;"></div>
                    <span>Petite (&lt; ${Math.round(avgPop * 0.8).toLocaleString('fr-FR')})</span>
                </div>
                <div class="legend-row">
                    <div class="legend-color" style="background: #a78bfa;"></div>
                    <span>Moyenne (${Math.round(avgPop * 0.8).toLocaleString('fr-FR')} - ${Math.round(avgPop * 1.5).toLocaleString('fr-FR')})</span>
                </div>
                <div class="legend-row">
                    <div class="legend-color" style="background: #f472b6;"></div>
                    <span>Grande (&gt; ${Math.round(avgPop * 1.5).toLocaleString('fr-FR')})</span>
                </div>
            </div>
            <div class="legend-note">
                <small>💡 Cliquez sur une commune</small>
            </div>
        </div>
    `;
}

// ════════════════════════════════════════════════════════════════════════════════
// 🌍 CESIUM - CARTE POLLUTION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Crée la carte de pollution
 * @param {Array} data - Données de pollution
 * @param {number} viewerIndex - Index du viewer
 */




// ════════════════════════════════════════════════════════════════════════════════
// 📊 VISUALISATIONS - PYRAMIDE DES ÂGES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Crée la pyramide des âges
 * @param {Array} data - Données démographiques
 * @returns {string} HTML
 */
function createAgePyramid(data) {
    if (!data || data.length === 0) return '';
    
    const cleanValue = (str) => {
        if (!str) return 0;
        return parseInt(str.toString().replace(/\s/g, '').replace(/\u00a0/g, '')) || 0;
    };
    
    const ageRanges = data
        .filter(item => {
            const age = item.empty;
            return age && !age.includes('Ensemble') && !age.includes('ou plus') && age.includes('à');
        })
        .map(item => ({
            label: item.empty,
            hommes: cleanValue(item.hommes),
            femmes: cleanValue(item.femmes)
        }))
        .sort((a, b) => {
            const getAge = (label) => parseInt(label.split('à')[0].trim());
            return getAge(b.label) - getAge(a.label);
        });
    
    if (ageRanges.length === 0) return '';
    
    const maxValue = Math.max(...ageRanges.map(r => Math.max(r.hommes, r.femmes)));
    const rows = createPyramidRows(ageRanges, maxValue);
    
    setTimeout(() => animatePyramid(ageRanges), 300);
    
    const totalHommes = ageRanges.reduce((sum, r) => sum + r.hommes, 0);
    const totalFemmes = ageRanges.reduce((sum, r) => sum + r.femmes, 0);
    const total = totalHommes + totalFemmes;
    
    return `
        <div class="pyramid-wrapper">
            <h3 class="pyramid-title">
                <i class="fas fa-users"></i>
                Pyramide des Âges - Population par sexe et âge
            </h3>
            <div class="pyramid-legend">
                <div class="legend-item">
                    <div class="legend-color legend-homme"></div>
                    <span>Hommes: ${totalHommes.toLocaleString('fr-FR')} (${((totalHommes/total)*100).toFixed(1)}%)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-femme"></div>
                    <span>Femmes: ${totalFemmes.toLocaleString('fr-FR')} (${((totalFemmes/total)*100).toFixed(1)}%)</span>
                </div>
            </div>
            <div class="pyramid-container">
                <div class="pyramid-axis-label left">HOMMES</div>
                <div class="pyramid-content">${rows}</div>
                <div class="pyramid-axis-label right">FEMMES</div>
            </div>
            <div class="pyramid-footer">
                <small>Population totale: ${total.toLocaleString('fr-FR')} habitants</small>
            </div>
        </div>
    `;
}

/**
 * Crée les lignes de la pyramide
 */
function createPyramidRows(ageRanges, maxValue) {
    return ageRanges.map((range, index) => {
        const hommePercent = (range.hommes / maxValue) * 100;
        const femmePercent = (range.femmes / maxValue) * 100;
        const hommeGlow = `0 0 ${8 + hommePercent / 15}px rgba(59, 130, 246, 0.7)`;
        const femmeGlow = `0 0 ${8 + femmePercent / 15}px rgba(236, 72, 153, 0.7)`;
        
        return `
            <div class="pyramid-row" data-index="${index}">
                <div class="pyramid-bar-left">
                    <span class="pyramid-value-left">${range.hommes.toLocaleString('fr-FR')}</span>
                    <div class="pyramid-bar pyramid-bar-homme"
                         style="width: 0%; box-shadow: ${hommeGlow};"
                         data-width="${hommePercent}%">
                    </div>
                </div>
                <div class="pyramid-label">${range.label}</div>
                <div class="pyramid-bar-right">
                    <div class="pyramid-bar pyramid-bar-femme"
                         style="width: 0%; box-shadow: ${femmeGlow};"
                         data-width="${femmePercent}%">
                    </div>
                    <span class="pyramid-value-right">${range.femmes.toLocaleString('fr-FR')}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Anime la pyramide des âges
 */
function animatePyramid(ageRanges) {
    document.querySelectorAll('.pyramid-bar').forEach((bar, i) => {
        setTimeout(() => {
            bar.style.width = bar.dataset.width;
        }, i * 50);
    });
    
    setTimeout(() => {
        document.querySelectorAll('.pyramid-value-left, .pyramid-value-right').forEach(val => {
            val.style.opacity = '1';
        });
    }, ageRanges.length * 50 + 300);
}



// ════════════════════════════════════════════════════════════════════════════════
// 💧 MODULE QUALITÉ DE L'EAU 
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Crée le dashboard de qualité de l'eau par commune
 * @param {Array} waterData - Données brutes de qualité de l'eau
 * @returns {string} HTML
 */
function createWaterDashboard(waterData) {
    if (!Array.isArray(waterData) || waterData.length === 0) {
        return '';
    }

    // Grouper par commune
    const groupByCommune = {};
    waterData.forEach(item => {
        const commune = item.nom_commune || "Commune inconnue";
        if (!groupByCommune[commune]) {
            groupByCommune[commune] = [];
        }
        groupByCommune[commune].push(item);
    });

    // Calculer les stats
    const totalCommunes = Object.keys(groupByCommune).length;
    const totalAnalyses = waterData.length;
    const conformeCount = waterData.filter(item => 
        (item.conclusion_conformite_prelevement || '').toLowerCase().includes('conforme')
    ).length;
    const tauxConformite = ((conformeCount / totalAnalyses) * 100).toFixed(1);

    let html = `
        <div class="water-section">
            <div class="dashboard-header">
                <h2><i class="fas fa-tint"></i> Qualité de l'Eau Potable</h2>
                <p>Analyses par commune - Contrôle sanitaire</p>
            </div>
            
            <!-- Stats globales -->
            <div class="water-stats-mini">
                <div class="stat-mini-card">
                    <div class="stat-mini-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-city"></i>
                    </div>
                    <div class="stat-mini-content">
                        <div class="stat-mini-value">${totalCommunes}</div>
                        <div class="stat-mini-label">Communes</div>
                    </div>
                </div>
                <div class="stat-mini-card">
                    <div class="stat-mini-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-vial"></i>
                    </div>
                    <div class="stat-mini-content">
                        <div class="stat-mini-value">${totalAnalyses}</div>
                        <div class="stat-mini-label">Analyses</div>
                    </div>
                </div>
                <div class="stat-mini-card">
                    <div class="stat-mini-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-mini-content">
                        <div class="stat-mini-value">${tauxConformite}%</div>
                        <div class="stat-mini-label">Conformité</div>
                    </div>
                </div>
            </div>
            
            <!-- Barre de recherche -->
            <div class="water-search-container">
                <input type="text" 
                       id="waterSearch" 
                       class="water-search-input"
                       placeholder="🔍 Rechercher une commune..." 
                       oninput="filterWaterCommunes()" />
                 <button id="toggleCommunesBtn" 
                         class="toggle-communes-btn" 
                            onclick="toggleWaterCommunes()">
                         👁️ Masquer les communes
                 </button>
            </div>
            
            <!-- Cartes par commune -->
            <div id="waterCommunes" class="water-communes-grid">
    `;

    Object.entries(groupByCommune).forEach(([commune, items]) => {
        // Calculer le taux de conformité pour cette commune
        const conformeCommune = items.filter(item => 
            (item.conclusion_conformite_prelevement || '').toLowerCase().includes('conforme')
        ).length;
        const tauxCommune = ((conformeCommune / items.length) * 100).toFixed(1);
        const badgeColor = tauxCommune >= 95 ? '#10b981' : tauxCommune >= 80 ? '#f59e0b' : '#ef4444';

        let rows = '';
        items.slice(0, 20).forEach(item => {
            const isOk = (item.conclusion_conformite_prelevement || '').toLowerCase().includes('conforme');
            const conformiteClass = isOk ? 'conforme' : 'non-conforme';
            const conformiteIcon = isOk ? '✓' : '✗';

            rows += `
                <tr>
                    <td><strong>${item.libelle_parametre ?? '-'}</strong></td>
                    <td class="result-value">${item.resultat_alphanumerique ?? item.resultat_numerique ?? '-'}</td>
                    <td>${item.libelle_unite ?? '-'}</td>
                    <td><small>${item.date_prelevement?.split('T')[0] ?? '-'}</small></td>
                    <td>
                        <span class="conformite-badge ${conformiteClass}">
                            ${conformiteIcon} ${item.conclusion_conformite_prelevement ?? '-'}
                        </span>
                    </td>
                </tr>
            `;
        });

        html += `
            <div class="commune-card" data-commune="${commune.toLowerCase()}">
                <div class="commune-card-header">
                    <div class="commune-title">
                        <i class="fas fa-map-marker-alt"></i>
                        ${commune}
                    </div>
                    <div class="commune-badge" style="background: ${badgeColor};">
                        ${tauxCommune}% conforme
                    </div>
                </div>
                <div class="commune-stats">
                    <span><i class="fas fa-vial"></i> ${items.length} analyse(s)</span>
                    <span><i class="fas fa-check"></i> ${conformeCommune} conforme(s)</span>
                </div>
                <div class="table-wrapper">
                    <table class="water-table">
                        <thead>
                            <tr>
                                <th>Paramètre</th>
                                <th>Résultat</th>
                                <th>Unité</th>
                                <th>Date</th>
                                <th>Conformité</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;
    
    return html;
}
/**
 * Filtre les communes selon la recherche
 */
function filterWaterCommunes() {
    const search = document.getElementById("waterSearch");
    if (!search) return;
    
    const searchValue = search.value.toLowerCase();
    const cards = document.querySelectorAll(".commune-card");

    cards.forEach(card => {
        const commune = card.dataset.commune;
        card.style.display = commune.includes(searchValue) ? "block" : "none";
    });
}

function toggleWaterCommunes() {
    const container = document.getElementById("waterCommunes");
    const btn = document.getElementById("toggleCommunesBtn");

    if (!container || !btn) return;

    const isHidden = container.classList.toggle("hidden");

    btn.innerHTML = isHidden 
        ? "👁️ Afficher les communes" 
        : "🙈 Masquer les communes";
}


//MAP
// ════════════════════════════════════════════════════════════════════════════════
// 🗺️ FONCTION CESIUM AMÉLIORÉE - SOURCES D'EAU
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Affiche les sources d'eau sur la carte Cesium avec style amélioré
 * @param {Cesium.Viewer} viewer - Viewer Cesium
 * @param {Array} bssData - Données des sources BSS
 * @param {Object} options - Options d'affichage
 */
function displayWaterSourcesCesium(viewer, bssData, options = {}) {
    if (!viewer || !Array.isArray(bssData)) {
        console.error("❌ Viewer Cesium ou données invalides");
        return;
    }

    // Configuration par défaut
    const config = {
        clearExisting: true,
        animateCamera: true,
        showLabels: true,
        clampToGround: true,
        pixelSize: 14,
        outlineWidth: 3,
        ...options
    };

    // Nettoyer les entités existantes si demandé
    if (config.clearExisting) {
        viewer.entities.removeAll();
    }

    console.log(`🗺️ Affichage de ${bssData.length} source(s) d'eau sur Cesium`);

    // Compteurs par type
    const stats = {
        total: bssData.length,
        active: 0,
        inactive: 0,
        byType: {}
    };

    bssData.forEach((source, index) => {
        if (!source.latitude || !source.longitude) {
            console.warn(`⚠️ Source sans coordonnées:`, source);
            return;
        }

        // Déterminer si la source est active
        const isActive = !source.date_fin_mesure || 
                        new Date(source.date_fin_mesure) > new Date();
        
        if (isActive) stats.active++;
        else stats.inactive++;

        // Compter par type
        const type = source.nom_nature_pe || 'Inconnu';
        stats.byType[type] = (stats.byType[type] || 0) + 1;

        // Calculer la couleur selon le type et l'état
        const colorData = getSourceColor(source, isActive);
        
        // Position 3D
        const position = Cesium.Cartesian3.fromDegrees(
            source.longitude,
            source.latitude,
            source.altitude || 0
        );

        // Créer l'entité
        const entity = viewer.entities.add({
            id: `water-source-${source.bss_id || index}`,
            position: position,
            
            // Point principal
            point: {
                pixelSize: config.pixelSize,
                color: colorData.color,
                outlineColor: colorData.outlineColor,
                outlineWidth: config.outlineWidth,
                heightReference: config.clampToGround 
                    ? Cesium.HeightReference.CLAMP_TO_GROUND 
                    : Cesium.HeightReference.NONE,
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.5, 50000, 0.5),
                translucencyByDistance: new Cesium.NearFarScalar(1000, 1.0, 100000, 0.3)
            },

            // Label (si activé)
            label: config.showLabels ? {
                text: source.nom_commune || "Source",
                font: '700 14px Space Grotesk, sans-serif',
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 3,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -25),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000),
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 30000, 0.5)
            } : undefined,

            // Description enrichie
            description: createEnhancedDescription(source, isActive, colorData)
        });

        // Animation d'apparition progressive
        if (config.animateCamera) {
            setTimeout(() => {
                if (entity && entity.point) {
                    // Effet de pulse à l'apparition
                    animatePointAppearance(entity);
                }
            }, index * 30);
        }
    });

    // Afficher les stats dans la console
    console.log('📊 Statistiques des sources:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Actives: ${stats.active}`);
    console.log(`   Inactives: ${stats.inactive}`);
    console.log('   Par type:', stats.byType);

    // Centrer et animer la caméra
    if (config.animateCamera && viewer.entities.values.length > 0) {
        setTimeout(() => {
            viewer.flyTo(viewer.entities, {
                duration: 2.5,
                offset: new Cesium.HeadingPitchRange(
                    Cesium.Math.toRadians(0),
                    Cesium.Math.toRadians(-45),
                    50000
                )
            }).catch(err => {
                console.warn('⚠️ Erreur lors de l\'animation de la caméra:', err);
                viewer.zoomTo(viewer.entities);
            });
        }, 500);
    }

    // Retourner les statistiques
    return stats;
}

/**
 * Détermine la couleur selon le type de source et son état
 * @param {Object} source - Données de la source
 * @param {boolean} isActive - Si la source est active
 * @returns {Object} { color, outlineColor, icon, label }
 */
function getSourceColor(source, isActive) {
    const type = (source.nom_nature_pe || '').toLowerCase();
    
    // Couleurs par type
    let baseColor, icon, label;
    
    if (type.includes('source')) {
        baseColor = Cesium.Color.fromCssColorString('#06b6d4'); // Cyan
        icon = '💧';
        label = 'Source';
    } else if (type.includes('forage') || type.includes('puits')) {
        baseColor = Cesium.Color.fromCssColorString('#8b5cf6'); // Violet
        icon = '🔧';
        label = 'Forage';
    } else if (type.includes('captage')) {
        baseColor = Cesium.Color.fromCssColorString('#10b981'); // Vert
        icon = '🚰';
        label = 'Captage';
    } else if (type.includes('piézomètre')) {
        baseColor = Cesium.Color.fromCssColorString('#f59e0b'); // Orange
        icon = '📊';
        label = 'Piézomètre';
    } else {
        baseColor = Cesium.Color.fromCssColorString('#6b7280'); // Gris
        icon = '🗺️';
        label = 'Autre';
    }

    // Assombrir si inactive
    if (!isActive) {
        baseColor = baseColor.darken(0.5, new Cesium.Color());
    }

    return {
        color: baseColor,
        outlineColor: isActive ? Cesium.Color.WHITE : Cesium.Color.DARKGRAY,
        icon: icon,
        label: label
    };
}

/**
 * Crée une description HTML enrichie pour l'infobulle
 * @param {Object} source - Données de la source
 * @param {boolean} isActive - Si la source est active
 * @param {Object} colorData - Données de couleur
 * @returns {string} HTML
 */
function createEnhancedDescription(source, isActive, colorData) {
    const color = colorData.color.toCssColorString();
    const statusBadge = isActive 
        ? '<span class="cesium-status-badge active">🟢 Active</span>'
        : '<span class="cesium-status-badge inactive">🔴 Inactive</span>';
    
    // Calculer la durée de mesure
    let duree = 'N/A';
    if (source.date_debut_mesure && source.date_fin_mesure) {
        const debut = new Date(source.date_debut_mesure);
        const fin = new Date(source.date_fin_mesure);
        const diffYears = Math.floor((fin - debut) / (1000 * 60 * 60 * 24 * 365));
        duree = `${diffYears} an${diffYears > 1 ? 's' : ''}`;
    }

    return `
        <div class="cesium-water-popup">
            <div class="cesium-popup-header" style="background: linear-gradient(135deg, ${color}, ${color}dd);">
                <div class="cesium-popup-icon">${colorData.icon}</div>
                <div class="cesium-popup-title">
                    <h3>${source.nom_commune || 'Source inconnue'}</h3>
                    <span class="cesium-popup-type">${colorData.label}</span>
                </div>
                ${statusBadge}
            </div>
            
            <div class="cesium-popup-body">
                <div class="cesium-info-grid">
                    <div class="cesium-info-item">
                        <div class="cesium-info-icon">🔖</div>
                        <div class="cesium-info-content">
                            <div class="cesium-info-label">Identifiant BSS</div>
                            <div class="cesium-info-value">${source.bss_id || source.code_bss || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="cesium-info-item">
                        <div class="cesium-info-icon">📍</div>
                        <div class="cesium-info-content">
                            <div class="cesium-info-label">Type d'ouvrage</div>
                            <div class="cesium-info-value">${source.nom_nature_pe || 'Non spécifié'}</div>
                        </div>
                    </div>
                    
                    <div class="cesium-info-item">
                        <div class="cesium-info-icon">📐</div>
                        <div class="cesium-info-content">
                            <div class="cesium-info-label">Altitude</div>
                            <div class="cesium-info-value">${source.altitude ? source.altitude.toFixed(1) + ' m' : 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="cesium-info-item">
                        <div class="cesium-info-icon">📅</div>
                        <div class="cesium-info-content">
                            <div class="cesium-info-label">Période de mesure</div>
                            <div class="cesium-info-value">${duree}</div>
                        </div>
                    </div>
                    
                    <div class="cesium-info-item full">
                        <div class="cesium-info-icon">📊</div>
                        <div class="cesium-info-content">
                            <div class="cesium-info-label">Dates de mesure</div>
                            <div class="cesium-info-dates">
                                <span class="cesium-date-badge">
                                    <strong>Début:</strong> ${formatDate(source.date_debut_mesure)}
                                </span>
                                <span class="cesium-date-separator">→</span>
                                <span class="cesium-date-badge">
                                    <strong>Fin:</strong> ${formatDate(source.date_fin_mesure) || 'En cours'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    ${source.nom_departement ? `
                        <div class="cesium-info-item full">
                            <div class="cesium-info-icon">🏛️</div>
                            <div class="cesium-info-content">
                                <div class="cesium-info-label">Localisation administrative</div>
                                <div class="cesium-info-value">
                                    ${source.nom_departement}${source.nom_region ? ` - ${source.nom_region}` : ''}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${source.noms_entite_hg_bdlisa ? `
                        <div class="cesium-info-item full">
                            <div class="cesium-info-icon">🌊</div>
                            <div class="cesium-info-content">
                                <div class="cesium-info-label">Entité hydrogéologique</div>
                                <div class="cesium-info-value small">${source.noms_entite_hg_bdlisa}</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="cesium-popup-footer">
                <small>
                    <strong>Coordonnées:</strong> 
                    ${source.latitude.toFixed(6)}°N, ${source.longitude.toFixed(6)}°E
                </small>
            </div>
        </div>
    `;
}

/**
 * Formate une date ISO en format français
 * @param {string} dateStr - Date ISO
 * @returns {string} Date formatée
 */
function formatDate(dateStr) {
    if (!dateStr) return null;
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    } catch (e) {
        return dateStr;
    }
}

/**
 * Anime l'apparition d'un point
 * @param {Cesium.Entity} entity - Entité Cesium
 */
function animatePointAppearance(entity) {
    if (!entity.point) return;
    
    const originalSize = entity.point.pixelSize.getValue();
    
    // Animation de pulse
    let scale = 0;
    const interval = setInterval(() => {
        scale += 0.1;
        if (scale >= 1) {
            scale = 1;
            clearInterval(interval);
        }
        entity.point.pixelSize = originalSize * (0.5 + scale * 0.5);
    }, 30);
}


// ════════════════════════════════════════════════════════════════════════════════
// 💧 MODULE QUALITÉ DE L'EAU - VISUALISATIONS
// ════════════════════════════════════════════════════════════════════════════════





// ════════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALISATION
// ════════════════════════════════════════════════════════════════════════════════

// Gestion du clavier
document.addEventListener('keydown', (e) => {
    if (STATE.currentView === 'book' && !STATE.isAnimating) {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') previousPage();
    }
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    showView('home');
    createParticles('particles');
    createParticles('particles2');
    
    console.log('📖 LIVRE RÉALISTE chargé avec MODULE QUALITÉ DE L\'EAU !');
    console.log('📊', CITIES_DATA.length, 'chapitres disponibles');
    console.log('💧 Module qualité de l\'eau : INTÉGRÉ ✅');
});