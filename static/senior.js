/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👴 DASHBOARD BIEN VIEILLIR EN CORSE - CONCOURS DATAVIS
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createSeniorsDashboard(communesData, departementData, pageIndex) {
    console.log('👴 Création du dashboard seniors pour page:', pageIndex);
    
    const stats = calculateSeniorsStats(communesData, departementData);
    
    const container = document.createElement('div');
    container.className = 'seniors-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="seniors-dashboard-header">
            <h2><i class="fas fa-heart"></i> Bien Vieillir en Corse</h2>
            <p>Qualité de vie, santé et accompagnement des seniors</p>
        </div>

        <!-- STATS GLOBALES -->
        <div class="seniors-stats-global">
            <div class="seniors-stat-card" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                <div class="stat-icon">👴</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.total60Plus.toLocaleString()}</div>
                    <div class="stat-label">Seniors 60+</div>
                    <div class="stat-detail">${stats.part60Plus}% de la population</div>
                </div>
            </div>
            
            <div class="seniors-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">🏠</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.tauxProprietaires}%</div>
                    <div class="stat-label">Propriétaires</div>
                    <div class="stat-detail">Chez les 75+</div>
                </div>
            </div>
            
            <div class="seniors-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">❤️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.aideProches}%</div>
                    <div class="stat-label">Aide des Proches</div>
                    <div class="stat-detail">Femmes 75+</div>
                </div>
            </div>
            
            <div class="seniors-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">🏥</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalAPA.toLocaleString()}</div>
                    <div class="stat-label">Bénéficiaires APA</div>
                    <div class="stat-detail">Domicile + Établissement</div>
                </div>
            </div>
        </div>

        <!-- INSIGHT BANNER -->
        <div class="insight-banner">
            <div class="insight-icon">💡</div>
            <div class="insight-text">
                <strong>Maintien à domicile :</strong> ${stats.tauxProprietaires}% des 75+ sont propriétaires. 
                ${stats.aideProches}% reçoivent l'aide de leurs proches.
            </div>
        </div>

        <!-- CARTE CESIUM -->
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-map-marked-alt"></i> Carte des Communes
                </h3>
                <div class="map-controls">
                    <button class="map-control-btn" onclick="clearSeniorsMap(${pageIndex})">
                        <i class="fas fa-eraser"></i> Vider
                    </button>
                    <button class="map-control-btn" onclick="showSeniorsOnMap(${pageIndex})">
                        <i class="fas fa-eye"></i> Afficher
                    </button>
                    <button class="toggle-section-btn" onclick="toggleSection('mapContent-${pageIndex}')">
                        <i class="fas fa-chevron-down"></i> Réduire
                    </button>
                </div>
            </div>
            <div id="mapContent-${pageIndex}" class="section-content">
                <p class="section-intro">📍 Visualisez la répartition des seniors par commune.</p>
                <div class="seniors-map-container">
                    <div id="cesiumSeniors-${pageIndex}" class="cesium-seniors-viewer"></div>
                    <div class="map-legend-seniors">
                        <h4><i class="fas fa-info-circle"></i> Légende</h4>
                        <div class="legend-items">
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #10b981;">👴</span>
                                <span>Forte densité 60+</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #f59e0b;">👵</span>
                                <span>Densité moyenne</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #ef4444;">🏥</span>
                                <span>Faible densité</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION DÉMOGRAPHIE -->
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-users"></i> Démographie des Seniors
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('demoContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="demoContent-${pageIndex}" class="section-content">
                <p class="section-intro">👥 ${stats.total60Plus.toLocaleString()} seniors de 60 ans et plus en Corse.</p>
                ${generateDemographieSection(communesData, departementData, pageIndex)}
            </div>
        </div>

        <!-- SECTION LOGEMENT -->
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-home"></i> Logement & Habitat
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('logementContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="logementContent-${pageIndex}" class="section-content">
                <p class="section-intro">🏠 ${stats.tauxProprietaires}% des 75+ sont propriétaires de leur logement.</p>
                ${generateLogementSection(communesData, departementData, pageIndex)}
            </div>
        </div>

        <!-- SECTION ISOLEMENT -->
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-user"></i> Isolement & Vie Sociale
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('isolementContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="isolementContent-${pageIndex}" class="section-content">
                <p class="section-intro">👤 Situation des seniors vivant seuls et isolement géographique.</p>
                ${generateIsolementSection(communesData, departementData, pageIndex)}
            </div>
        </div>

        <!-- SECTION SANTÉ -->
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-heartbeat"></i> Santé & Autonomie
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('santeContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="santeContent-${pageIndex}" class="section-content">
                <p class="section-intro">⚕️ État de santé et limitations fonctionnelles des 75+.</p>
                ${generateSanteSection(departementData, pageIndex)}
            </div>
        </div>

        <!-- SECTION ACCOMPAGNEMENT -->
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-hands-helping"></i> Accompagnement & Aides
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('aideContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="aideContent-${pageIndex}" class="section-content">
                <p class="section-intro">🤝 Aides professionnelles, proches et APA.</p>
                ${generateAccompagnementSection(departementData, pageIndex)}
            </div>
        </div>

        <!-- GRAPHIQUES -->
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-chart-bar"></i> Analyses Statistiques
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsContent-${pageIndex}" class="section-content">
                <div class="charts-grid">
                    <div class="chart-wrapper">
                        <h4>Répartition par Âge</h4>
                        <canvas id="chartAge-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Statut d'Occupation 75+</h4>
                        <canvas id="chartLogement-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Limitations Fonctionnelles</h4>
                        <canvas id="chartLimitations-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Aides Reçues</h4>
                        <canvas id="chartAides-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        storeSeniorsData(communesData, departementData, pageIndex);
        initSeniorsCharts(communesData, departementData, pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CALCUL DES STATS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateSeniorsStats(communes, departement) {
    let total60Plus = 0;
    let total75Plus = 0;
    let totalPop = 0;
    let totalProprietaires75 = 0;
    let totalAPA = 0;
    
    // Agrégation communes
    communes.forEach(c => {
        total60Plus += c.pop_60ansetplus || 0;
        total75Plus += c.population_75_ans_et_plus || 0;
        totalPop += c.population_totale || 0;
        totalProprietaires75 += c.x75_ans_et_plus_proprietaires || 0;
    });
    
    // Données départementales
    if (departement && departement.length > 0) {
        departement.forEach(d => {
            totalAPA += (d.apa_dom_75_et_plus || 0) + (d.apa_etab_h_dot_75_et_plus || 0);
        });
    }
    
    const tauxProprietaires = total75Plus > 0 ? ((totalProprietaires75 / total75Plus) * 100).toFixed(1) : 0;
    const part60Plus = totalPop > 0 ? ((total60Plus / totalPop) * 100).toFixed(1) : 0;
    
    // Aide des proches (moyenne des départements)
    let aideProches = 0;
    if (departement && departement.length > 0) {
        aideProches = departement.reduce((sum, d) => sum + (d.vqs_f_75_aide_proches_oui_p || 0), 0) / departement.length;
        aideProches = aideProches.toFixed(1);
    }
    
    return {
        total60Plus,
        total75Plus,
        part60Plus,
        tauxProprietaires,
        aideProches,
        totalAPA
    };
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗺️ GESTION CESIUM
 * ════════════════════════════════════════════════════════════════════════════════
 */

if (!window.seniorsDataStore) window.seniorsDataStore = {};

function storeSeniorsData(communes, departement, pageIndex) {
    window.seniorsDataStore[pageIndex] = { communes, departement };
}

window.showSeniorsOnMap = function(pageIndex) {
    const viewer = window.cesiumViewers[pageIndex];
    const data = window.seniorsDataStore[pageIndex];
    
    if (!viewer || !data) {
        console.error('❌ Viewer ou données non disponibles');
        return;
    }
    
    console.log('📍 Affichage des communes...');
    viewer.entities.removeAll();
    
    const { communes } = data;
    let count = 0;
    
    communes.forEach(commune => {
        if (commune.centroid?.lat && commune.centroid?.lon && commune.pop_60ansetplus > 0) {
            const pop60 = commune.pop_60ansetplus || 0;
            const color = getSeniorsColor(pop60);
            
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(commune.centroid.lon, commune.centroid.lat),
                billboard: {
                    image: createSeniorsMarker(getSeniorsIcon(pop60), color),
                    scale: 0.6,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                description: createCommuneDescription(commune)
            });
            count++;
        }
    });
    
    // Feedback
    const btn = event?.target?.closest('.map-control-btn');
    if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check"></i> ${count} affichés !`;
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    }
    
    console.log(`✅ ${count} communes affichées`);
};

window.clearSeniorsMap = function(pageIndex) {
    const viewer = window.cesiumViewers[`seniors-${pageIndex}`];
    if (!viewer) return;
    
    viewer.entities.removeAll();
    
    const btn = event?.target?.closest('.map-control-btn');
    if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Vidé !';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    }
};

function getSeniorsColor(pop60) {
    if (pop60 > 200) return '#10b981';
    if (pop60 > 50) return '#f59e0b';
    return '#ef4444';
}

function getSeniorsIcon(pop60) {
    if (pop60 > 200) return '👴';
    if (pop60 > 50) return '👵';
    return '🏥';
}

function createSeniorsMarker(emoji, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(24, 20, 20, 0, Math.PI * 2);
    ctx.moveTo(24, 40);
    ctx.lineTo(14, 56);
    ctx.quadraticCurveTo(24, 64, 34, 56);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 24, 20);
    
    return canvas.toDataURL();
}

function createCommuneDescription(commune) {
    return `
        <div style="font-family: 'Space Grotesk', sans-serif; padding: 15px;">
            <h3 style="margin: 0 0 10px 0;">${commune.com_arm_name}</h3>
            <p><strong>👴 60+ ans :</strong> ${commune.pop_60ansetplus || 0}</p>
            <p><strong>👵 75+ ans :</strong> ${commune.population_75_ans_et_plus || 0}</p>
            <p><strong>👥 Population totale :</strong> ${commune.population_totale || 0}</p>
            ${commune.x75_ans_et_plus_isoles ? `<p><strong>👤 Isolés 75+ :</strong> ${commune.x75_ans_et_plus_isoles}</p>` : ''}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👥 SECTION DÉMOGRAPHIE
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateDemographieSection(communes, departement, pageIndex) {
    // Calculer totaux
    let total60_74 = 0;
    let total75Plus = 0;
    let totalPop = 0;
    
    communes.forEach(c => {
        total60_74 += c.population_6074_ans || 0;
        total75Plus += c.population_75_ans_et_plus || 0;
        totalPop += c.population_totale || 0;
    });
    
    const total60Plus = total60_74 + total75Plus;
    
    return `
        <div class="demo-cards">
            <div class="demo-card">
                <div class="demo-icon">👥</div>
                <div class="demo-value">${total60Plus.toLocaleString()}</div>
                <div class="demo-label">Seniors 60+</div>
                <div class="demo-detail">${((total60Plus / totalPop) * 100).toFixed(1)}% de la population</div>
            </div>
            
            <div class="demo-card">
                <div class="demo-icon">👴</div>
                <div class="demo-value">${total60_74.toLocaleString()}</div>
                <div class="demo-label">60-74 ans</div>
                <div class="demo-detail">${((total60_74 / total60Plus) * 100).toFixed(1)}% des seniors</div>
            </div>
            
            <div class="demo-card">
                <div class="demo-icon">👵</div>
                <div class="demo-value">${total75Plus.toLocaleString()}</div>
                <div class="demo-label">75 ans et +</div>
                <div class="demo-detail">${((total75Plus / total60Plus) * 100).toFixed(1)}% des seniors</div>
            </div>
        </div>
        
        <div class="demo-insight">
            <div class="insight-icon">📊</div>
            <div class="insight-content">
                <h4>Répartition par département</h4>
                ${departement ? departement.map(d => `
                    <div class="dept-row">
                        <span class="dept-name">${d.dep_name_upper}</span>
                        <span class="dept-value">${(d.population_75_ans_et_plus || 0).toLocaleString()} seniors 75+</span>
                    </div>
                `).join('') : '<p>Données départementales non disponibles</p>'}
            </div>
        </div>
        
        <div class="communes-top">
            <h4><i class="fas fa-star"></i> Communes avec le plus de seniors 60+</h4>
            <div class="communes-list">
                ${communes
                    .sort((a, b) => (b.pop_60ansetplus || 0) - (a.pop_60ansetplus || 0))
                    .slice(0, 10)
                    .map((c, index) => `
                        <div class="commune-item" style="animation-delay: ${index * 0.05}s;">
                            <span class="commune-rank">${index + 1}</span>
                            <span class="commune-name">${c.com_arm_name}</span>
                            <span class="commune-value">${c.pop_60ansetplus || 0} seniors</span>
                        </div>
                    `).join('')}
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏠 SECTION LOGEMENT
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateLogementSection(communes, departement, pageIndex) {
    // Agrégation
    let proprietaires75 = 0;
    let locPrive75 = 0;
    let locSocial75 = 0;
    let maison75 = 0;
    let appartAsc75 = 0;
    let appartSansAsc75 = 0;
    let total75 = 0;
    
    communes.forEach(c => {
        proprietaires75 += c.x75_ans_et_plus_proprietaires || 0;
        locPrive75 += c.x75_ans_et_plus_loc_parc_prive || 0;
        locSocial75 += c.x75_ans_et_plus_loc_parc_social || 0;
        maison75 += c.x75_ans_et_plus_en_maison || 0;
        appartAsc75 += c.x75_ans_et_plus_appart_av_asc || 0;
        appartSansAsc75 += c.x75_ans_et_plus_appart_ss_asc || 0;
        total75 += c.population_75_ans_et_plus || 0;
    });
    
    const tauxProprio = total75 > 0 ? ((proprietaires75 / total75) * 100).toFixed(1) : 0;
    const tauxMaison = total75 > 0 ? ((maison75 / total75) * 100).toFixed(1) : 0;
    
    return `
        <div class="logement-highlight">
            <div class="highlight-icon">🏠</div>
            <div class="highlight-content">
                <h3>Statut d'Occupation des 75+</h3>
                <div class="logement-stats-row">
                    <div class="logement-stat-item">
                        <span class="logement-stat-value">${tauxProprio}%</span>
                        <span class="logement-stat-label">Propriétaires</span>
                    </div>
                    <div class="logement-stat-item">
                        <span class="logement-stat-value">${tauxMaison}%</span>
                        <span class="logement-stat-label">En Maison</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="logement-grid">
            <div class="logement-card">
                <div class="logement-card-header">
                    <i class="fas fa-home"></i>
                    <h4>Propriétaires</h4>
                </div>
                <div class="logement-card-body">
                    <div class="logement-value">${proprietaires75.toLocaleString()}</div>
                    <div class="logement-percent">${tauxProprio}%</div>
                    <div class="logement-detail">des 75+ sont propriétaires</div>
                </div>
            </div>
            
            <div class="logement-card">
                <div class="logement-card-header">
                    <i class="fas fa-building"></i>
                    <h4>Locataires Privé</h4>
                </div>
                <div class="logement-card-body">
                    <div class="logement-value">${locPrive75.toLocaleString()}</div>
                    <div class="logement-percent">${total75 > 0 ? ((locPrive75 / total75) * 100).toFixed(1) : 0}%</div>
                    <div class="logement-detail">des 75+ sont locataires</div>
                </div>
            </div>
            
            <div class="logement-card">
                <div class="logement-card-header">
                    <i class="fas fa-city"></i>
                    <h4>Logement Social</h4>
                </div>
                <div class="logement-card-body">
                    <div class="logement-value">${locSocial75.toLocaleString()}</div>
                    <div class="logement-percent">${total75 > 0 ? ((locSocial75 / total75) * 100).toFixed(1) : 0}%</div>
                    <div class="logement-detail">des 75+ en HLM</div>
                </div>
            </div>
        </div>
        
        <div class="logement-type-section">
            <h4><i class="fas fa-warehouse"></i> Type de Logement</h4>
            <div class="logement-type-bars">
                <div class="type-bar-item">
                    <div class="type-bar-label">🏡 Maison</div>
                    <div class="type-bar-container">
                        <div class="type-bar-fill" style="width: ${tauxMaison}%; background: #10b981;">
                            ${maison75.toLocaleString()} (${tauxMaison}%)
                        </div>
                    </div>
                </div>
                <div class="type-bar-item">
                    <div class="type-bar-label">🏢 Appart. avec ascenseur</div>
                    <div class="type-bar-container">
                        <div class="type-bar-fill" style="width: ${total75 > 0 ? ((appartAsc75 / total75) * 100).toFixed(1) : 0}%; background: #3b82f6;">
                            ${appartAsc75.toLocaleString()} (${total75 > 0 ? ((appartAsc75 / total75) * 100).toFixed(1) : 0}%)
                        </div>
                    </div>
                </div>
                <div class="type-bar-item">
                    <div class="type-bar-label">🏘️ Appart. sans ascenseur</div>
                    <div class="type-bar-container">
                        <div class="type-bar-fill" style="width: ${total75 > 0 ? ((appartSansAsc75 / total75) * 100).toFixed(1) : 0}%; background: #f59e0b;">
                            ${appartSansAsc75.toLocaleString()} (${total75 > 0 ? ((appartSansAsc75 / total75) * 100).toFixed(1) : 0}%)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👤 SECTION ISOLEMENT
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateIsolementSection(communes, departement, pageIndex) {
    let isoles75 = 0;
    let total75 = 0;
    let femmesIsolees75 = 0;
    let sansVoiture75 = 0;
    
    communes.forEach(c => {
        isoles75 += c.x75_ans_et_plus_isoles || 0;
        total75 += c.population_75_ans_et_plus || 0;
        femmesIsolees75 += c.femmes_75_ans_et_plus_isolees || 0;
        sansVoiture75 += c.x75_ans_et_plus_sans_voiture || 0;
    });
    
    const tauxIsoles = total75 > 0 ? ((isoles75 / total75) * 100).toFixed(1) : 0;
    const tauxSansVoiture = total75 > 0 ? ((sansVoiture75 / total75) * 100).toFixed(1) : 0;
    
    return `
        <div class="isolement-alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
                <h3>${tauxIsoles}% des 75+ vivent seuls</h3>
                <p>Dont ${femmesIsolees75.toLocaleString()} femmes (${isoles75 > 0 ? ((femmesIsolees75 / isoles75) * 100).toFixed(1) : 0}%)</p>
            </div>
        </div>
        
        <div class="isolement-cards">
            <div class="isolement-card">
                <div class="isolement-icon">👤</div>
                <div class="isolement-value">${isoles75.toLocaleString()}</div>
                <div class="isolement-label">Personnes Seules</div>
                <div class="isolement-percent">${tauxIsoles}% des 75+</div>
            </div>
            
            <div class="isolement-card">
                <div class="isolement-icon">👩</div>
                <div class="isolement-value">${femmesIsolees75.toLocaleString()}</div>
                <div class="isolement-label">Femmes Seules</div>
                <div class="isolement-percent">${isoles75 > 0 ? ((femmesIsolees75 / isoles75) * 100).toFixed(1) : 0}% des isolés</div>
            </div>
            
            <div class="isolement-card">
                <div class="isolement-icon">🚗</div>
                <div class="isolement-value">${sansVoiture75.toLocaleString()}</div>
                <div class="isolement-label">Sans Voiture</div>
                <div class="isolement-percent">${tauxSansVoiture}% des 75+</div>
            </div>
        </div>
        
        <div class="isolement-insight">
            <div class="insight-icon">💡</div>
            <div class="insight-text">
                <strong>Mobilité réduite :</strong> ${tauxSansVoiture}% des 75+ n'ont pas de voiture, 
                augmentant le risque d'isolement dans les zones rurales.
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ⚕️ SECTION SANTÉ
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateSanteSection(departement, pageIndex) {
    if (!departement || departement.length === 0) {
        return '<p>Aucune donnée de santé disponible.</p>';
    }
    
    const dept = departement[0]; // Prendre le premier département
    
    return `
        <div class="sante-overview">
            <h4><i class="fas fa-notes-medical"></i> État de Santé Perçu (75+)</h4>
            <div class="sante-etat-grid">
                <div class="sante-etat-card bon">
                    <div class="sante-etat-icon">😊</div>
                    <div class="sante-etat-label">Bon / Très bon</div>
                    <div class="sante-etat-values">
                        <span>👩 ${dept.vqs_f_75_assezbon_p}%</span>
                        <span>👨 ${dept.vqs_h_75_assezbon_p}%</span>
                    </div>
                </div>
                <div class="sante-etat-card mauvais">
                    <div class="sante-etat-icon">😟</div>
                    <div class="sante-etat-label">Mauvais / Très mauvais</div>
                    <div class="sante-etat-values">
                        <span>👩 ${dept.vqs_f_75_mauvaisoutrmauvais_p}%</span>
                        <span>👨 ${dept.vqs_h_75_mauvaisoutrmauvais_p}%</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="sante-limitations">
            <h4><i class="fas fa-wheelchair"></i> Limitations Fonctionnelles</h4>
            <div class="limitations-grid">
                <div class="limitation-item">
                    <div class="limitation-header">
                        <span class="limitation-icon">🚶</span>
                        <span class="limitation-title">Monter escaliers</span>
                    </div>
                    <div class="limitation-bars">
                        <div class="limitation-bar femme">
                            <span class="limitation-label">Femmes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_f_75_monter_esc_oui_p}%;">
                                ${dept.vqs_f_75_monter_esc_oui_p}%
                            </div>
                        </div>
                        <div class="limitation-bar homme">
                            <span class="limitation-label">Hommes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_h_75_monter_esc_oui_p}%;">
                                ${dept.vqs_h_75_monter_esc_oui_p}%
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="limitation-item">
                    <div class="limitation-header">
                        <span class="limitation-icon">👂</span>
                        <span class="limitation-title">Entendre</span>
                    </div>
                    <div class="limitation-bars">
                        <div class="limitation-bar femme">
                            <span class="limitation-label">Femmes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_f_75_entendr_oui_p}%;">
                                ${dept.vqs_f_75_entendr_oui_p}%
                            </div>
                        </div>
                        <div class="limitation-bar homme">
                            <span class="limitation-label">Hommes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_h_75_entendr_oui_p}%;">
                                ${dept.vqs_h_75_entendr_oui_p}%
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="limitation-item">
                    <div class="limitation-header">
                        <span class="limitation-icon">👁️</span>
                        <span class="limitation-title">Voir</span>
                    </div>
                    <div class="limitation-bars">
                        <div class="limitation-bar femme">
                            <span class="limitation-label">Femmes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_f_75_voir_oui_p}%;">
                                ${dept.vqs_f_75_voir_oui_p}%
                            </div>
                        </div>
                        <div class="limitation-bar homme">
                            <span class="limitation-label">Hommes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_h_75_voir_oui_p}%;">
                                ${dept.vqs_h_75_voir_oui_p}%
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="limitation-item">
                    <div class="limitation-header">
                        <span class="limitation-icon">🧠</span>
                        <span class="limitation-title">Se souvenir</span>
                    </div>
                    <div class="limitation-bars">
                        <div class="limitation-bar femme">
                            <span class="limitation-label">Femmes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_f_75_souvenir_oui_p}%;">
                                ${dept.vqs_f_75_souvenir_oui_p}%
                            </div>
                        </div>
                        <div class="limitation-bar homme">
                            <span class="limitation-label">Hommes</span>
                            <div class="limitation-bar-fill" style="width: ${dept.vqs_h_75_souvenir_oui_p}%;">
                                ${dept.vqs_h_75_souvenir_oui_p}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="sante-maladies">
            <h4><i class="fas fa-pills"></i> Maladies Chroniques</h4>
            <div class="maladies-stats">
                <div class="maladie-stat">
                    <span class="maladie-label">Femmes 75+</span>
                    <span class="maladie-value">${dept.vqs_f_75_chronique_oui_p}%</span>
                </div>
                <div class="maladie-stat">
                    <span class="maladie-label">Hommes 75+</span>
                    <span class="maladie-value">${dept.vqs_h_75_chronique_oui_p}%</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🤝 SECTION ACCOMPAGNEMENT
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateAccompagnementSection(departement, pageIndex) {
    if (!departement || departement.length === 0) {
        return '<p>Aucune donnée d\'accompagnement disponible.</p>';
    }
    
    const dept = departement[0];
    const totalAPA = (dept.apa_dom_75_et_plus || 0) + (dept.apa_etab_h_dot_75_et_plus || 0);
    
    return `
        <div class="apa-highlight">
            <div class="apa-icon">🏥</div>
            <div class="apa-content">
                <h3>Allocation Personnalisée d'Autonomie (APA)</h3>
                <div class="apa-total">${totalAPA.toLocaleString()}</div>
                <p>Bénéficiaires 75+ dans le département</p>
            </div>
        </div>
        
        <div class="apa-repartition">
            <div class="apa-card">
                <div class="apa-card-icon">🏠</div>
                <div class="apa-card-body">
                    <h4>APA à Domicile</h4>
                    <div class="apa-card-value">${(dept.apa_dom_75_et_plus || 0).toLocaleString()}</div>
                    <div class="apa-card-percent">${totalAPA > 0 ? ((dept.apa_dom_75_et_plus / totalAPA) * 100).toFixed(1) : 0}%</div>
                </div>
            </div>
            
            <div class="apa-card">
                <div class="apa-card-icon">🏥</div>
                <div class="apa-card-body">
                    <h4>APA en Établissement</h4>
                    <div class="apa-card-value">${(dept.apa_etab_h_dot_75_et_plus || 0).toLocaleString()}</div>
                    <div class="apa-card-percent">${totalAPA > 0 ? ((dept.apa_etab_h_dot_75_et_plus / totalAPA) * 100).toFixed(1) : 0}%</div>
                </div>
            </div>
        </div>
        
        <div class="aides-section">
            <h4><i class="fas fa-hands-helping"></i> Aides Reçues par les 75+</h4>
            <div class="aides-grid">
                <div class="aide-card">
                    <div class="aide-header">
                        <i class="fas fa-users"></i>
                        <h5>Aide des Proches</h5>
                    </div>
                    <div class="aide-stats">
                        <div class="aide-stat femme">
                            <span class="aide-label">👩 Femmes</span>
                            <span class="aide-value">${dept.vqs_f_75_aide_proches_oui_p}%</span>
                        </div>
                        <div class="aide-stat homme">
                            <span class="aide-label">👨 Hommes</span>
                            <span class="aide-value">${dept.vqs_h_75_aide_proches_oui_p}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="aide-card">
                    <div class="aide-header">
                        <i class="fas fa-user-nurse"></i>
                        <h5>Aide Professionnelle</h5>
                    </div>
                    <div class="aide-stats">
                        <div class="aide-stat femme">
                            <span class="aide-label">👩 Femmes</span>
                            <span class="aide-value">${dept.vqs_f_75_aide_profs_oui_p}%</span>
                        </div>
                        <div class="aide-stat homme">
                            <span class="aide-label">👨 Hommes</span>
                            <span class="aide-value">${dept.vqs_h_75_aide_profs_oui_p}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="aide-card">
                    <div class="aide-header">
                        <i class="fas fa-home"></i>
                        <h5>Aménagement Logement</h5>
                    </div>
                    <div class="aide-stats">
                        <div class="aide-stat femme">
                            <span class="aide-label">👩 Femmes</span>
                            <span class="aide-value">${dept.vqs_f_75_amenag_oui_p}%</span>
                        </div>
                        <div class="aide-stat homme">
                            <span class="aide-label">👨 Hommes</span>
                            <span class="aide-value">${dept.vqs_h_75_amenag_oui_p}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="aide-card">
                    <div class="aide-header">
                        <i class="fas fa-cogs"></i>
                        <h5>Aide Technique</h5>
                    </div>
                    <div class="aide-stats">
                        <div class="aide-stat femme">
                            <span class="aide-label">👩 Femmes</span>
                            <span class="aide-value">${dept.vqs_f_75_technique_oui_p}%</span>
                        </div>
                        <div class="aide-stat homme">
                            <span class="aide-label">👨 Hommes</span>
                            <span class="aide-value">${dept.vqs_h_75_technique_oui_p}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 GRAPHIQUES CHART.JS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function initSeniorsCharts(communes, departement, pageIndex) {
    // 1. Répartition par âge
    const ageCtx = document.getElementById(`chartAge-${pageIndex}`);
    if (ageCtx) {
        let total60_74 = 0;
        let total75 = 0;
        
        communes.forEach(c => {
            total60_74 += c.population_6074_ans || 0;
            total75 += c.population_75_ans_et_plus || 0;
        });
        
        new Chart(ageCtx, {
            type: 'doughnut',
            data: {
                labels: ['60-74 ans', '75 ans et +'],
                datasets: [{
                    data: [total60_74, total75],
                    backgroundColor: ['#f59e0b', '#ec4899'],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
    
    // 2. Statut d'occupation
    const logementCtx = document.getElementById(`chartLogement-${pageIndex}`);
    if (logementCtx) {
        let proprio = 0;
        let locPrive = 0;
        let locSocial = 0;
        
        communes.forEach(c => {
            proprio += c.x75_ans_et_plus_proprietaires || 0;
            locPrive += c.x75_ans_et_plus_loc_parc_prive || 0;
            locSocial += c.x75_ans_et_plus_loc_parc_social || 0;
        });
        
        new Chart(logementCtx, {
            type: 'pie',
            data: {
                labels: ['Propriétaires', 'Locataires privé', 'Logement social'],
                datasets: [{
                    data: [proprio, locPrive, locSocial],
                    backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6'],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
    
    // 3. Limitations fonctionnelles
    const limitationsCtx = document.getElementById(`chartLimitations-${pageIndex}`);
    if (limitationsCtx && departement && departement.length > 0) {
        const dept = departement[0];
        
        new Chart(limitationsCtx, {
            type: 'bar',
            data: {
                labels: ['Monter escaliers', 'Entendre', 'Voir', 'Se souvenir'],
                datasets: [
                    {
                        label: 'Femmes',
                        data: [
                            dept.vqs_f_75_monter_esc_oui_p,
                            dept.vqs_f_75_entendr_oui_p,
                            dept.vqs_f_75_voir_oui_p,
                            dept.vqs_f_75_souvenir_oui_p
                        ],
                        backgroundColor: '#ec4899'
                    },
                    {
                        label: 'Hommes',
                        data: [
                            dept.vqs_h_75_monter_esc_oui_p,
                            dept.vqs_h_75_entendr_oui_p,
                            dept.vqs_h_75_voir_oui_p,
                            dept.vqs_h_75_souvenir_oui_p
                        ],
                        backgroundColor: '#3b82f6'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }
    
    // 4. Aides reçues
    const aidesCtx = document.getElementById(`chartAides-${pageIndex}`);
    if (aidesCtx && departement && departement.length > 0) {
        const dept = departement[0];
        
        new Chart(aidesCtx, {
            type: 'radar',
            data: {
                labels: ['Proches', 'Professionnelle', 'Aménagement', 'Technique'],
                datasets: [
                    {
                        label: 'Femmes',
                        data: [
                            dept.vqs_f_75_aide_proches_oui_p,
                            dept.vqs_f_75_aide_profs_oui_p,
                            dept.vqs_f_75_amenag_oui_p,
                            dept.vqs_f_75_technique_oui_p
                        ],
                        backgroundColor: 'rgba(236, 72, 153, 0.2)',
                        borderColor: '#ec4899',
                        borderWidth: 2
                    },
                    {
                        label: 'Hommes',
                        data: [
                            dept.vqs_h_75_aide_proches_oui_p,
                            dept.vqs_h_75_aide_profs_oui_p,
                            dept.vqs_h_75_amenag_oui_p,
                            dept.vqs_h_75_technique_oui_p
                        ],
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: '#3b82f6',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}