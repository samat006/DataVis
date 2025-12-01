/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ♻️ DASHBOARD TRI SÉLECTIF - GESTION DES DÉCHETS PAR COMMUNE
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createTriSelectifDashboard(triData, pageIndex) {
    console.log('♻️ Création du dashboard tri sélectif pour page:', pageIndex);
    
    // Calcul des statistiques
    const stats = calculateTriStats(triData);
    
    // Tri par classe
    const sortedData = [...triData].sort((a, b) => a.classe - b.classe);
    
    // Container principal
    const container = document.createElement('div');
    container.className = 'tri-selectif-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="tri-dashboard-header">
            <h2><i class="fas fa-recycle"></i> Tri Sélectif des Déchets</h2>
            <p>Performances de collecte sélective par commune en Corse</p>
        </div>

        <!-- STATISTIQUES GLOBALES -->
        <div class="tri-stats-global">
            <div class="tri-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">🏘️</div>
                <div class="stat-content">
                    <div class="stat-value">${triData.length}</div>
                    <div class="stat-label">Communes</div>
                </div>
            </div>
            
            <div class="tri-stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="stat-icon">🔵</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.departements.length}</div>
                    <div class="stat-label">Départements</div>
                </div>
            </div>
            
            <div class="tri-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.avgClasse.toFixed(1)}</div>
                    <div class="stat-label">Classe Moyenne</div>
                </div>
            </div>
            
            <div class="tri-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">⭐</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.bestCommune.classe}</div>
                    <div class="stat-label">Meilleure Classe</div>
                </div>
            </div>
        </div>

        <!-- GRAPHIQUE RÉPARTITION PAR CLASSE -->
        <div class="tri-chart-wrapper">
            <h3 class="section-title">
                <i class="fas fa-chart-pie"></i> Répartition par Classe de Tri
            </h3>
            <div class="tri-explanation">
                <p><i class="fas fa-info-circle"></i> La classe indique la performance du tri sélectif (1 = excellent, 6 = à améliorer)</p>
            </div>
            <div class="tri-chart-container">
                <canvas id="triClassChart-${pageIndex}"></canvas>
            </div>
        </div>

        <!-- RÉPARTITION GÉOGRAPHIQUE -->
        <div class="tri-geo-section">
            <h3 class="section-title">
                <i class="fas fa-map-marked-alt"></i> Répartition Géographique
            </h3>
            <div class="tri-geo-stats">
                ${generateGeoStats(triData)}
            </div>
        </div>

        <!-- FILTRES -->
        <div class="tri-filters">
            <button class="filter-btn active" data-filter="all">
                <i class="fas fa-list"></i> Toutes
            </button>
            <button class="filter-btn" data-filter="2A">
                <i class="fas fa-map-marker-alt"></i> Corse-du-Sud (2A)
            </button>
            <button class="filter-btn" data-filter="2B">
                <i class="fas fa-map-marker-alt"></i> Haute-Corse (2B)
            </button>
            <button class="filter-btn" data-filter="excellent" data-classe="1,2">
                <i class="fas fa-star"></i> Excellent (Classe 1-2)
            </button>
            <button class="filter-btn" data-filter="moyen" data-classe="3,4">
                <i class="fas fa-star-half-alt"></i> Moyen (Classe 3-4)
            </button>
            <button class="filter-btn" data-filter="ameliorer" data-classe="5,6">
                <i class="fas fa-exclamation-triangle"></i> À améliorer (Classe 5-6)
            </button>
        </div>

        <!-- BARRE DE RECHERCHE -->
        <div class="tri-search-bar">
            <input type="text" id="triSearch-${pageIndex}" placeholder="🔍 Rechercher une commune..." class="tri-search-input">
        </div>

        <!-- GRID DES COMMUNES -->
        <div class="tri-communes-grid" id="triGrid-${pageIndex}">
            ${generateCommuneCards(sortedData)}
        </div>

        <!-- TABLEAU DÉTAILLÉ -->
        <div class="tri-table-wrapper">
            <h3 class="section-title">
                <i class="fas fa-table"></i> Détail par Commune
            </h3>
            <div class="table-scroll">
                <table class="tri-table">
                    <thead>
                        <tr>
                            <th>🏘️ Commune</th>
                            <th>📍 INSEE</th>
                            <th>🗺️ Département</th>
                            <th>⭐ Classe</th>
                            <th>📋 Programme</th>
                            <th>📊 Performance</th>
                        </tr>
                    </thead>
                    <tbody id="triTableBody-${pageIndex}">
                        ${generateTableRows(sortedData)}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- LÉGENDE -->
        <div class="tri-legend">
            <h4><i class="fas fa-info-circle"></i> Légende des Classes</h4>
            <div class="legend-items">
                ${generateClassLegend()}
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        initTriChart(triData, pageIndex);
        initTriFilters(pageIndex);
        initTriSearch(pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * Calcul des statistiques de tri
 */
function calculateTriStats(data) {
    const classes = data.map(d => d.classe);
    const avgClasse = classes.reduce((a, b) => a + b, 0) / classes.length;
    const bestCommune = data.reduce((best, current) => 
        current.classe < best.classe ? current : best
    );
    
    const departements = [...new Set(data.map(d => d.departement))];
    
    return { avgClasse, bestCommune, departements };
}

/**
 * Génération des stats géographiques
 */
function generateGeoStats(data) {
    const dep2A = data.filter(d => d.departement === '2A');
    const dep2B = data.filter(d => d.departement === '2B');
    
    const avg2A = dep2A.reduce((sum, d) => sum + d.classe, 0) / dep2A.length;
    const avg2B = dep2B.reduce((sum, d) => sum + d.classe, 0) / dep2B.length;
    
    return `
        <div class="geo-stat-card">
            <div class="geo-header" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <i class="fas fa-map-marker-alt"></i>
                <h4>Corse-du-Sud (2A)</h4>
            </div>
            <div class="geo-body">
                <div class="geo-metric">
                    <span>Communes</span>
                    <strong>${dep2A.length}</strong>
                </div>
                <div class="geo-metric">
                    <span>Classe moyenne</span>
                    <strong>${avg2A.toFixed(1)}</strong>
                </div>
            </div>
        </div>
        
        <div class="geo-stat-card">
            <div class="geo-header" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                <i class="fas fa-map-marker-alt"></i>
                <h4>Haute-Corse (2B)</h4>
            </div>
            <div class="geo-body">
                <div class="geo-metric">
                    <span>Communes</span>
                    <strong>${dep2B.length}</strong>
                </div>
                <div class="geo-metric">
                    <span>Classe moyenne</span>
                    <strong>${avg2B.toFixed(1)}</strong>
                </div>
            </div>
        </div>
    `;
}

/**
 * Génération des cartes de communes
 */
function generateCommuneCards(data) {
    return data.map(commune => {
        const classeInfo = getClasseInfo(commune.classe);
        
        return `
            <div class="tri-commune-card" data-dept="${commune.departement}" data-classe="${commune.classe}">
                <div class="commune-card-header" style="background: ${classeInfo.color};">
                    <div class="commune-icon">${classeInfo.icon}</div>
                    <div class="commune-title-section">
                        <h4>${commune.commune}</h4>
                        <span class="commune-insee">INSEE: ${commune.insee}</span>
                    </div>
                    <div class="commune-badge">Classe ${commune.classe}</div>
                </div>
                <div class="commune-card-body">
                    <div class="commune-info-row">
                        <span class="info-icon">🗺️</span>
                        <div class="info-content">
                            <div class="info-label">Département</div>
                            <div class="info-value">${commune.departement}</div>
                        </div>
                    </div>
                    <div class="commune-info-row">
                        <span class="info-icon">📋</span>
                        <div class="info-content">
                            <div class="info-label">Programme</div>
                            <div class="info-value">${commune.infos || 'Non renseigné'}</div>
                        </div>
                    </div>
                    <div class="commune-info-row">
                        <span class="info-icon">📍</span>
                        <div class="info-content">
                            <div class="info-label">Coordonnées</div>
                            <div class="info-value">${commune.geocodage.lat.toFixed(4)}°N, ${commune.geocodage.lon.toFixed(4)}°E</div>
                        </div>
                    </div>
                </div>
                <div class="commune-card-footer" style="background: ${classeInfo.color}; opacity: 0.1;"></div>
            </div>
        `;
    }).join('');
}

/**
 * Génération des lignes du tableau
 */
function generateTableRows(data) {
    return data.map(commune => {
        const classeInfo = getClasseInfo(commune.classe);
        
        return `
            <tr data-dept="${commune.departement}" data-classe="${commune.classe}">
                <td><strong>${commune.commune}</strong></td>
                <td>${commune.insee}</td>
                <td><span class="dept-badge" style="background: ${commune.departement === '2A' ? '#3b82f6' : '#ec4899'};">${commune.departement}</span></td>
                <td>
                    <div class="classe-badge" style="background: ${classeInfo.color};">
                        ${classeInfo.icon} ${commune.classe}
                    </div>
                </td>
                <td style="font-size: 0.85em;">${commune.infos || 'Non renseigné'}</td>
                <td>
                    <div class="performance-bar">
                        <div class="performance-fill" style="width: ${(7 - commune.classe) * 16.67}%; background: ${classeInfo.color};"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Informations sur les classes
 */
function getClasseInfo(classe) {
    const classesInfo = {
        1: { icon: '🌟', color: 'linear-gradient(135deg, #10b981, #059669)', label: 'Excellent' },
        2: { icon: '⭐', color: 'linear-gradient(135deg, #22c55e, #16a34a)', label: 'Très bien' },
        3: { icon: '🟢', color: 'linear-gradient(135deg, #84cc16, #65a30d)', label: 'Bien' },
        4: { icon: '🟡', color: 'linear-gradient(135deg, #f59e0b, #d97706)', label: 'Moyen' },
        5: { icon: '🟠', color: 'linear-gradient(135deg, #f97316, #ea580c)', label: 'Médiocre' },
        6: { icon: '🔴', color: 'linear-gradient(135deg, #ef4444, #dc2626)', label: 'À améliorer' }
    };
    
    return classesInfo[classe] || classesInfo[6];
}

/**
 * Génération de la légende
 */
function generateClassLegend() {
    return [1, 2, 3, 4, 5, 6].map(classe => {
        const info = getClasseInfo(classe);
        return `
            <div class="legend-item">
                <div class="legend-badge" style="background: ${info.color};">
                    ${info.icon} Classe ${classe}
                </div>
                <span>${info.label}</span>
            </div>
        `;
    }).join('');
}

/**
 * Initialisation du graphique
 */
function initTriChart(data, pageIndex) {
    const ctx = document.getElementById(`triClassChart-${pageIndex}`);
    if (!ctx) return;
    
    // Compter par classe
    const classeCounts = {};
    for (let i = 1; i <= 6; i++) {
        classeCounts[i] = data.filter(d => d.classe === i).length;
    }
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Classe 1', 'Classe 2', 'Classe 3', 'Classe 4', 'Classe 5', 'Classe 6'],
            datasets: [{
                data: Object.values(classeCounts),
                backgroundColor: [
                    '#10b981',
                    '#22c55e',
                    '#84cc16',
                    '#f59e0b',
                    '#f97316',
                    '#ef4444'
                ],
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 13, weight: 'bold' },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} communes (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialisation des filtres
 */
function initTriFilters(pageIndex) {
    const filterButtons = document.querySelectorAll('.tri-filters .filter-btn');
    const grid = document.getElementById(`triGrid-${pageIndex}`);
    const tableBody = document.getElementById(`triTableBody-${pageIndex}`);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const classeFilter = btn.dataset.classe;
            
            // Filtrer les cartes
            const cards = grid.querySelectorAll('.tri-commune-card');
            cards.forEach(card => {
                let show = false;
                
                if (filter === 'all') {
                    show = true;
                } else if (filter === '2A' || filter === '2B') {
                    show = card.dataset.dept === filter;
                } else if (classeFilter) {
                    const classes = classeFilter.split(',').map(Number);
                    show = classes.includes(parseInt(card.dataset.classe));
                }
                
                card.style.display = show ? '' : 'none';
            });
            
            // Filtrer le tableau
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                let show = false;
                
                if (filter === 'all') {
                    show = true;
                } else if (filter === '2A' || filter === '2B') {
                    show = row.dataset.dept === filter;
                } else if (classeFilter) {
                    const classes = classeFilter.split(',').map(Number);
                    show = classes.includes(parseInt(row.dataset.classe));
                }
                
                row.style.display = show ? '' : 'none';
            });
        });
    });
}

/**
 * Initialisation de la recherche
 */
function initTriSearch(pageIndex) {
    const searchInput = document.getElementById(`triSearch-${pageIndex}`);
    const grid = document.getElementById(`triGrid-${pageIndex}`);
    const tableBody = document.getElementById(`triTableBody-${pageIndex}`);
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            // Filtrer les cartes
            const cards = grid.querySelectorAll('.tri-commune-card');
            cards.forEach(card => {
                const commune = card.querySelector('h4').textContent.toLowerCase();
                card.style.display = commune.includes(searchTerm) ? '' : 'none';
            });
            
            // Filtrer le tableau
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const commune = row.cells[0].textContent.toLowerCase();
                row.style.display = commune.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗑️ DASHBOARD DÉCHARGES - SITES DE GESTION DES DÉCHETS
 * ════════════════════════════════════════════════════════════════════════════════
 */



// Fonction globale accessible depuis HTML
window.flyToSite = function(lat, lon, pageIndex, height = 2000) {
    console.log(`🎯 Vol vers: ${lat}, ${lon} (page: ${pageIndex})`);
    
    // Récupérer le viewer de la page actuelle
    const viewer = window.cesiumViewers[pageIndex];
    
    if (!viewer) {
        console.error('❌ Viewer Cesium non trouvé pour la page:', pageIndex);
        alert('Erreur: Carte 3D non disponible');
        return;
    }
    
    try {
        // Animation de vol vers le site
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45),
                roll: 0
            },
            duration: 2.5,
            complete: function() {
                console.log('✅ Vol terminé');
                
                // Ajouter un marqueur temporaire
                addTemporaryMarker(viewer, lat, lon);
            }
        });
        
        // Feedback visuel sur le bouton
        const button = event.target.closest('.btn-view-site');
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Localisé !';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 2000);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du vol:', error);
        alert('Erreur lors de la localisation du site');
    }
};

/**
 * Ajouter un marqueur temporaire sur le site
 */
function addTemporaryMarker(viewer, lat, lon) {
    // Supprimer les anciens marqueurs temporaires
    const existingMarkers = viewer.entities.values.filter(e => 
        e.id && e.id.startsWith('temp-marker-')
    );
    existingMarkers.forEach(marker => viewer.entities.remove(marker));
    
    // Créer un nouveau marqueur
    const marker = viewer.entities.add({
        id: `temp-marker-${Date.now()}`,
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        billboard: {
            image: createMarkerCanvas(),
            scale: 1.0,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
            text: '📍 Site localisé',
            font: 'bold 16px sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -50),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    });
    
    // Supprimer le marqueur après 5 secondes
    setTimeout(() => {
        viewer.entities.remove(marker);
    }, 5000);
}

/**
 * Créer un canvas pour le marqueur personnalisé
 */
function createMarkerCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Fond du marqueur (forme de goutte)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(24, 20, 20, 0, Math.PI * 2);
    ctx.moveTo(24, 40);
    ctx.lineTo(14, 56);
    ctx.quadraticCurveTo(24, 64, 34, 56);
    ctx.closePath();
    ctx.fill();
    
    // Bordure blanche
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Point central
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(24, 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas.toDataURL();
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 GÉNÉRATION DES LIGNES DU TABLEAU - CORRIGÉE
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function generateDechargeTableRows(data, pageIndex) {
    return data.map(site => {
        const statusInfo = getDechargeStatusInfo(site.code);
        
        return `
            <tr data-dept="${site.dep}" data-code="${site.code}">
                <td><strong>${site.site}</strong></td>
                <td>${site.commune}</td>
                <td><span class="dept-badge" style="background: ${site.dep === '2A' ? '#3b82f6' : '#ec4899'};">${site.dep}</span></td>
                <td>
                    <div class="status-badge" style="background: ${statusInfo.color}; color: white;">
                        ${statusInfo.icon} ${site.type}
                    </div>
                </td>
                <td style="font-size: 0.85em;">${site.infos || 'Non renseigné'}</td>
                <td>
                    <button class="btn-view-site" onclick="flyToSite(${site.geocodage.lat}, ${site.geocodage.lon}, ${pageIndex})">
                        <i class="fas fa-map-marker-alt"></i> Localiser
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗑️ DASHBOARD DÉCHARGES - FONCTION PRINCIPALE MISE À JOUR
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createDechargeDashboard(dechargeData, pageIndex) {
    console.log('🗑️ Création du dashboard décharges pour page:', pageIndex);
    
    // Calcul des statistiques
    const stats = calculateDechargeStats(dechargeData);
    
    // Container principal
    const container = document.createElement('div');
    container.className = 'decharge-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="decharge-dashboard-header">
            <h2><i class="fas fa-trash-restore"></i> État des Décharges et Sites de Déchets</h2>
            <p>Suivi de la réhabilitation des sites en Corse</p>
        </div>

        <!-- STATISTIQUES GLOBALES -->
        <div class="decharge-stats-global">
            <div class="decharge-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.rehabilitees}</div>
                    <div class="stat-label">Sites Réhabilités</div>
                    <div class="stat-percentage">${((stats.rehabilitees / dechargeData.length) * 100).toFixed(0)}%</div>
                </div>
            </div>
            
            <div class="decharge-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">⚠️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.aRehabiliter}</div>
                    <div class="stat-label">À Réhabiliter</div>
                    <div class="stat-percentage">${((stats.aRehabiliter / dechargeData.length) * 100).toFixed(0)}%</div>
                </div>
            </div>
            
            <div class="decharge-stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="stat-icon">🏗️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.enCours}</div>
                    <div class="stat-label">En Cours</div>
                    <div class="stat-percentage">${((stats.enCours / dechargeData.length) * 100).toFixed(0)}%</div>
                </div>
            </div>
            
            <div class="decharge-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">📍</div>
                <div class="stat-content">
                    <div class="stat-value">${dechargeData.length}</div>
                    <div class="stat-label">Total Sites</div>
                </div>
            </div>
        </div>

        <!-- GRAPHIQUE RÉPARTITION -->
        <div class="decharge-chart-wrapper">
            <h3 class="section-title">
                <i class="fas fa-chart-pie"></i> Répartition par Statut
            </h3>
            <div class="decharge-chart-container">
                <canvas id="dechargeStatusChart-${pageIndex}"></canvas>
            </div>
        </div>

        <!-- GRAPHIQUE PAR DÉPARTEMENT -->
        <div class="decharge-chart-wrapper">
            <h3 class="section-title">
                <i class="fas fa-chart-bar"></i> Sites par Département
            </h3>
            <div class="decharge-chart-container">
                <canvas id="dechargeDeptChart-${pageIndex}"></canvas>
            </div>
        </div>

        <!-- FILTRES -->
        <div class="decharge-filters">
            <button class="filter-btn active" data-filter="all">
                <i class="fas fa-list"></i> Tous
            </button>
            <button class="filter-btn" data-filter="2" data-type="Réhabilitée">
                <i class="fas fa-check-circle"></i> Réhabilités
            </button>
            <button class="filter-btn" data-filter="3" data-type="A réhabiliter">
                <i class="fas fa-exclamation-circle"></i> À Réhabiliter
            </button>
            <button class="filter-btn" data-filter="1" data-type="En cours de réhabilitation">
                <i class="fas fa-tools"></i> En Cours
            </button>
            <button class="filter-btn" data-filter="2A">
                <i class="fas fa-map-marker-alt"></i> Corse-du-Sud
            </button>
            <button class="filter-btn" data-filter="2B">
                <i class="fas fa-map-marker-alt"></i> Haute-Corse
            </button>
        </div>

        <!-- BARRE DE RECHERCHE -->
        <div class="decharge-search-bar">
            <input type="text" id="dechargeSearch-${pageIndex}" placeholder="🔍 Rechercher un site ou une commune..." class="decharge-search-input">
        </div>

        <!-- GRID DES SITES -->
        <div class="decharge-sites-grid" id="dechargeGrid-${pageIndex}">
            ${generateSiteCards(dechargeData, pageIndex)}
        </div>

        <!-- TABLEAU DÉTAILLÉ -->
        <div class="decharge-table-wrapper">
            <h3 class="section-title">
                <i class="fas fa-table"></i> Liste Complète des Sites
            </h3>
            <div class="table-scroll">
                <table class="decharge-table">
                    <thead>
                        <tr>
                            <th>📍 Site</th>
                            <th>🏘️ Commune</th>
                            <th>🗺️ Département</th>
                            <th>📊 Statut</th>
                            <th>📋 Informations</th>
                            <th>🎯 Action</th>
                        </tr>
                    </thead>
                    <tbody id="dechargeTableBody-${pageIndex}">
                        ${generateDechargeTableRows(dechargeData, pageIndex)}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- LÉGENDE -->
        <div class="decharge-legend">
            <h4><i class="fas fa-info-circle"></i> Légende des Statuts</h4>
            <div class="legend-items">
                ${generateDechargeStatusLegend()}
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        initDechargeCharts(dechargeData, pageIndex);
        initDechargeFilters(pageIndex);
        initDechargeSearch(pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🃏 GÉNÉRATION DES CARTES DE SITES - MISE À JOUR
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateSiteCards(data, pageIndex) {
    return data.map(site => {
        const statusInfo = getDechargeStatusInfo(site.code);
        
        return `
            <div class="decharge-site-card" data-dept="${site.dep}" data-code="${site.code}">
                <div class="site-card-header" style="background: ${statusInfo.color};">
                    <div class="site-status-icon">${statusInfo.icon}</div>
                    <div class="site-title-section">
                        <h4>${site.site}</h4>
                        <span class="site-commune">${site.commune}</span>
                    </div>
                </div>
                <div class="site-card-body">
                    <div class="site-status-badge" style="background: ${statusInfo.color};">
                        ${statusInfo.icon} ${site.type}
                    </div>
                    <div class="site-info-row">
                        <span class="info-icon">🗺️</span>
                        <div class="info-content">
                            <div class="info-label">Département</div>
                            <div class="info-value">${site.departement}</div>
                        </div>
                    </div>
                    <div class="site-info-row">
                        <span class="info-icon">📍</span>
                        <div class="info-content">
                            <div class="info-label">Code INSEE</div>
                            <div class="info-value">${site.insee}</div>
                        </div>
                    </div>
                    <div class="site-info-row">
                        <span class="info-icon">📋</span>
                        <div class="info-content">
                            <div class="info-label">Informations</div>
                            <div class="info-value">${site.infos || 'Non renseigné'}</div>
                        </div>
                    </div>
                    <div class="site-info-row">
                        <span class="info-icon">🌍</span>
                        <div class="info-content">
                            <div class="info-label">Coordonnées</div>
                            <div class="info-value">${site.geocodage.lat.toFixed(4)}°N, ${site.geocodage.lon.toFixed(4)}°E</div>
                        </div>
                    </div>
                    <div class="site-card-actions">
                        <button class="btn-view-site" onclick="flyToSite(${site.geocodage.lat}, ${site.geocodage.lon}, ${pageIndex})">
                            <i class="fas fa-map-marker-alt"></i> Localiser sur la carte
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
/**
 * Calcul des statistiques de décharges
 */
function calculateDechargeStats(data) {
    return {
        rehabilitees: data.filter(d => d.code === 2).length,
        aRehabiliter: data.filter(d => d.code === 3).length,
        enCours: data.filter(d => d.code === 1).length,
        dep2A: data.filter(d => d.dep === '2A').length,
        dep2B: data.filter(d => d.dep === '2B').length
    };
}



/**
 * Génération des lignes du tableau décharges
 */


window.flyToSite = function flyToSite(lat, lon, height = 500,viewer ) {

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0
        },
        duration: 2 // secondes
    });
}



/**
 * Informations sur les statuts
 */
function getDechargeStatusInfo(code) {
    const statusInfo = {
        1: { icon: '🏗️', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', label: 'En cours' },
        2: { icon: '✅', color: 'linear-gradient(135deg, #10b981, #059669)', label: 'Réhabilité' },
        3: { icon: '⚠️', color: 'linear-gradient(135deg, #f59e0b, #d97706)', label: 'À réhabiliter' }
    };
    
    return statusInfo[code] || statusInfo[3];
}

/**
 * Génération de la légende des statuts
 */
function generateDechargeStatusLegend() {
    return [2, 1, 3].map(code => {
        const info = getDechargeStatusInfo(code);
        return `
            <div class="legend-item">
                <div class="legend-badge" style="background: ${info.color};">
                    ${info.icon}
                </div>
                <span>${info.label}</span>
            </div>
        `;
    }).join('');
}

/**
 * Initialisation des graphiques décharges
 */
function initDechargeCharts(data, pageIndex) {
    // Graphique statut
    const statusCtx = document.getElementById(`dechargeStatusChart-${pageIndex}`);
    if (statusCtx) {
        const stats = calculateDechargeStats(data);
        
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Réhabilités', 'À Réhabiliter', 'En Cours'],
                datasets: [{
                    data: [stats.rehabilitees, stats.aRehabiliter, stats.enCours],
                    backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 14, weight: 'bold' },
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    // Graphique départements
    const deptCtx = document.getElementById(`dechargeDeptChart-${pageIndex}`);
    if (deptCtx) {
        const stats = calculateDechargeStats(data);
        
        new Chart(deptCtx, {
            type: 'bar',
            data: {
                labels: ['Corse-du-Sud (2A)', 'Haute-Corse (2B)'],
                datasets: [{
                    label: 'Nombre de sites',
                    data: [stats.dep2A, stats.dep2B],
                    backgroundColor: ['#3b82f6', '#ec4899'],
                    borderWidth: 2,
                    borderColor: ['#2563eb', '#db2777']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }
}

/**
 * Initialisation des filtres décharges
 */
function initDechargeFilters(pageIndex) {
    const filterButtons = document.querySelectorAll('.decharge-filters .filter-btn');
    const grid = document.getElementById(`dechargeGrid-${pageIndex}`);
    const tableBody = document.getElementById(`dechargeTableBody-${pageIndex}`);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filtrer les cartes
            const cards = grid.querySelectorAll('.decharge-site-card');
            cards.forEach(card => {
                let show = false;
                
                if (filter === 'all') {
                    show = true;
                } else if (filter === '2A' || filter === '2B') {
                    show = card.dataset.dept === filter;
                } else {
                    show = card.dataset.code === filter;
                }
                
                card.style.display = show ? '' : 'none';
            });
            
            // Filtrer le tableau
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                let show = false;
                
                if (filter === 'all') {
                    show = true;
                } else if (filter === '2A' || filter === '2B') {
                    show = row.dataset.dept === filter;
                } else {
                    show = row.dataset.code === filter;
                }
                
                row.style.display = show ? '' : 'none';
            });
        });
    });
}

/**
 * Initialisation de la recherche décharges
 */
function initDechargeSearch(pageIndex) {
    const searchInput = document.getElementById(`dechargeSearch-${pageIndex}`);
    const grid = document.getElementById(`dechargeGrid-${pageIndex}`);
    const tableBody = document.getElementById(`dechargeTableBody-${pageIndex}`);
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            // Filtrer les cartes
            const cards = grid.querySelectorAll('.decharge-site-card');
            cards.forEach(card => {
                const site = card.querySelector('h4').textContent.toLowerCase();
                const commune = card.querySelector('.site-commune').textContent.toLowerCase();
                card.style.display = (site.includes(searchTerm) || commune.includes(searchTerm)) ? '' : 'none';
            });
            
            // Filtrer le tableau
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const site = row.cells[0].textContent.toLowerCase();
                const commune = row.cells[1].textContent.toLowerCase();
                row.style.display = (site.includes(searchTerm) || commune.includes(searchTerm)) ? '' : 'none';
            });
        });
    }
}
