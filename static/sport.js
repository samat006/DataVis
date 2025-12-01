/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ⚽ DASHBOARD SPORT & INFRASTRUCTURES 
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createSportDashboard(terrainsSportifs, pageIndex) {
    console.log('⚽ Création du dashboard sport pour page:', pageIndex);
    
    const stats = calculateSportStats(terrainsSportifs);
    
    const container = document.createElement('div');
    container.className = 'sport-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="sport-dashboard-header">
            <h2><i class="fas fa-futbol"></i> Sport & Infrastructures en Corse</h2>
            <p>Équipements sportifs et territoires de pratique</p>
        </div>

        <!-- STATS GLOBALES -->
        <div class="sport-stats-global">
            <div class="sport-stat-card" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                <div class="stat-icon">⚽</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalTerrains}</div>
                    <div class="stat-label">Terrains Sportifs</div>
                    <div class="stat-detail">Sur tout le territoire</div>
                </div>
            </div>
            
            <div class="sport-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.enService}</div>
                    <div class="stat-label">En Service</div>
                    <div class="stat-detail">${stats.tauxService}% actifs</div>
                </div>
            </div>
            
            <div class="sport-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">🏟️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.typesTerrains}</div>
                    <div class="stat-label">Types de Terrains</div>
                    <div class="stat-detail">Variété des équipements</div>
                </div>
            </div>
            
            <div class="sport-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">🏘️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.communesCouvertes}</div>
                    <div class="stat-label">Communes Équipées</div>
                    <div class="stat-detail">Maillage territorial</div>
                </div>
            </div>
        </div>

        <!-- INSIGHT BANNER -->
        <div class="insight-banner">
            <div class="insight-icon">💡</div>
            <div class="insight-text">
                <strong>Réseau dense :</strong> ${stats.totalTerrains} équipements répartis sur ${stats.communesCouvertes} communes. 
                ${stats.tauxService}% des terrains sont en service.
            </div>
        </div>

        <!-- CARTE CESIUM -->
        <div class="sport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-map-marked-alt"></i> Carte Interactive des Terrains
                </h3>
                <div class="map-controls">
                    <button class="map-control-btn" onclick="clearSportMap(${pageIndex})">
                        <i class="fas fa-eraser"></i> Vider
                    </button>
                    <button class="map-control-btn" onclick="showSportOnMap(${pageIndex})">
                        <i class="fas fa-eye"></i> Afficher
                    </button>
                    <button class="toggle-section-btn" onclick="toggleSection('mapContent-${pageIndex}')">
                        <i class="fas fa-chevron-down"></i> Réduire
                    </button>
                </div>
            </div>
            <div id="mapContent-${pageIndex}" class="section-content">
                <p class="section-intro">🗺️ Visualisez l'emplacement de tous les terrains sportifs en 3D.</p>
                <div class="sport-map-container">
                    <div id="cesiumSport-${pageIndex}" class="cesium-sport-viewer"></div>
                    <div class="map-legend-sport">
                        <h4><i class="fas fa-info-circle"></i> Légende</h4>
                        <div class="legend-items">
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #06b6d4;">⚽</span>
                                <span>Terrain de foot</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #f59e0b;">🏀</span>
                                <span>Terrain de basket</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #10b981;">🎾</span>
                                <span>Court de tennis</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #8b5cf6;">🏐</span>
                                <span>Multi-sports</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION TYPES DE TERRAINS -->
        <div class="sport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-running"></i> Types d'Équipements
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('typesContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="typesContent-${pageIndex}" class="section-content">
                <p class="section-intro">🏟️ ${stats.typesTerrains} types d'équipements sportifs différents.</p>
                ${generateTypesSection(terrainsSportifs, pageIndex)}
            </div>
        </div>

        <!-- SECTION PAR COMMUNE -->
        <div class="sport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-map-marker-alt"></i> Répartition par Commune
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('communesContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="communesContent-${pageIndex}" class="section-content">
                <p class="section-intro">📍 Top des communes les mieux équipées en infrastructures sportives.</p>
                ${generateCommunesSection(terrainsSportifs, pageIndex)}
            </div>
        </div>

        <!-- SECTION ÉTAT DES TERRAINS -->
        <div class="sport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-clipboard-check"></i> État des Infrastructures
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('etatContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="etatContent-${pageIndex}" class="section-content">
                <p class="section-intro">✅ Suivi de l'état et de la disponibilité des équipements.</p>
                ${generateEtatSection(terrainsSportifs, pageIndex)}
            </div>
        </div>

        <!-- GRAPHIQUES -->
        <div class="sport-section">
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
                        <h4>Types de Terrains</h4>
                        <canvas id="chartTypes-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>État des Équipements</h4>
                        <canvas id="chartEtat-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Top 10 Communes</h4>
                        <canvas id="chartCommunes-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Répartition 2A / 2B</h4>
                        <canvas id="chartDept-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        storeSportData(terrainsSportifs, pageIndex);
        initSportCharts(terrainsSportifs, pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CALCUL DES STATS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateSportStats(terrains) {
    const totalTerrains = terrains.length;
    const enService = terrains.filter(t => t.etat === 'En service').length;
    const tauxService = totalTerrains > 0 ? ((enService / totalTerrains) * 100).toFixed(1) : 0;
    
    // Types uniques
    const types = new Set(terrains.map(t => t.nature).filter(n => n));
    const typesTerrains = types.size;
    
    // Communes uniques
    const communes = new Set(terrains.map(t => t.commune).filter(c => c));
    const communesCouvertes = communes.size;
    
    return {
        totalTerrains,
        enService,
        tauxService,
        typesTerrains,
        communesCouvertes
    };
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗺️ GESTION CESIUM
 * ════════════════════════════════════════════════════════════════════════════════
 */

if (!window.sportDataStore) window.sportDataStore = {};

function storeSportData(terrains, pageIndex) {
    window.sportDataStore[pageIndex] = { terrains };
}

window.showSportOnMap = function(pageIndex) {
    const viewer = window.cesiumViewers[pageIndex];
    const data = window.sportDataStore[pageIndex];
    
    if (!viewer || !data) {
        console.error('❌ Viewer ou données non disponibles');
        return;
    }
    
    console.log('🗺️ Affichage des terrains sportifs...');
    viewer.entities.removeAll();
    
    const { terrains } = data;
    let count = 0;
    
    terrains.forEach(terrain => {
        if (terrain.geo_point_2d?.lat && terrain.geo_point_2d?.lon) {
            const color = getSportColor(terrain.nature);
            const icon = getSportIcon(terrain.nature);
            
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(
                    terrain.geo_point_2d.lon,
                    terrain.geo_point_2d.lat
                ),
                billboard: {
                    image: createSportMarker(icon, color),
                    scale: 0.6,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                description: createTerrainDescription(terrain)
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
    
    console.log(`✅ ${count} terrains affichés`);
};

window.clearSportMap = function(pageIndex) {
    const viewer = window.cesiumViewers[`sport-${pageIndex}`];
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

function getSportColor(nature) {
    if (!nature) return '#6b7280';
    const n = nature.toLowerCase();
    if (n.includes('foot') || n.includes('football')) return '#06b6d4';
    if (n.includes('basket')) return '#f59e0b';
    if (n.includes('tennis')) return '#10b981';
    if (n.includes('multi')) return '#8b5cf6';
    if (n.includes('athlé')) return '#ef4444';
    return '#6b7280';
}

function getSportIcon(nature) {
    if (!nature) return '🏟️';
    const n = nature.toLowerCase();
    if (n.includes('foot') || n.includes('football')) return '⚽';
    if (n.includes('basket')) return '🏀';
    if (n.includes('tennis')) return '🎾';
    if (n.includes('multi')) return '🏐';
    if (n.includes('athlé')) return '🏃';
    return '🏟️';
}

function createSportMarker(emoji, color) {
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

function createTerrainDescription(terrain) {
    return `
        <div style="font-family: 'Space Grotesk', sans-serif; padding: 15px;">
            <h3 style="margin: 0 0 10px 0;">${terrain.nature || 'Terrain sportif'}</h3>
            <p><strong>📍 Commune :</strong> ${terrain.commune}</p>
            <p><strong>✅ État :</strong> ${terrain.etat}</p>
            ${terrain.epci ? `<p><strong>🏛️ EPCI :</strong> ${terrain.epci}</p>` : ''}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏟️ SECTION TYPES DE TERRAINS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateTypesSection(terrains, pageIndex) {
    // Agréger par type
    const parType = {};
    terrains.forEach(t => {
        const type = t.nature || 'Non spécifié';
        parType[type] = (parType[type] || 0) + 1;
    });
    
    const types = Object.entries(parType)
        .map(([nom, count]) => ({ nom, count }))
        .sort((a, b) => b.count - a.count);
    
    return `
        <div class="types-grid">
            ${types.map((type, index) => {
                const icon = getSportIcon(type.nom);
                const color = getSportColor(type.nom);
                
                return `
                    <div class="type-card" style="animation-delay: ${index * 0.05}s;">
                        <div class="type-card-header" style="background: ${color};">
                            <span class="type-icon">${icon}</span>
                            <span class="type-count">${type.count}</span>
                        </div>
                        <div class="type-card-body">
                            <h4>${type.nom}</h4>
                            <div class="type-bar">
                                <div class="type-bar-fill" style="width: ${(type.count / types[0].count) * 100}%; background: ${color};"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📍 SECTION COMMUNES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateCommunesSection(terrains, pageIndex) {
    // Agréger par commune
    const parCommune = {};
    terrains.forEach(t => {
        const commune = t.commune || 'Non spécifié';
        parCommune[commune] = (parCommune[commune] || 0) + 1;
    });
    
    const communes = Object.entries(parCommune)
        .map(([nom, count]) => ({ nom, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
    
    return `
        <div class="communes-ranking">
            ${communes.map((commune, index) => `
                <div class="commune-rank-item" style="animation-delay: ${index * 0.05}s;">
                    <div class="commune-rank-badge">${index + 1}</div>
                    <div class="commune-rank-name">${commune.nom}</div>
                    <div class="commune-rank-bar">
                        <div class="commune-rank-fill" style="width: ${(commune.count / communes[0].count) * 100}%;">
                            ${commune.count} terrain${commune.count > 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ✅ SECTION ÉTAT
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateEtatSection(terrains, pageIndex) {
    const enService = terrains.filter(t => t.etat === 'En service').length;
    const horsService = terrains.filter(t => t.etat === 'Hors service').length;
    const autre = terrains.length - enService - horsService;
    
    return `
        <div class="etat-cards">
            <div class="etat-card service">
                <div class="etat-icon">✅</div>
                <div class="etat-value">${enService}</div>
                <div class="etat-label">En Service</div>
                <div class="etat-percent">${((enService / terrains.length) * 100).toFixed(1)}%</div>
            </div>
            
            ${horsService > 0 ? `
                <div class="etat-card hors">
                    <div class="etat-icon">⚠️</div>
                    <div class="etat-value">${horsService}</div>
                    <div class="etat-label">Hors Service</div>
                    <div class="etat-percent">${((horsService / terrains.length) * 100).toFixed(1)}%</div>
                </div>
            ` : ''}
            
            ${autre > 0 ? `
                <div class="etat-card autre">
                    <div class="etat-icon">ℹ️</div>
                    <div class="etat-value">${autre}</div>
                    <div class="etat-label">Autre État</div>
                    <div class="etat-percent">${((autre / terrains.length) * 100).toFixed(1)}%</div>
                </div>
            ` : ''}
        </div>
        
        <div class="etat-insight">
            <div class="insight-icon">💡</div>
            <div class="insight-text">
                <strong>Disponibilité :</strong> ${((enService / terrains.length) * 100).toFixed(1)}% des équipements sont opérationnels.
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 GRAPHIQUES CHART.JS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function initSportCharts(terrains, pageIndex) {
    // 1. Types de terrains
    const typesCtx = document.getElementById(`chartTypes-${pageIndex}`);
    if (typesCtx) {
        const parType = {};
        terrains.forEach(t => {
            const type = t.nature || 'Non spécifié';
            parType[type] = (parType[type] || 0) + 1;
        });
        
        const top5 = Object.entries(parType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
        
        new Chart(typesCtx, {
            type: 'doughnut',
            data: {
                labels: top5.map(([nom]) => nom.split(' ').slice(0, 3).join(' ')),
                datasets: [{
                    data: top5.map(([, count]) => count),
                    backgroundColor: ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'],
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
    
    // 2. État des équipements
    const etatCtx = document.getElementById(`chartEtat-${pageIndex}`);
    if (etatCtx) {
        const enService = terrains.filter(t => t.etat === 'En service').length;
        const horsService = terrains.filter(t => t.etat === 'Hors service').length;
        const autre = terrains.length - enService - horsService;
        
        new Chart(etatCtx, {
            type: 'pie',
            data: {
                labels: ['En Service', 'Hors Service', 'Autre'],
                datasets: [{
                    data: [enService, horsService, autre],
                    backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
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
    
    // 3. Top communes
    const communesCtx = document.getElementById(`chartCommunes-${pageIndex}`);
    if (communesCtx) {
        const parCommune = {};
        terrains.forEach(t => {
            const commune = t.commune || 'Non spécifié';
            parCommune[commune] = (parCommune[commune] || 0) + 1;
        });
        
        const top10 = Object.entries(parCommune)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);
        
        new Chart(communesCtx, {
            type: 'bar',
            data: {
                labels: top10.map(([nom]) => nom),
                datasets: [{
                    label: 'Nombre de terrains',
                    data: top10.map(([, count]) => count),
                    backgroundColor: '#06b6d4',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true } }
            }
        });
    }
    
    // 4. Répartition départementale
    const deptCtx = document.getElementById(`chartDept-${pageIndex}`);
    if (deptCtx) {
        const dept2A = terrains.filter(t => t.code_commune?.startsWith('2A')).length;
        const dept2B = terrains.filter(t => t.code_commune?.startsWith('2B')).length;
        
        new Chart(deptCtx, {
            type: 'bar',
            data: {
                labels: ['Corse-du-Sud (2A)', 'Haute-Corse (2B)'],
                datasets: [{
                    label: 'Nombre de terrains',
                    data: [dept2A, dept2B],
                    backgroundColor: ['#f59e0b', '#06b6d4'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}
