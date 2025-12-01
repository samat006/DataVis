
// ════════════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION GLOBALE
// ════════════════════════════════════════════════════════════════════════════════
import { createIntroductionPage } from "./introduction.js";
import { createTriSelectifDashboard, createDechargeDashboard } from "./dechet.js";
import { createSanteDashboard,initSanteCesiumMap } from "./sante.js";
import { createLogementDashboard } from "./logement.js";
import { createTravailDashboard } from "./emploi.js";
import { createEducationDashboard ,initEducationCesiumMap} from "./education.js";
import {  createTransportDashboard } from "./transport.js";
import { createSeniorsDashboard} from "./senior.js";
import { createSportDashboard } from "./sport.js";
import { createConclusionPage } from "./conclusion.js";
import { createSourcesPage } from './sources.js';



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

// 🌍 NOUVEAU : Stockage des zones de pollution et viewers Cesium
window.pollutionZonesData = {};
window.cesiumViewers = {};

// Coordonnées par défaut (Corse)
const DEFAULT_COORDS = {
    lon: 9.0,
    lat: 41.6,
    height: 200000
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
window.showView = function showView(viewName) {
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
window.nextPage = function nextPage() {
    if (STATE.isAnimating || STATE.currentPage >= CITIES_DATA.length - 1) return;
    
    STATE.isAnimating = true;

    const currentSpread = document.querySelector(`.page-spread[data-page="${STATE.currentPage}"]`);
    const nextSpread = document.querySelector(`.page-spread[data-page="${STATE.currentPage + 1}"]`);

    if (!currentSpread || !nextSpread) {
        STATE.isAnimating = false;
        return;
    }

    // ✅ VIDER les données de la page actuelle AVANT animation


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
window.previousPage = function previousPage() {
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
        TemperatureDashboard: '',
        dechettri: '',
        decharge: '',
        water: '',
        waterNapp: '',
        sante: '',
        logement: '',
        emploi: '',
        education: '',
        transport: '',
        seniors: '',
        sport: '',
        conclusion: '',
        introduction:'',
        birthRate: 0,
        deathRate: 0
    };
    
    const dataArray = normalizeDataToArray(city.data);
    
    // Parcourir les données
    dataArray.forEach((dataObj, i) => {
        try {
            //PYRAMIDE DES ÂGES
            if (dataObj['insee-population-par-sexe-et-age-en-2020-pop-t3']) {
                content.pyramid = createAgePyramid(dataObj['insee-population-par-sexe-et-age-en-2020-pop-t3']);
                console.log("onj", dataObj['insee-population-par-sexe-et-age-en-2020-pop-t3'],"index",i);
            }
            
            // DÉMOGRAPHIE INSEE
            if (dataObj.insee_demographiques_depuis_1968) {
                const result = processDemographicData(dataObj.insee_demographiques_depuis_1968);
                content.tables = result.tables;
                content.birthRate += result.birthRate;
                content.deathRate += result.deathRate;
            }
            
            //  EAU POTABLE PAR COMMUNE
            if (dataObj["prelevements-resultats-d-analyses-et-conclusions-sanitaires-issus-du-controle-sa"]) {
                content.water = createWaterDashboard(dataObj["prelevements-resultats-d-analyses-et-conclusions-sanitaires-issus-du-controle-sa"]);
            }
            //EAU NAPPE
            if (dataObj["eau-qualite-des-nappes-d-eau-souterraine-stations"]) {
                content.waterNapp = createWaterNapeDashboard(dataObj["eau-qualite-des-nappes-d-eau-souterraine-stations"]);
            }
            // POLLUTION - ZONES GÉOGRAPHIQUES
            if (dataObj["DonneEnv"]) {
                content.pollution = createPollutionDashboard(dataObj["DonneEnv"], index);
            }
             // TEMPÉRATURES ET CLIMAT
            if (dataObj["temperature-quotidienne-regionale-depuis-janvier-2016"]) {   
                content.TemperatureDashboard = createTemperatureDashboard(dataObj["temperature-quotidienne-regionale-depuis-janvier-2016"], index);}
                
            //  TRI SÉLECTIF DES DÉCHETS
            if (dataObj["tri-selectif-en-2012"]) {   
                content.dechettri = createTriSelectifDashboard(dataObj["tri-selectif-en-2012"],index);}
            
            //decharge bruts 
            if (dataObj["decharges-brutes-en-corse"]) {   
                content.decharge = createDechargeDashboard(dataObj["decharges-brutes-en-corse"],index);}
               
                //vider les données des chapitres passer
                 dataObj["decharges-brutes-en-corse"]=[]
                 dataObj["tri-selectif-en-2012"]=[]
                 dataObj["temperature-quotidienne-regionale-depuis-janvier-2016"]=[]
               
             
            //=========== chapitre 4  bien etre pop ===========
            // SANTÉ 
            if (dataObj["annuaire-sante-liste-localisation-et-tarifs-des-professionnels-de-sante2"]) {
                content.sante = createSanteDashboard(dataObj["annuaire-sante-liste-localisation-et-tarifs-des-professionnels-de-sante2"],dataObj["export_partenaires_07_10_2024"],dataObj["localisation-des-services-daccueil-des-urgences-en-corse"],dataObj["localisation-reanimation-hopital-corse"], index);}

            // LOGEMENT 
            if (dataObj["constructionrehabilitation_logementsocial_surface_prix"]) {
                content.logement = createLogementDashboard(dataObj["constructionrehabilitation_logementsocial_surface_prix"],dataObj["logements-et-logements-sociaux-dans-les-regions"],dataObj["insee-log-t8m-confort-des-residences-principales"], index);}
             
            // EMPLOI
            if (dataObj["insee-emp-g2-taux-de-chomage-au-sens-du-recensement-des-15-64-ans-par-diplome-e0"]) {
                content.emploi = createTravailDashboard(dataObj["insee-emp-g2-taux-de-chomage-au-sens-du-recensement-des-15-64-ans-par-diplome-e0"],dataObj["insee-rev-g1-taux-de-pauvrete-par-tranche-d-age-du-referent-fiscal-en-2020"],dataObj["insee-rev-g2-taux-de-pauvrete-par-statut-d-occupation-du-logement-du-referent-fi"],dataObj["insee-sal-g1-salaire-net-horaire-moyen-en-euros-selon-la-categorie-socioprofess0"], index);}
            // EDUCATION
            if (dataObj["annuaire-de-leducation"]) {
                content.education = createEducationDashboard(dataObj["annuaire-de-leducation"],dataObj["les-beneficiaires-de-la-prime-d-excellence-scientifique"],dataObj["les-enseignants-titulaires-de-l-enseignement-superieur-public"], index);}
            // TRANSPORT
            if (dataObj["gtfs-transport-horaires-cars-de-haute-corse"] ) {
                content.transport = createTransportDashboard(dataObj["gtfs-transport-horaires-cars-de-haute-corse"],dataObj["horaires-cars2a-gtfs"],dataObj["horaires-cfc-gtfs"],dataObj["parking"],dataObj["ppi-fer-2026-2030"],dataObj["signal-reseau-corse-recharge-vehicule-electrique"],dataObj["stationnement_velo"], index);}
            
            //============chapitre 5 seniors=============

            // SENIORS
            if (dataObj["60-et-plus_indicateurs-au-niveau-de-la-commune"] ) {
                content.seniors = createSeniorsDashboard( dataObj["60-et-plus_indicateurs-au-niveau-de-la-commune"], dataObj["75-ans-et-plus-indicateurs-de-vieillissement-par-departement"], index);}
            
            // SPORT
            if (dataObj["terrains-sportifs-en-corse"]) {
                content.sport = createSportDashboard(dataObj["terrains-sportifs-en-corse"], index);}
           

            }catch (error) {
            console.error(`❌ Erreur dataObj[${i}]:`, error);
            }
    });

    if (city.title === 'Introduction') {
     content.introduction=createIntroductionPage(index)
        }

    if(city.title=="Conclusion"){
              content.conclusion= createConclusionPage( index); 
            }
    if (city.title === 'Source') {
    console.log('📁 Page Annexes détectée');
    
    // Retourner un placeholder immédiatement
    const placeholder = `
        <div class="sources-loading" id="sources-placeholder-${index}">
            <div class="loader"></div>
            <p>Chargement des sources...</p>
        </div>
    `;
    
    // Charger le contenu réel en arrière-plan
    setTimeout(async () => {
        const content = await createSourcesPage(index);
        const placeholderElement = document.getElementById(`sources-placeholder-${index}`);
        if (placeholderElement) {
            placeholderElement.outerHTML = content;
        }
    }, 100);
    
    return placeholder;
}         // CONCLUSION
          

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
        ${content.waterNapp}
        ${content.pollution}
        ${content.pyramid}
        ${content.TemperatureDashboard }   
        ${content.dechettri}
        ${content.decharge}
        ${circleChart}
        ${content.tables}
        ${content.sante}
        ${content.logement}
        ${content.emploi}
        ${content.education}
        ${content.transport}
        ${content.seniors}
        ${content.sport}
        ${content.conclusion}
       ${ content.introduction}
    `;
}
// Structure de fichiers (exemple)
  
 


// 
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
    
    window.viewer  = new Cesium.Viewer(containerId, {
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
        selectionIndicator: true,
        camera: true
    });
    
    // Terrain 3D
    try {
        viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
    } catch (error) {
        console.log('Terrain 3D non disponible');
    }
    
    STATE.viewers[index] = viewer;
    window.cesiumViewers[index] = viewer; // 🔥 STOCKER GLOBALEMENT
    container.classList.remove('loading');
    
    // Charger les données
    loadCesiumData(viewer, city, index);
}

// ════════════════════════════════════════════════════════════════════════════════
// 🌍 CESIUM 
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Charge les données dans Cesium
 * @param {Object} viewer - Viewer Cesium
 * @param {Object} city - Données de la ville
 * @param {number} index - Index
 */
function loadCesiumData(viewer, city, index) {
    let dataLoaded = false;
    
    const dataArray = normalizeDataToArray(city.data);
    setDefaultView(viewer, city);
    dataArray.forEach(dataObj => {
        // Communes
        if (dataObj.population_corse && dataObj.population_corse.length > 0) {
            createCesiumMap(dataObj.population_corse, index);
            dataLoaded = true;
        }
        
        // ✅ SOURCES D'EAU - NAPPES PHRÉATIQUES
        if (dataObj["eau-qualite-des-nappes-d-eau-souterraine-stations"]) {
            displayWaterSourcesCesium(viewer, dataObj["eau-qualite-des-nappes-d-eau-souterraine-stations"]);
            dataLoaded = true;
        }
        // ✅ SANTÉ - HÔPITAUX ET URGENCES
        if (dataObj["annuaire-sante-liste-localisation-et-tarifs-des-professionnels-de-sante2"]) {
            initSanteCesiumMap( dataObj["annuaire-sante-liste-localisation-et-tarifs-des-professionnels-de-sante2"],dataObj["export_partenaires_07_10_2024"],dataObj["localisation-des-services-daccueil-des-urgences-en-corse"],dataObj["localisation-reanimation-hopital-corse"], viewer, index);
            dataLoaded = true;
        }

        //   ÉDUCATION GLOBALEMENT
        if (dataObj["annuaire-de-leducation"]) {
            initEducationCesiumMap(viewer, index);
        }
     
        
        
    });
}

/**
 * Définit la vue par défaut sur la Corse
 * @param {Object} viewer - Viewer Cesium
 * @param {Object} city - Données de la ville
 */
window.setDefaultView = function setDefaultView(viewer, city) {
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
                    <div class="stat-mini-icon" style="background: linear-gradient(135deg, #6b86ffff, #4c5ea7ff);">
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
window.filterWaterCommunes=function filterWaterCommunes() {
    const search = document.getElementById("waterSearch");
    if (!search) return;
    
    const searchValue = search.value.toLowerCase();
    const cards = document.querySelectorAll(".commune-card");

    cards.forEach(card => {
        const commune = card.dataset.commune;
        card.style.display = commune.includes(searchValue) ? "block" : "none";
    });
}

/**
 * Toggle l'affichage des communes
 */
window.toggleWaterCommunes= function toggleWaterCommunes() {
    const container = document.getElementById("waterCommunes");
    const btn = document.getElementById("toggleCommunesBtn");

    if (!container || !btn) return;

    const isHidden = container.classList.toggle("hidden");

    btn.innerHTML = isHidden 
        ? "👁️ Afficher les communes" 
        : "🙈 Masquer les communes";
}

window.toggleTemp=function toggleTemp(pageIndex) {
    const table = document.getElementById(`tempTable-${pageIndex}`);
    const btn = document.getElementById(`toggleTempBtn-${pageIndex}`);

    if (table.style.display === "none") {
        table.style.display = "table";
        btn.innerHTML = "👁️ Masquer les températures";
    } else {
        table.style.display = "none";
        btn.innerHTML = "👁️ Afficher les températures";
    }
}
window.toggleTempM=function toggleTemp(pageIndex) {
    const table = document.getElementById(`tempHeatmap-${pageIndex}`);
    const btn = document.getElementById(`toggleTempBtnM`);

    if (table.style.display === "none") {
        table.style.display = "table";
        btn.innerHTML = "👁️ Masquer ";
    } else {
        table.style.display = "none";
        btn.innerHTML = "👁️ Afficher ";
    }
}




// ════════════════════════════════════════════════════════════════════════════════
// 🗺️ FONCTION Les Source deau de Nape
// ════════════════════════════════════════════════════════════════════════════════

function createWaterNapeDashboard(waterData) {
    if (!Array.isArray(waterData) || waterData.length === 0) {
        return '';
    }

    // 📊 Stats
    const stats = {
        total: waterData.length,
        active: 0,
        inactive: 0,
        byType: {}
    };

    // ✅ Calcul des stats
    waterData.forEach(source => {
        const isActive = !source.date_fin_mesure || 
                        new Date(source.date_fin_mesure) > new Date();

        if (isActive) stats.active++;
        else stats.inactive++;

        const type = source.nom_nature_pe || 'Inconnu';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    let html = `
        <div class="water-section">
            <div class="dashboard-header">
                <h2><i class="fas fa-tint"></i> Qualité de l'Eau Nappes</h2>
                <p>Surveillance des captages et forages</p>
            </div>

            <!-- Stats -->
            <div class="water-stats-mini">
                <div class="stat-mini-card">
                    <div class="stat-mini-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-water"></i>
                    </div>
                    <div class="stat-mini-content">
                        <div class="stat-mini-value">${stats.total}</div>
                        <div class="stat-mini-label">Captages</div>
                    </div>
                </div>

                <div class="stat-mini-card">
                    <div class="stat-mini-icon" style="background: linear-gradient(135deg, #22c55e, #16a34a);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-mini-content">
                        <div class="stat-mini-value">${stats.active}</div>
                        <div class="stat-mini-label">Actifs</div>
                    </div>
                </div>

                <div class="stat-mini-card">
                    <div class="stat-mini-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="stat-mini-content">
                        <div class="stat-mini-value">${stats.inactive}</div>
                        <div class="stat-mini-label">Inactifs</div>
                    </div>
                </div>
                 <div class="decharge-legend">
                  <h4><i class="fas fa-info-circle"></i> Regardez sur la carte a droit cliquez sur les points pour plus de details ==>  </h4>
                    </div>

            </div>
    `;
html += `
    <!-- Légende des types de points d'eau -->
    
        <div class="decharge-legend">
            <h4><i class="fas fa-info-circle"></i> Légende </h4>
        <div class="legend-items">
            <div class="legend-item">
                <span class="legend-color" style="background:#06b6d4"></span> 💧 Source
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background:#d4bc07ff"></span> 🔧 Forage / Puits
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background:#1d0679ff"></span> 🚰 Captage
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background:#f59e0b"></span> 📊 Piézomètre
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background:#6b7280"></span> 🗺️ Autre
            </div>
        </div>
    </div>
`;

    return html;
}



// ════════════════════════════════════════════════════════════════════════════════
// 🗺️ FONCTION CESIUM  - SOURCES D'EAU
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
        pixelSize: 44,
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
                font: '700 30px Space Grotesk, sans-serif',
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
        baseColor = Cesium.Color.fromCssColorString('#d4bc07ff'); // Violet
        icon = '🔧';
        label = 'Forage';
    } else if (type.includes('captage')) {
        baseColor = Cesium.Color.fromCssColorString('#1d0679ff'); // Vert
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
        <div class="zone-card-body">
            <div class="zone-card-header" style="background: linear-gradient(135deg, ${color}, ${color}dd);">
                <div class="zone-card-icon">${colorData.icon}</div>
                <div class="cesium-popup-title">
                    <h3>${source.nom_commune || 'Source inconnue'}</h3>
                    <span class="cesium-popup-type">${colorData.label}</span>
                </div>
                ${statusBadge}
            </div>
            
            <div class="zone-card-body">
                <div class="zone-info-grid">
                    <div class="zone-info-item">
                        <div class="zone-info-icon">🔖</div>
                        <div class="zone-info-content">
                            <div class="zone-info-label">Identifiant BSS</div>
                            <div class="zone-info-value">${source.bss_id || source.code_bss || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="zone-info-item">
                        <div class="zone-info-icon">📍</div>
                        <div class="zone-info-content">
                            <div class="zone-info-label">Type d'ouvrage</div>
                            <div class="zone-info-value">${source.nom_nature_pe || 'Non spécifié'}</div>
                        </div>
                    </div>
                    
                    <div class="zone-info-item">
                        <div class="zone-info-icon">📐</div>
                        <div class="zone-info-content">
                            <div class="zone-info-label">Altitude</div>
                            <div class="zone-info-value">${source.altitude ? source.altitude.toFixed(1) + ' m' : 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="zone-info-item">
                        <div class="zone-info-icon">📅</div>
                        <div class="zone-info-content">
                            <div class="zone-info-label">Période de mesure</div>
                            <div class="zone-info-value">${duree}</div>
                        </div>
                    </div>
                    
                    <div class="zone-info-item full">
                        <div class="zone-info-icon">📊</div>
                        <div class="zone-info-content">
                            <div class="zone-info-label">Dates de mesure</div>
                            <div class="zone-info-dates">
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
                        <div class="zone-info-item full">
                            <div class="zone-info-icon">🏛️</div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Localisation administrative</div>
                                <div class="zone-info-value">
                                    ${source.nom_departement}${source.nom_region ? ` - ${source.nom_region}` : ''}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${source.noms_entite_hg_bdlisa ? `
                        <div class="zone-info-item full">
                            <div class="zone-info-icon">🌊</div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Entité hydrogéologique</div>
                                <div class="zone-info-value small">${source.noms_entite_hg_bdlisa}</div>
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
/**function formatDate(dateStr) {
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
// 🌍 FONCTION POLLUTION - AVEC ZONES GÉOGRAPHIQUES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Crée le dashboard de pollution avec zones géographiques (ZAS)
 * @param {Array} pollutionData - Données de pollution avec géométries
 * @param {number} pageIndex - Index de la page courante
 * @returns {string} HTML du dashboard
 */
function createPollutionDashboard(pollutionData, pageIndex) {
    if (!Array.isArray(pollutionData) || pollutionData.length === 0) {
        return '';
    }

    console.log(`🌍 Traitement de ${pollutionData.length} zone(s) de pollution pour la page ${pageIndex}`);

    // 🔥 Initialiser le stockage pour cette page
    if (!window.pollutionZonesData[pageIndex]) {
        window.pollutionZonesData[pageIndex] = [];
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 1️⃣ GROUPER PAR ZONE ET POLLUANT
    // ═══════════════════════════════════════════════════════════════════════════
    
    const zonesByType = {
        'ZRE': [], // Zone à Risque d'Exposition
        'ZAR': [], // Zone Administrative de Référence
        'Autre': []
    };

    const pollutantStats = {};
    const zones = [];

    pollutionData.forEach(item => {
        const typeZas = item.type_zas || 'Autre';
        const pollutant = item.nom_poll || 'Inconnu';
        
        // Grouper par type
        if (zonesByType[typeZas]) {
            zonesByType[typeZas].push(item);
        } else {
            zonesByType['Autre'].push(item);
        }

        // Stats par polluant
        if (!pollutantStats[pollutant]) {
            pollutantStats[pollutant] = {
                count: 0,
                totalPop: 0,
                totalSurf: 0,
                zones: []
            };
        }
        pollutantStats[pollutant].count++;
        pollutantStats[pollutant].totalPop += item.pop_insee || 0;
        pollutantStats[pollutant].totalSurf += item.surf_total || 0;
        pollutantStats[pollutant].zones.push(item.lib_zas);

        // Liste des zones
        const zoneObj = {
            id: item.id_zas,
            name: item.lib_zas,
            type: item.type_zas,
            pollutant: item.nom_poll,
            population: item.pop_insee,
            surface: item.surf_total,
            year: item.annee,
            limit: item.valeur_reg,
            geometry: item.geo_shape // 🔥 IMPORTANT : garder la géométrie complète
        };
        
        zones.push(zoneObj);
    });

    // 🔥 STOCKER TOUTES LES ZONES POUR CETTE PAGE
    window.pollutionZonesData[pageIndex] = zones;
    console.log(`✅ ${zones.length} zones stockées pour la page ${pageIndex}`);

    // ═══════════════════════════════════════════════════════════════════════════
    // 2️⃣ CONSTRUIRE LE HTML
    // ═══════════════════════════════════════════════════════════════════════════

    let html = `
        <div class="pollution-section">
            <div class="dashboard-header-r">
                <h2><i class="fas fa-wind"></i> Qualité de l'Air - Zones de Surveillance</h2>
                <p>Zones Administratives de Surveillance (ZAS) - Suivi des polluants atmosphériques</p>
            </div>

            <!-- Stats globales -->
            <div class="pollution-stats-global">
                <div class="stat-card-global">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-map-marked-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${pollutionData.length}</div>
                        <div class="stat-label">Zone${pollutionData.length > 1 ? 's' : ''} de surveillance</div>
                    </div>
                </div>

                <div class="stat-card-global">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${formatNumber(Object.values(pollutantStats).reduce((sum, p) => sum + p.totalPop, 0))}</div>
                        <div class="stat-label">Population exposée</div>
                    </div>
                </div>

                <div class="stat-card-global">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-chart-area"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${Object.keys(pollutantStats).length}</div>
                        <div class="stat-label">Polluant${Object.keys(pollutantStats).length > 1 ? 's' : ''} surveillé${Object.keys(pollutantStats).length > 1 ? 's' : ''}</div>
                    </div>
                </div>
            </div>

            <!-- Filtres par type de zone -->
            <div class="pollution-filters">
                <button class="filter-btn active" onclick="filterPollutionZones('all')">
                    📊 Toutes les zones (${pollutionData.length})
                </button>
                ${zonesByType['ZRE'].length > 0 ? `
                    <button class="filter-btn" onclick="filterPollutionZones('ZRE')">
                        ⚠️ ZRE - Zones à Risque (${zonesByType['ZRE'].length})
                    </button>
                ` : ''}
                ${zonesByType['ZAR'].length > 0 ? `
                    <button class="filter-btn" onclick="filterPollutionZones('ZAR')">
                        🏛️ ZAR - Zones Administratives (${zonesByType['ZAR'].length})
                    </button>
                ` : ''}
            </div>

            <!-- Grid des zones -->
            <div class="pollution-zones-grid">
    `;

    // ═══════════════════════════════════════════════════════════════════════════
    // 3️⃣ CARTES PAR ZONE
    // ═══════════════════════════════════════════════════════════════════════════

    zones.forEach((zone, index) => {
        const typeIcon = zone.type === 'ZRE' ? '⚠️' : zone.type === 'ZAR' ? '🏛️' : '📍';
        const typeColor = zone.type === 'ZRE' ? '#ef4444' : zone.type === 'ZAR' ? '#3b82f6' : '#6b7280';
        const typeName = zone.type === 'ZRE' ? 'Zone à Risque d\'Exposition' : 
                        zone.type === 'ZAR' ? 'Zone Administrative de Référence' : 
                        'Zone de surveillance';

        html += `
            <div class="pollution-zone-card" data-zone-type="${zone.type}" data-zone-id="${zone.id}">
                <div class="zone-card-header" style="background: linear-gradient(135deg, ${typeColor}, ${typeColor}dd);">
                    <div class="zone-icon">${typeIcon}</div>
                    <div class="zone-title">
                        <h3>${zone.name}</h3>
                        <span class="zone-type-badge">${zone.type}</span>
                    </div>
                </div>

                <div class="zone-card-body">
                    <div class="zone-info-grid">
                        <!-- Polluant -->
                        <div class="zone-info-item">
                            <div class="zone-info-icon" style="color: ${getPollutantColor(zone.pollutant)};">
                                ${getPollutantIcon(zone.pollutant)}
                            </div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Polluant surveillé</div>
                                <div class="zone-info-value">${zone.pollutant}</div>
                            </div>
                        </div>

                        <!-- Valeur réglementaire -->
                        <div class="zone-info-item">
                            <div class="zone-info-icon">⚖️</div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Valeur réglementaire</div>
                                <div class="zone-info-value">${zone.limit || 'N/A'}</div>
                            </div>
                        </div>

                        <!-- Population -->
                        <div class="zone-info-item">
                            <div class="zone-info-icon">👥</div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Population exposée</div>
                                <div class="zone-info-value">${formatNumber(zone.population)} hab.</div>
                            </div>
                        </div>

                        <!-- Surface -->
                        <div class="zone-info-item">
                            <div class="zone-info-icon">📐</div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Surface totale</div>
                                <div class="zone-info-value">${formatNumber(zone.surface)} ha</div>
                            </div>
                        </div>

                        <!-- Année -->
                        <div class="zone-info-item full">
                            <div class="zone-info-icon">📅</div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Année de référence</div>
                                <div class="zone-info-value">${zone.year}</div>
                            </div>
                        </div>

                        <!-- Type détaillé -->
                        <div class="zone-info-item full">
                            <div class="zone-info-icon">ℹ️</div>
                            <div class="zone-info-content">
                                <div class="zone-info-label">Type de zone</div>
                                <div class="zone-info-value small">${typeName}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Bouton pour voir la géométrie - ADAPTÉ POUR CESIUM -->
                    ${zone.geometry ? `
                    <div class="map-controls">

                    <button class="map-control-btn" onclick="clearMap(${index})">
                        <i class="fas fa-eraser"></i> Vider
                    </button>
                    <button class="map-control-btn" onclick="showZoneGeometryCesiumById(${index})">
                        <i class="fas fa-eye"></i> 🗺️ Voir la zone sur la carte
                    </button>
                </div>

                    ` : ''}
                </div>

                <div class="zone-card-footer">
                    <small><strong>ID:</strong> ${zone.id}</small>
                </div>
            </div>
        `;
    });

    html += `
            </div>

            <!-- Légende -->
            <div class="pollution-legend">
                <h3>📖 Légende</h3>
                <div class="legend-items">
                    <div class="legend-item">
                        <span class="legend-badge" style="background: #ef4444;">⚠️ ZRE</span>
                        <span>Zone à Risque d'Exposition - Zones où la pollution dépasse les seuils</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-badge" style="background: #3b82f6;">🏛️ ZAR</span>
                        <span>Zone Administrative de Référence - Zones de surveillance standard</span>
                    </div>
                </div>
            </div>

            <!-- Stats par polluant -->
            <div class="pollutant-stats-section">
                <h3>📊 Statistiques par polluant</h3>
                <div class="pollutant-stats-grid">
    `;

    Object.entries(pollutantStats).forEach(([pollutant, stats]) => {
        const color = getPollutantColor(pollutant);
        const icon = getPollutantIcon(pollutant);

        html += `
            <div class="pollutant-stat-card">
                <div class="pollutant-header" style="background: ${color};">
                    <span class="pollutant-icon">${icon}</span>
                    <span class="pollutant-name">${pollutant}</span>
                </div>
                <div class="pollutant-body">
                    <div class="pollutant-metric">
                        <span class="metric-label">Zones surveillées</span>
                        <span class="metric-value">${stats.count}</span>
                    </div>
                    <div class="pollutant-metric">
                        <span class="metric-label">Population totale</span>
                        <span class="metric-value">${formatNumber(stats.totalPop)} hab.</span>
                    </div>
                    <div class="pollutant-metric">
                        <span class="metric-label">Surface totale</span>
                        <span class="metric-value">${formatNumber(stats.totalSurf)} ha</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
                </div>
            </div>
        </div>
    `;

    return html;
}

// ════════════════════════════════════════════════════════════════════════════════
// 🎨 FONCTIONS UTILITAIRES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Retourne la couleur selon le polluant
 */
function getPollutantColor(pollutant) {
    const colors = {
        'NO2': '#ef4444',    // Rouge
        'PM10': '#f59e0b',   // Orange
        'PM2.5': '#d97706',  // Orange foncé
        'O3': '#06b6d4',     // Cyan
        'SO2': '#8b5cf6',    // Violet
        'CO': '#6b7280',     // Gris
        'default': '#3b82f6' // Bleu
    };
    return colors[pollutant] || colors['default'];
}

/**
 * Retourne l'icône selon le polluant
 */
function getPollutantIcon(pollutant) {
    const icons = {
        'NO2': '🚗',     // Dioxyde d'azote (trafic)
        'PM10': '🏭',    // Particules (industrie)
        'PM2.5': '💨',   // Particules fines
        'O3': '☀️',      // Ozone
        'SO2': '🏭',     // Dioxyde de soufre
        'CO': '🔥',      // Monoxyde de carbone
        'default': '🌫️'  // Défaut
    };
    return icons[pollutant] || icons['default'];
}

/**
 * Formate un nombre avec espaces
 */
function formatNumber(num) {
    if (!num && num !== 0) return 'N/A';
    return Math.round(num).toLocaleString('fr-FR');
}

/**
 * Filtre les zones par type
 */
function filterPollutionZones(type) {
    const cards = document.querySelectorAll('.pollution-zone-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Mettre à jour les boutons
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if ((type === 'all' && btn.textContent.includes('Toutes')) ||
            (type !== 'all' && btn.textContent.includes(type))) {
            btn.classList.add('active');
        }
    });

    // Filtrer les cartes
    cards.forEach(card => {
        if (type === 'all') {
            card.style.display = 'block';
        } else {
            card.style.display = card.dataset.zoneType === type ? 'block' : 'none';
        }
    });
}

// ════════════════════════════════════════════════════════════════════════════════
// 🗺️ FONCTIONS CESIUM POUR AFFICHAGE DES ZONES DE POLLUTION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * 🔥 FONCTION WRAPPER - Affiche une zone spécifique depuis un bouton
 * @param {number} zoneIndex - Index de la zone dans le tableau
 */
window.showZoneGeometryCesiumById= function showZoneGeometryCesiumById(zoneIndex) {
    console.log(`🗺️ Demande d'affichage de la zone index ${zoneIndex} (page ${STATE.currentPage})`);
    
    // Récupérer le viewer de la page actuelle
    const viewer = window.cesiumViewers[STATE.currentPage];
    if (!viewer) {
        alert('⚠️ Le viewer Cesium n\'est pas encore initialisé. Veuillez patienter quelques secondes.');
        console.error('❌ Viewer non trouvé pour la page', STATE.currentPage);
        return;
    }
    
    // Récupérer les zones de la page actuelle
    const zones = window.pollutionZonesData[STATE.currentPage];
    if (!zones || zones.length === 0) {
        alert('⚠️ Aucune zone de pollution disponible sur cette page');
        console.error('❌ Pas de zones pour la page', STATE.currentPage);
        return;
    }
    
    // Récupérer la zone spécifique
    const zone = zones[zoneIndex];
    if (!zone) {
        alert(`⚠️ Zone ${zoneIndex} introuvable`);
        console.error(`❌ Zone ${zoneIndex} n'existe pas dans`, zones);
        return;
    }
    
    console.log(`✅ Zone trouvée: "${zone.name}"`, zone);
    
    // Appeler la fonction d'affichage principale
    showZoneGeometryCesiumSingle(viewer, zone, zoneIndex);
}

/**
 * 🗺️ Affiche UNE SEULE zone de pollution dans Cesium
 * @param {Cesium.Viewer} viewer - Viewer Cesium
 * @param {Object} zone - Données de la zone
 * @param {number} zoneIndex - Index de la zone
 */
/**
 * 🗺️ Affiche UNE SEULE zone de pollution dans Cesium
 * @param {Cesium.Viewer} viewer - Viewer Cesium
 * @param {Object} zone - Données de la zone
 * @param {number} zoneIndex - Index de la zone
 */
function showZoneGeometryCesiumSingle(viewer, zone, zoneIndex) {
    console.log(`🗺️ Affichage de la zone "${zone.name}" sur Cesium`);
    
    try {
        // 1️⃣ Extraire les coordonnées - GESTION AMÉLIORÉE
        let coordinates = [];
        let geometry = null;
        
        // Détecter la structure de la géométrie
        if (zone.geometry) {
            // Cas 1: GeoJSON Feature (type: 'Feature')
            if (zone.geometry.type === 'Feature' && zone.geometry.geometry) {
                geometry = zone.geometry.geometry;
                console.log('📍 Structure détectée: GeoJSON Feature');
            }
            // Cas 2: GeoJSON direct (type: 'Polygon' ou 'MultiPolygon')
            else if (zone.geometry.type === 'Polygon' || zone.geometry.type === 'MultiPolygon') {
                geometry = zone.geometry;
                console.log('📍 Structure détectée: GeoJSON direct');
            }
            // Cas 3: Objet avec geometry imbriqué
            else if (zone.geometry.geometry) {
                geometry = zone.geometry.geometry;
                console.log('📍 Structure détectée: Géométrie imbriquée');
            }
        }
        
        // Extraire les coordonnées selon le type
        if (geometry) {
            if (geometry.type === 'Polygon') {
                coordinates = geometry.coordinates[0];
                console.log(`✅ Polygon trouvé avec ${geometry.coordinates[0].length} points`);
            } 
            else if (geometry.type === 'MultiPolygon') {
                // Prendre le premier polygone du MultiPolygon
                coordinates = geometry.coordinates[0][0];
                console.log(`✅ MultiPolygon trouvé, utilisation du premier polygone avec ${geometry.coordinates[0][0].length} points`);
            }
            else if (geometry.coordinates) {
                // Cas générique
                const coords = geometry.coordinates;
                coordinates = Array.isArray(coords[0]) ? coords[0] : coords;
                console.log(`✅ Coordonnées génériques trouvées: ${coordinates.length} points`);
            }
        }
        
        // Vérification finale
        if (!coordinates || coordinates.length === 0) {
            console.error('❌ Structure de la géométrie:', zone.geometry);
            alert('⚠️ Cette zone n\'a pas de coordonnées géographiques valides.\n\nStructure détectée:\n' + JSON.stringify(zone.geometry, null, 2).substring(0, 200));
            return;
        }
        
        console.log(`✅ ${coordinates.length} coordonnées extraites`);
        
        // 2️⃣ Convertir en Cartesian3
        const positions = [];
        let invalidCount = 0;
        
        coordinates.forEach((coord, idx) => {
            const lon = coord[0] || coord.longitude || coord.lon;
            const lat = coord[1] || coord.latitude || coord.lat;
            
            if (lon === undefined || lat === undefined || isNaN(lon) || isNaN(lat)) {
                console.warn(`⚠️ Coordonnée ${idx} invalide:`, coord);
                invalidCount++;
                return;
            }
            
            // Vérifier que les coordonnées sont dans des plages valides
            if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
                console.warn(`⚠️ Coordonnée ${idx} hors limites: lon=${lon}, lat=${lat}`);
                invalidCount++;
                return;
            }
            
            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat));
        });
        
        if (invalidCount > 0) {
            console.warn(`⚠️ ${invalidCount} coordonnée(s) invalide(s) ignorée(s)`);
        }
        
        if (positions.length < 3) {
            alert(`⚠️ Pas assez de coordonnées valides pour tracer la zone.\n\n${positions.length} coordonnées valides sur ${coordinates.length} totales.`);
            return;
        }
        
        console.log(`✅ ${positions.length} positions Cesium créées`);
        
        // 3️⃣ Couleur selon le polluant
        const pollutantColor = getPollutantColor(zone.pollutant);
        const cesiumColor = Cesium.Color.fromCssColorString(pollutantColor);
        
        // 4️⃣ Supprimer l'ancienne entité si elle existe
        const entityId = `pollution-zone-${zoneIndex}`;
        const existingEntity = viewer.entities.getById(entityId);
        if (existingEntity) {
            viewer.entities.remove(existingEntity);
            console.log('🗑️ Ancienne entité supprimée');
        }
        
        // 5️⃣ Créer l'entité Cesium
        const entity = viewer.entities.add({
            id: entityId,
            name: zone.name,
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                material: cesiumColor.withAlpha(0.6),
                outline: true,
                outlineColor: cesiumColor,
                outlineWidth: 3,
                height: 0,
                extrudedHeight: 500, // Hauteur d'extrusion
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            description: createPollutionZoneDescription(zone)
        });
        
        console.log(`✅ Entité Cesium créée avec ID: ${entityId}`);
        
        // 6️⃣ Calculer la distance de zoom appropriée
        const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
        const distance = Math.max(
            boundingSphere.radius * 3, // Au moins 3x le rayon
            10000 // Minimum 10km
        );
        
        console.log(`📏 Distance de zoom calculée: ${Math.round(distance)}m`);
        
        // 7️⃣ Zoomer sur la zone avec animation
        viewer.flyTo(entity, {
            duration: 2.5,
            offset: new Cesium.HeadingPitchRange(
                Cesium.Math.toRadians(0),   // heading
                Cesium.Math.toRadians(-45), // pitch
                distance                     // range
            )
        }).then(() => {
            console.log('✅ Animation de zoom terminée');
            
            // 8️⃣ Ouvrir automatiquement l'infobulle
            setTimeout(() => {
                viewer.selectedEntity = entity;
                console.log('✅ Infobulle ouverte');
            }, 500);
        }).catch(err => {
            console.error('❌ Erreur lors du zoom:', err);
        });
        
        console.log(`✅ Zone "${zone.name}" affichée avec succès`);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'affichage de la zone:', error);
        console.error('Stack trace:', error.stack);
        alert(`Erreur technique lors de l'affichage de la zone:\n\n${error.message}`);
    }
}
/**
 * 📝 Crée la description HTML pour une zone de pollution dans Cesium
 * @param {Object} zone - Données de la zone
 * @returns {string} HTML
 */
function createPollutionZoneDescription(zone) {
    const typeColor = zone.type === 'ZRE' ? '#ef4444' : '#3b82f6';
    const typeIcon = zone.type === 'ZRE' ? '⚠️' : '🏛️';
    const pollutantIcon = getPollutantIcon(zone.pollutant);
    
    return `
        <div style="font-family: 'Space Grotesk', sans-serif; min-width: 350px; max-width: 400px;">
            <div style="background: linear-gradient(135deg, ${typeColor}, ${typeColor}dd); 
                        padding: 15px; margin: -9px -9px 15px -9px; border-radius: 8px 8px 0 0;">
                <h3 style="margin: 0; color: white; font-size: 1.4em; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5em;">${typeIcon}</span>
                    ${zone.name}
                </h3>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 0.9em; font-weight: 600;">
                    ${zone.type} - ${zone.type === 'ZRE' ? 'Zone à Risque d\'Exposition' : 'Zone Administrative de Référence'}
                </p>
            </div>
            
            <div style="padding: 0 5px;">
                <div style="background-color: #ffffffff; 
                            padding: 12px; border-radius: 8px; margin-bottom: 12px; 
                            color: #ffffffff !important;
                            border-left: 4px solid ${getPollutantColor(zone.pollutant)};">
                    <div style="font-size: 1.1em; font-weight: 700; color: #1f2937; margin-bottom: 4px;">
                        ${pollutantIcon} Polluant: ${zone.pollutant}
                    </div>
                    <div style="font-size: 0.9em; color: #000000ff;">
                        ⚖️ Valeur réglementaire: <strong>${zone.limit || 'N/A'}</strong>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                    <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 1.5em; font-weight: 800; color: #8b5cf6;">
                            ${formatNumber(zone.population)}
                        </div>
                        <div style="font-size: 0.85em; color: #6b7280; margin-top: 4px;">
                            👥 Population exposée
                        </div>
                    </div>
                    <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 1.5em; font-weight: 800; color: #3b82f6;">
                            ${formatNumber(zone.surface)}
                        </div>
                        <div style="font-size: 0.85em; color: #6b7280; margin-top: 4px;">
                            📐 Surface (ha)
                        </div>
                    </div>
                </div>
                
                <div style="background: #f9fafb; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 0.9em; color: #6b7280;">
                        📅 Année de référence: <strong style="color: #1f2937;">${zone.year}</strong>
                    </div>
                </div>
                
                <div style="margin-top: 12px; padding: 10px; background: #fff7ed; border-radius: 6px; border: 1px solid #fed7aa;">
                    <div style="font-size: 0.85em; color: #9a3412;">
                        <strong>🔬 ID Zone:</strong> ${zone.id}
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🌡️ DASHBOARD TEMPÉRATURES - CONCOURS T'ADAVIS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function createTemperatureDashboard(temperatureData, pageIndex) {
    console.log('📊 Création du dashboard températures pour page:', pageIndex);
    
    // Tri des données par date
    const sortedData = [...temperatureData].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    // Calcul des statistiques
    const stats = calculateTemperatureStats(sortedData);
    
    // Container principal
    const container = document.createElement('div');
    container.className = 'temperature-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="temp-dashboard-header">
            <h2><i class="fas fa-temperature-high"></i> Analyse des Températures - ${sortedData[0]?.region || 'Région'}</h2>
            <p>Données météorologiques de ${sortedData.length} mesures</p>
        </div>

        <!-- STATISTIQUES GLOBALES -->
        <div class="temp-stats-global">
            <div class="temp-stat-card" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                <div class="stat-icon">🔥</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.maxTemp.toFixed(1)}°C</div>
                    <div class="stat-label">Température Max</div>
                    <div class="stat-date">${formatDate(stats.maxTempDate)}</div>
                </div>
            </div>
            
            <div class="temp-stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="stat-icon">❄️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.minTemp.toFixed(1)}°C</div>
                    <div class="stat-label">Température Min</div>
                    <div class="stat-date">${formatDate(stats.minTempDate)}</div>
                </div>
            </div>
            
            <div class="temp-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.avgTemp.toFixed(1)}°C</div>
                    <div class="stat-label">Température Moyenne</div>
                    <div class="stat-date">${sortedData.length} mesures</div>
                </div>
            </div>
            
            <div class="temp-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">📈</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.amplitude.toFixed(1)}°C</div>
                    <div class="stat-label">Amplitude</div>
                    <div class="stat-date">Écart Max-Min</div>
                </div>
            </div>
        </div>

        <!-- FILTRES -->
        <div class="temp-filters">
            <button class="filter-btn active" data-filter="all">
                <i class="fas fa-calendar"></i> Toutes les dates
            </button>
            <button class="filter-btn" data-filter="spring">
                <i class="fas fa-leaf"></i> Printemps
            </button>
            <button class="filter-btn" data-filter="summer">
                <i class="fas fa-sun"></i> Été
            </button>
            <button class="filter-btn" data-filter="autumn">
                <i class="fas fa-cloud"></i> Automne
            </button>
            <button class="filter-btn" data-filter="winter">
                <i class="fas fa-snowflake"></i> Hiver
            </button>
        </div>

        <!-- GRAPHIQUE LINÉAIRE -->
        <div class="temp-chart-wrapper">
            <h3 class="section-title">
                <i class="fas fa-chart-line"></i> Évolution des Températures
            </h3>
            <div class="temp-chart-container">
                <canvas id="tempLineChart-${pageIndex}"></canvas>
            </div>
        </div>

        <!-- GRAPHIQUE EN BARRES - COMPARAISON -->
        <div class="temp-chart-wrapper">
            <h3 class="section-title">
                <i class="fas fa-chart-bar"></i> Comparaison Min/Max/Moyenne
            </h3>
            <div class="temp-chart-container">
                <canvas id="tempBarChart-${pageIndex}"></canvas>
            </div>
        </div>

        <!-- HEATMAP PAR MOIS -->
        <div class="temp-heatmap-wrapper">
            <h3 class="section-title">
                <i class="fas fa-th"></i> Carte Thermique Mensuelle
            </h3>
             <button 
                    id="toggleTempBtnM" 
                    class="toggle-communes-btn"
                    onclick="toggleTempM(${pageIndex})">
                    👁️ Masquer
                </button>
            <div id="tempHeatmap-${pageIndex}" class="temp-heatmap"></div>
        </div>

        <!-- TABLEAU DÉTAILLÉ -->
        <div class="temp-table-wrapper">
            <h3 class="section-title">
                <i class="fas fa-table"></i> Détail des Mesures
            </h3>
            <div class="temp-search-bar">
                <input type="text" id="tempSearch-${pageIndex}" placeholder="🔍 Rechercher par date AAAA-MM-JJ..." class="temp-search-input">
            <button 
                    id="toggleTempBtn-${pageIndex}" 
                    class="toggle-communes-btn"
                    onclick="toggleTemp(${pageIndex})">
                    👁️ Masquer les températures
                </button>
                </div>
            <div class="table-scroll">
                <table class="temp-table" id="tempTable-${pageIndex}">
                    <thead>
                        <tr>
                            <th>📅 Date</th>
                            <th>❄️ T° Min (°C)</th>
                            <th>🔥 T° Max (°C)</th>
                            <th>📊 T° Moyenne (°C)</th>
                            <th>📈 Amplitude (°C)</th>
                            <th>🌡️ Indicateur</th>
                        </tr>
                    </thead>
                    <tbody id="tempTableBody-${pageIndex}">
                        ${generateTableRows(sortedData)}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ANALYSE PAR SAISON -->
        <div class="temp-season-analysis">
            <h3 class="section-title">
                <i class="fas fa-calendar-alt"></i> Analyse par Saison
            </h3>
            <div class="season-cards">
                ${generateSeasonCards(sortedData)}
            </div>
        </div>
    `;
    
    // Initialisation des graphiques après insertion dans le DOM
    setTimeout(() => {
        initTemperatureCharts(sortedData, pageIndex);
        initHeatmap(sortedData, pageIndex);
        initFilters(sortedData, pageIndex);
        initSearch(sortedData, pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * Calcul des statistiques
 */
function calculateTemperatureStats(data) {
    const temps = data.map(d => d.tmoy_degc);
    const maxTemps = data.map(d => d.tmax_degc);
    const minTemps = data.map(d => d.tmin_degc);
    
    const maxTemp = Math.max(...maxTemps);
    const minTemp = Math.min(...minTemps);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    
    const maxTempEntry = data.find(d => d.tmax_degc === maxTemp);
    const minTempEntry = data.find(d => d.tmin_degc === minTemp);
    
    return {
        maxTemp,
        minTemp,
        avgTemp,
        amplitude: maxTemp - minTemp,
        maxTempDate: maxTempEntry.date,
        minTempDate: minTempEntry.date
    };
}

/**
 * Génération des lignes du tableau
 */
function generateTableRows(data) {
    return data.map(entry => {
        const amplitude = entry.tmax_degc - entry.tmin_degc;
        const indicator = getTempIndicator(entry.tmoy_degc);
        
        return `
            <tr data-date="${entry.date}" data-season="${getSeason(entry.date)}">
                <td><strong>${formatDate(entry.date)}</strong></td>
                <td style="color: #3b82f6; font-weight: 700;">${entry.tmin_degc.toFixed(1)}</td>
                <td style="color: #ef4444; font-weight: 700;">${entry.tmax_degc.toFixed(1)}</td>
                <td style="color: #f59e0b; font-weight: 700;">${entry.tmoy_degc.toFixed(1)}</td>
                <td style="font-weight: 700;">${amplitude.toFixed(1)}</td>
                <td>${indicator}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Indicateur visuel de température
 */
function getTempIndicator(temp) {
    if (temp < 5) return '<span style="font-size: 1.5em;">🥶</span> Très Froid';
    if (temp < 10) return '<span style="font-size: 1.5em;">❄️</span> Froid';
    if (temp < 15) return '<span style="font-size: 1.5em;">🌤️</span> Frais';
    if (temp < 20) return '<span style="font-size: 1.5em;">☀️</span> Doux';
    if (temp < 25) return '<span style="font-size: 1.5em;">🌡️</span> Chaud';
    return '<span style="font-size: 1.5em;">🔥</span> Très Chaud';
}

/**
 * Déterminer la saison
 */
function getSeason(dateString) {
    const month = new Date(dateString).getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}

/**
 * Format de date lisible
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

/**
 * Génération des cartes par saison
 */
function generateSeasonCards(data) {
    const seasons = {
        spring: { name: 'Printemps', icon: '🌸', color: '#10b981', data: [] },
        summer: { name: 'Été', icon: '☀️', color: '#f59e0b', data: [] },
        autumn: { name: 'Automne', icon: '🍂', color: '#f97316', data: [] },
        winter: { name: 'Hiver', icon: '❄️', color: '#3b82f6', data: [] }
    };
    
    data.forEach(entry => {
        const season = getSeason(entry.date);
        seasons[season].data.push(entry);
    });
    
    return Object.entries(seasons).map(([key, season]) => {
        if (season.data.length === 0) return '';
        
        const avgTemp = season.data.reduce((sum, d) => sum + d.tmoy_degc, 0) / season.data.length;
        const maxTemp = Math.max(...season.data.map(d => d.tmax_degc));
        const minTemp = Math.min(...season.data.map(d => d.tmin_degc));
        
        return `
            <div class="season-card" style="border-color: ${season.color};">
                <div class="season-header" style="background: ${season.color};">
                    <span class="season-icon">${season.icon}</span>
                    <h4>${season.name}</h4>
                </div>
                <div class="season-body">
                    <div class="season-stat">
                        <span class="stat-label">Moyenne</span>
                        <span class="stat-value">${avgTemp.toFixed(1)}°C</span>
                    </div>
                    <div class="season-stat">
                        <span class="stat-label">Max</span>
                        <span class="stat-value" style="color: #ef4444;">${maxTemp.toFixed(1)}°C</span>
                    </div>
                    <div class="season-stat">
                        <span class="stat-label">Min</span>
                        <span class="stat-value" style="color: #3b82f6;">${minTemp.toFixed(1)}°C</span>
                    </div>
                    <div class="season-stat">
                        <span class="stat-label">Mesures</span>
                        <span class="stat-value">${season.data.length}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Initialisation des graphiques avec Chart.js
 */
function initTemperatureCharts(data, pageIndex) {
    // Graphique linéaire
    const lineCtx = document.getElementById(`tempLineChart-${pageIndex}`);
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: data.map(d => formatDate(d.date)),
                datasets: [
                    {
                        label: 'T° Max',
                        data: data.map(d => d.tmax_degc),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'T° Moyenne',
                        data: data.map(d => d.tmoy_degc),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'T° Min',
                        data: data.map(d => d.tmin_degc),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 14, weight: 'bold' },
                            padding: 15
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Température (°C)',
                            font: { size: 14, weight: 'bold' }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }
    
    // Graphique en barres
    const barCtx = document.getElementById(`tempBarChart-${pageIndex}`);
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: data.map(d => formatDate(d.date)),
                datasets: [
                    {
                        label: 'T° Min',
                        data: data.map(d => d.tmin_degc),
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: '#3b82f6',
                        borderWidth: 2
                    },
                    {
                        label: 'T° Max',
                        data: data.map(d => d.tmax_degc),
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: '#ef4444',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Température (°C)',
                            font: { size: 14, weight: 'bold' }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Initialisation de la heatmap
 */
function initHeatmap(data, pageIndex) {
    const container = document.getElementById(`tempHeatmap-${pageIndex}`);
    if (!container) return;
    
    // Organiser les données par mois
    const monthlyData = {};
    data.forEach(entry => {
        const date = new Date(entry.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = [];
        }
        monthlyData[monthKey].push(entry.tmoy_degc);
    });
    
    // Calculer les moyennes mensuelles
    const heatmapHTML = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, temps]) => {
            const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
            const color = getTempColor(avg);
            
            return `
                <div class="heatmap-cell" style="background: ${color};" title="${month}: ${avg.toFixed(1)}°C">
                    <div class="heatmap-month">${month}</div>
                    <div class="heatmap-value">${avg.toFixed(1)}°C</div>
                </div>
            `;
        }).join('');
    
    container.innerHTML = heatmapHTML;
}

/**
 * Couleur basée sur la température
 */
function getTempColor(temp) {
    if (temp < 5) return 'linear-gradient(135deg, #3b82f6, #2563eb)';
    if (temp < 10) return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    if (temp < 15) return 'linear-gradient(135deg, #10b981, #059669)';
    if (temp < 20) return 'linear-gradient(135deg, #84cc16, #65a30d)';
    if (temp < 25) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    return 'linear-gradient(135deg, #ef4444, #dc2626)';
}

/**
 * Initialisation des filtres
 */
function initFilters(data, pageIndex) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tableBody = document.getElementById(`tempTableBody-${pageIndex}`);
    
    window.filterButtons=filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer l'état actif de tous les boutons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (filter === 'all' || row.dataset.season === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialisation de la recherche
 */
function initSearch(data, pageIndex) {
    const searchInput = document.getElementById(`tempSearch-${pageIndex}`);
    const tableBody = document.getElementById(`tempTableBody-${pageIndex}`);
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const date = row.dataset.date.toLowerCase();
                if (date.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

window.clearMap = function(pageIndex) {
    const viewer = window.cesiumViewers[STATE.currentPage];
    if (!viewer) {
        console.error('❌ Viewer non trouvé');
        return;
    }
    
    console.log('🧹 Nettoyage de la carte...');
    
    // Supprimer toutes les entités
    viewer.entities.removeAll();
    
    // Feedback visuel
    const btn = event.target.closest('.map-control-btn');
    if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Vidé !';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    }
    
    console.log('✅ Carte vidée');
};


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
    
    console.log('📖 LIVRE RÉALISTE chargé avec MODULE QUALITÉ DE L\'EAU et ZONES DE POLLUTION CESIUM!');
    console.log('📊', CITIES_DATA.length, 'chapitres disponibles');
    console.log('💧 Module qualité de l\'eau : INTÉGRÉ ✅');
    console.log('🗺️ Module zones de pollution Cesium : INTÉGRÉ ✅');
});
