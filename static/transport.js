/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🚌 DASHBOARD TRANSPORT & MOBILITÉ - CONCOURS DATAVIS
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createTransportDashboard(tranCorseSud, horaireCar2A, horaireGTF, parkings, ppi, bornesElec, stationsVelo, pageIndex) {
    console.log('🚌 Création du dashboard transport pour page:', pageIndex);
    
    const stats = calculateTransportStats(tranCorseSud, horaireCar2A, horaireGTF, parkings, ppi, bornesElec, stationsVelo);
    
    const container = document.createElement('div');
    container.className = 'transport-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="transport-dashboard-header">
            <h2><i class="fas fa-bus"></i> Transport & Mobilité en Corse</h2>
            <p>Réseau routier, ferroviaire, parkings et infrastructures de mobilité</p>
        </div>

        <!-- STATS GLOBALES -->
        <div class="transport-stats-global">
            <div class="transport-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">🚌</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalLignesBus}</div>
                    <div class="stat-label">Lignes de Bus</div>
                    <div class="stat-detail">Réseau régional</div>
                </div>
            </div>
            
            <div class="transport-stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="stat-icon">🚂</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalLignesTrain}</div>
                    <div class="stat-label">Lignes de Train</div>
                    <div class="stat-detail">Réseau ferroviaire</div>
                </div>
            </div>
            
            <div class="transport-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">🅿️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalParkings}</div>
                    <div class="stat-label">Parkings</div>
                    <div class="stat-detail">${stats.totalPlaces} places</div>
                </div>
            </div>
            
            <div class="transport-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">🚴</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalStationsVelo}</div>
                    <div class="stat-label">Stations Vélo</div>
                    <div class="stat-detail">${stats.totalVeloPlaces} places</div>
                </div>
            </div>
        </div>

        <!-- INSIGHT BANNER -->
        <div class="insight-banner">
            <div class="insight-icon">💡</div>
            <div class="insight-text">
                <strong>Multimodalité :</strong> ${stats.totalLignesBus + stats.totalLignesTrain} lignes de transport collectif. 
                ${stats.investissementTotal}M€ d'investissement prévu 2026-2030.
            </div>
        </div>

        <!-- CARTE CESIUM -->
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-map-marked-alt"></i> Carte Interactive du Réseau
                </h3>
                <div class="map-controls">
                    <button class="map-control-btn" onclick="clearTransportMap(${pageIndex})">
                        <i class="fas fa-eraser"></i> Vider
                    </button>
                    <button class="map-control-btn" onclick="showTransportOnMap(${pageIndex})">
                        <i class="fas fa-eye"></i> Afficher
                    </button>
                    <button class="toggle-section-btn" onclick="toggleSection('mapContent-${pageIndex}')">
                        <i class="fas fa-chevron-down"></i> Réduire
                    </button>
                </div>
            </div>
            <div id="mapContent-${pageIndex}" class="section-content">
                <p class="section-intro">🗺️ Visualisez l'ensemble du réseau : lignes de bus, trains, parkings et vélos.</p>
                <div class="transport-map-container">
                    <div id="cesiumTransport-${pageIndex}" class="cesium-transport-viewer"></div>
                    <div class="map-legend-transport">
                        <h4><i class="fas fa-info-circle"></i> Légende</h4>
                        <div class="legend-items">
                            <div class="legend-item">
                                <span class="legend-line" style="background: #f59e0b;"></span>
                                <span>Bus</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-line" style="background: #3b82f6;"></span>
                                <span>Train</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #10b981;">🅿️</span>
                                <span>Parkings</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #8b5cf6;">🚴</span>
                                <span>Vélos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION LIGNES BUS -->
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-bus-alt"></i> Réseau de Bus
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('busContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="busContent-${pageIndex}" class="section-content">
                <p class="section-intro">🚌 ${stats.totalLignesBus} lignes desservent l'ensemble du territoire.</p>
                ${generateLignesBusSection(tranCorseSud, horaireCar2A, pageIndex)}
            </div>
        </div>

        <!-- SECTION TRAIN -->
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-train"></i> Réseau Ferroviaire
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('trainContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="trainContent-${pageIndex}" class="section-content">
                <p class="section-intro">🚂 ${stats.totalLignesTrain} lignes ferroviaires principales.</p>
                ${generateLignesTrainSection(horaireGTF, pageIndex)}
            </div>
        </div>

        <!-- SECTION PARKINGS -->
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-parking"></i> Parkings & Stationnement
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('parkingContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="parkingContent-${pageIndex}" class="section-content">
                <p class="section-intro">🅿️ ${stats.totalParkings} parkings pour ${stats.totalPlaces} places.</p>
                ${generateParkingsSection(parkings, pageIndex)}
            </div>
        </div>

        <!-- SECTION VÉLOS -->
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-bicycle"></i> Mobilité Douce
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('veloContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="veloContent-${pageIndex}" class="section-content">
                <p class="section-intro">🚴 ${stats.totalStationsVelo} stations vélo sur le territoire.</p>
                ${generateVelosSection(stationsVelo, pageIndex)}
            </div>
        </div>

        <!-- SECTION INVESTISSEMENTS -->
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-euro-sign"></i> Plan d'Investissement 2026-2030
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('ppiContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="ppiContent-${pageIndex}" class="section-content">
                <p class="section-intro">💰 ${stats.investissementTotal}M€ d'investissements prévus.</p>
                ${generatePPISection(ppi, pageIndex)}
            </div>
        </div>

        <!-- SECTION BORNES ÉLECTRIQUES -->
        ${bornesElec && bornesElec.length > 0 ? `
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-charging-station"></i> Recharge Électrique
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('bornesContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="bornesContent-${pageIndex}" class="section-content">
                <p class="section-intro">⚡ État du système électrique pour la recharge.</p>
                ${generateBornesSection(bornesElec, pageIndex)}
            </div>
        </div>
        ` : ''}

        <!-- GRAPHIQUES -->
        <div class="transport-section">
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
                        <h4>Répartition des Lignes</h4>
                        <canvas id="chartLignes-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Parkings par Type</h4>
                        <canvas id="chartParkings-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Investissements 2026-2030</h4>
                        <canvas id="chartPPI-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Stations Vélo par Type</h4>
                        <canvas id="chartVelo-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        storeTransportData(tranCorseSud, horaireCar2A, horaireGTF, parkings, ppi, bornesElec, stationsVelo, pageIndex);
        initTransportCharts(tranCorseSud, horaireCar2A, horaireGTF, parkings, ppi, stationsVelo, pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CALCUL DES STATS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateTransportStats(tranSud, car2A, train, parkings, ppi, bornes, velos) {
    const totalLignesBus = (tranSud?.length || 0) + (car2A?.length || 0);
    const totalLignesTrain = train?.length || 0;
    const totalParkings = parkings?.length || 0;
    const totalPlaces = parkings?.reduce((sum, p) => sum + (p.nombre_place || 0), 0) || 0;
    const totalStationsVelo = velos?.length || 0;
    const totalVeloPlaces = velos?.reduce((sum, v) => sum + (v.nb_places || 0), 0) || 0;
    
    // Investissement total
    let investissementTotal = 0;
    if (ppi && ppi.length > 0) {
        ppi.forEach(p => {
            investissementTotal += (p.montant_revalorise_a_date_de_juin_2025 || 0);
        });
        investissementTotal = (investissementTotal / 1000000).toFixed(1); // Convertir en M€
    }
    
    return {
        totalLignesBus,
        totalLignesTrain,
        totalParkings,
        totalPlaces: Math.round(totalPlaces),
        totalStationsVelo,
        totalVeloPlaces,
        investissementTotal
    };
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗺️ GESTION CESIUM
 * ════════════════════════════════════════════════════════════════════════════════
 */

if (!window.transportDataStore) window.transportDataStore = {};

export function storeTransportData(tranSud, car2A, train, parkings, ppi, bornes, velos, pageIndex) {
    window.transportDataStore[pageIndex] = {
        tranSud, car2A, train, parkings, ppi, bornes, velos
    };
}

/**
 * AFFICHER SUR LA CARTE
 */
window.showTransportOnMap = function(pageIndex) {
    const viewer = window.cesiumViewers[pageIndex];
    const data = window.transportDataStore[pageIndex];
    
    if (!viewer || !data) {
        console.error('❌ Viewer ou données non disponibles');
        return;
    }
    
    console.log('🗺️ Affichage du réseau de transport...');
    viewer.entities.removeAll();
    
    let count = 0;
    const { tranSud, car2A, train, parkings, velos } = data;
    
    // Lignes de bus Sud
    if (tranSud) {
        tranSud.forEach(ligne => {
            if (ligne.shape?.geometry?.coordinates) {
                addTransportLine(viewer, ligne, '#f59e0b', 3);
                count++;
            }
        });
    }
    
    // Lignes de bus 2A
    if (car2A) {
        car2A.forEach(ligne => {
            if (ligne.shape?.geometry?.coordinates) {
                addTransportLine(viewer, ligne, `#${ligne.route_color || 'f59e0b'}`, 3);
                count++;
            }
        });
    }
    
    // Lignes de train
    if (train) {
        train.forEach(ligne => {
            if (ligne.shape?.geometry?.coordinates) {
                addTransportLine(viewer, ligne, '#3b82f6', 4);
                count++;
            }
        });
    }
    
    // Parkings
    if (parkings) {
        parkings.forEach(parking => {
            if (parking.geo_point_2d?.lat && parking.geo_point_2d?.lon) {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(parking.geo_point_2d.lon, parking.geo_point_2d.lat),
                    billboard: {
                        image: createTransportMarker('🅿️', '#10b981'),
                        scale: 0.6,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                    },
                    description: createParkingDescription(parking)
                });
                count++;
            }
        });
    }
    
    // Stations vélo
    if (velos) {
        velos.forEach(station => {
            if (station.geo_point_2d?.lat && station.geo_point_2d?.lon) {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(station.geo_point_2d.lon, station.geo_point_2d.lat),
                    billboard: {
                        image: createTransportMarker('🚴', '#8b5cf6'),
                        scale: 0.6,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                    },
                    description: createVeloDescription(station)
                });
                count++;
            }
        });
    }
    
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
    
    console.log(`✅ ${count} éléments affichés`);
};

/**
 * VIDER LA CARTE
 */
window.clearTransportMap = function(pageIndex) {
    const viewer = window.cesiumViewers[pageIndex];
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

function addTransportLine(viewer, ligne, color, width) {
    const coords = ligne.shape.geometry.coordinates[0];
    const positions = coords.map(coord => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));
    
    viewer.entities.add({
        polyline: {
            positions: positions,
            width: width,
            material: Cesium.Color.fromCssColorString(color),
            clampToGround: true
        },
        description: createLigneDescription(ligne)
    });
}

function createTransportMarker(emoji, color) {
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

function createLigneDescription(ligne) {
    return `
        <div style="font-family: 'Space Grotesk', sans-serif; padding: 15px;">
            <h3 style="margin: 0 0 10px 0;">${ligne.route_long_name}</h3>
            <p><strong>${ligne.route_type}</strong> - ${ligne.route_short_name}</p>
        </div>
    `;
}

function createParkingDescription(parking) {
    return `
        <div style="font-family: 'Space Grotesk', sans-serif; padding: 15px;">
            <h3 style="margin: 0 0 10px 0;">${parking.nom}</h3>
            <p>🅿️ ${parking.nombre_place} places</p>
            <p>Type: ${parking.type_parking}</p>
            ${parking.adresse ? `<p>📍 ${parking.adresse}</p>` : ''}
        </div>
    `;
}

function createVeloDescription(station) {
    return `
        <div style="font-family: 'Space Grotesk', sans-serif; padding: 15px;">
            <h3 style="margin: 0 0 10px 0;">${station.nom}</h3>
            <p>🚴 ${station.nb_places} places (${station.nb_arceaux} arceaux)</p>
            <p>Type: ${station.type}</p>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🚌 SECTION LIGNES DE BUS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateLignesBusSection(tranSud, car2A, pageIndex) {
    const allBus = [...(tranSud || []), ...(car2A || [])];
    const displayed = allBus.slice(0, 12);
    
    return `
        <div class="lignes-stats">
            <div class="ligne-stat-box">
                <div class="ligne-icon">🚌</div>
                <div class="ligne-value">${allBus.length}</div>
                <div class="ligne-label">Lignes Totales</div>
            </div>
            <div class="ligne-stat-box">
                <div class="ligne-icon">🗺️</div>
                <div class="ligne-value">${tranSud?.length || 0}</div>
                <div class="ligne-label">Corse-du-Sud</div>
            </div>
            <div class="ligne-stat-box">
                <div class="ligne-icon">🗺️</div>
                <div class="ligne-value">${car2A?.length || 0}</div>
                <div class="ligne-label">Haute-Corse</div>
            </div>
        </div>
        
        <div class="lignes-grid">
            ${displayed.map((ligne, index) => `
                <div class="ligne-card" style="animation-delay: ${index * 0.05}s;">
                    <div class="ligne-card-header" style="background: #${ligne.route_color || 'f59e0b'};">
                        <span class="ligne-numero">${ligne.route_short_name}</span>
                        <span class="ligne-type">${ligne.route_type}</span>
                    </div>
                    <div class="ligne-card-body">
                        <h4>${ligne.route_long_name}</h4>
                        <div class="ligne-info">
                            <i class="fas fa-route"></i>
                            <span>Liaison régionale</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${allBus.length > 12 ? `
            <div class="load-more-container">
                <p>Affichage de 12 sur ${allBus.length} lignes</p>
            </div>
        ` : ''}
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🚂 SECTION LIGNES DE TRAIN
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateLignesTrainSection(train, pageIndex) {
    if (!train || train.length === 0) {
        return '<p>Aucune donnée de train disponible.</p>';
    }
    
    return `
        <div class="train-highlight">
            <div class="train-logo">🚂</div>
            <div class="train-info">
                <h3>Chemins de Fer de Corse</h3>
                <p>${train.length} lignes ferroviaires principales</p>
            </div>
        </div>
        
        <div class="train-grid">
            ${train.map((ligne, index) => `
                <div class="train-card" style="animation-delay: ${index * 0.1}s;">
                    <div class="train-card-header">
                        <span class="train-numero">${ligne.route_short_name}</span>
                        <span class="train-badge">🚂 Train</span>
                    </div>
                    <div class="train-card-body">
                        <h4>${ligne.route_long_name}</h4>
                        <div class="train-route">
                            <i class="fas fa-route"></i>
                            <span>Liaison ferroviaire</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🅿️ SECTION PARKINGS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateParkingsSection(parkings, pageIndex) {
    if (!parkings || parkings.length === 0) {
        return '<p>Aucune donnée de parking disponible.</p>';
    }
    
    // Calculer stats
    const publics = parkings.filter(p => p.type_parking === 'public').length;
    const prives = parkings.length - publics;
    const totalPlaces = parkings.reduce((sum, p) => sum + (p.nombre_place || 0), 0);
    const displayed = parkings.slice(0, 12);
    
    return `
        <div class="parking-stats">
            <div class="parking-stat-box">
                <div class="parking-icon">🅿️</div>
                <div class="parking-value">${Math.round(totalPlaces)}</div>
                <div class="parking-label">Places Totales</div>
            </div>
            <div class="parking-stat-box">
                <div class="parking-icon">🏛️</div>
                <div class="parking-value">${publics}</div>
                <div class="parking-label">Parkings Publics</div>
            </div>
            <div class="parking-stat-box">
                <div class="parking-icon">🏢</div>
                <div class="parking-value">${prives}</div>
                <div class="parking-label">Parkings Privés</div>
            </div>
        </div>
        
        <div class="parking-grid">
            ${displayed.map((parking, index) => `
                <div class="parking-card" style="animation-delay: ${index * 0.05}s;">
                    <div class="parking-card-header">
                        <span class="parking-icon-large">🅿️</span>
                        <span class="parking-badge ${parking.type_parking}">${parking.type_parking}</span>
                    </div>
                    <div class="parking-card-body">
                        <h4>${parking.nom}</h4>
                        <div class="parking-info">
                            <i class="fas fa-car"></i>
                            <span>${parking.nombre_place} places</span>
                        </div>
                        ${parking.adresse ? `
                            <div class="parking-info">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${parking.adresse}</span>
                            </div>
                        ` : ''}
                        ${parking.specifite ? `
                            <div class="parking-tags">
                                <span class="parking-tag">${parking.specifite}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${parkings.length > 12 ? `
            <div class="load-more-container">
                <p>Affichage de 12 sur ${parkings.length} parkings</p>
            </div>
        ` : ''}
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🚴 SECTION VÉLOS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateVelosSection(velos, pageIndex) {
    if (!velos || velos.length === 0) {
        return '<p>Aucune donnée de station vélo disponible.</p>';
    }
    
    const totalPlaces = velos.reduce((sum, v) => sum + (v.nb_places || 0), 0);
    const totalArceaux = velos.reduce((sum, v) => sum + (v.nb_arceaux || 0), 0);
    const displayed = velos.slice(0, 12);
    
    return `
        <div class="velo-stats">
            <div class="velo-stat-box">
                <div class="velo-icon">🚴</div>
                <div class="velo-value">${totalPlaces}</div>
                <div class="velo-label">Places Totales</div>
            </div>
            <div class="velo-stat-box">
                <div class="velo-icon">🔒</div>
                <div class="velo-value">${totalArceaux}</div>
                <div class="velo-label">Arceaux</div>
            </div>
            <div class="velo-stat-box">
                <div class="velo-icon">📍</div>
                <div class="velo-value">${velos.length}</div>
                <div class="velo-label">Stations</div>
            </div>
        </div>
        
        <div class="velo-grid">
            ${displayed.map((station, index) => `
                <div class="velo-card" style="animation-delay: ${index * 0.05}s;">
                    <div class="velo-card-header">
                        <span class="velo-icon-large">🚴</span>
                        <span class="velo-type">${station.type}</span>
                    </div>
                    <div class="velo-card-body">
                        <h4>${station.nom}</h4>
                        <div class="velo-info">
                            <i class="fas fa-bicycle"></i>
                            <span>${station.nb_places} places</span>
                        </div>
                        <div class="velo-info">
                            <i class="fas fa-lock"></i>
                            <span>${station.nb_arceaux} arceaux</span>
                        </div>
                        ${station.nom_rue ? `
                            <div class="velo-info">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${station.nom_rue}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${velos.length > 12 ? `
            <div class="load-more-container">
                <p>Affichage de 12 sur ${velos.length} stations</p>
            </div>
        ` : ''}
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💰 SECTION PLAN D'INVESTISSEMENT
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generatePPISection(ppi, pageIndex) {
    if (!ppi || ppi.length === 0) {
        return '<p>Aucune donnée d\'investissement disponible.</p>';
    }
    
    const totalInvest = ppi.reduce((sum, p) => sum + (p.montant_revalorise_a_date_de_juin_2025 || 0), 0);
    
    return `
        <div class="ppi-highlight">
            <div class="ppi-icon">💰</div>
            <div class="ppi-content">
                <h3>Plan Pluriannuel d'Investissement</h3>
                <div class="ppi-total">${(totalInvest / 1000000).toFixed(1)}M€</div>
                <p>Budget prévu 2026-2030</p>
            </div>
        </div>
        
        <div class="ppi-grid">
            ${ppi.map((operation, index) => {
                const montant = (operation.montant_revalorise_a_date_de_juin_2025 || 0) / 1000000;
                
                return `
                    <div class="ppi-card" style="animation-delay: ${index * 0.05}s;">
                        <div class="ppi-card-header">
                            <span class="ppi-badge ${operation.etat_d_avancement?.includes('cours') ? 'encours' : 'prete'}">${operation.etat_d_avancement}</span>
                        </div>
                        <div class="ppi-card-body">
                            <h4>${operation.operations}</h4>
                            <div class="ppi-info">
                                <i class="fas fa-tag"></i>
                                <span>${operation.typologie_operation}</span>
                            </div>
                            <div class="ppi-montant">
                                <span class="ppi-montant-value">${montant.toFixed(2)}M€</span>
                                <span class="ppi-montant-label">Budget</span>
                            </div>
                            ${operation.cofinancement ? `
                                <div class="ppi-info">
                                    <i class="fas fa-handshake"></i>
                                    <span>${operation.cofinancement}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ⚡ SECTION BORNES ÉLECTRIQUES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateBornesSection(bornes, pageIndex) {
    if (!bornes || bornes.length === 0) {
        return '<p>Aucune donnée de borne électrique disponible.</p>';
    }
    
    const favorable = bornes.filter(b => b.signal === 1).length;
    const defavorable = bornes.filter(b => b.signal === 0).length;
    
    return `
        <div class="bornes-stats">
            <div class="borne-stat-box favorable">
                <div class="borne-icon">✅</div>
                <div class="borne-value">${favorable}</div>
                <div class="borne-label">Favorable</div>
            </div>
            <div class="borne-stat-box defavorable">
                <div class="borne-icon">⚠️</div>
                <div class="borne-value">${defavorable}</div>
                <div class="borne-label">Défavorable</div>
            </div>
        </div>
        
        <div class="bornes-timeline">
            ${bornes.slice(0, 10).map((borne, index) => {
                const time = new Date(borne.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                
                return `
                    <div class="borne-item ${borne.signal === 1 ? 'favorable' : 'defavorable'}" style="animation-delay: ${index * 0.05}s;">
                        <div class="borne-time">${time}</div>
                        <div class="borne-status">
                            ${borne.signal === 1 ? '✅' : '⚠️'} ${borne.etat_du_systeme_electrique_pour_la_recharge}
                        </div>
                        <div class="borne-power">${borne.puissance_maximale}kW</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 GRAPHIQUES CHART.JS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function initTransportCharts(tranSud, car2A, train, parkings, ppi, velos, pageIndex) {
    // 1. Répartition des lignes
    const lignesCtx = document.getElementById(`chartLignes-${pageIndex}`);
    if (lignesCtx) {
        new Chart(lignesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Bus Corse-du-Sud', 'Bus Haute-Corse', 'Train'],
                datasets: [{
                    data: [tranSud?.length || 0, car2A?.length || 0, train?.length || 0],
                    backgroundColor: ['#f59e0b', '#d97706', '#3b82f6'],
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
    
    // 2. Parkings par type
    const parkingsCtx = document.getElementById(`chartParkings-${pageIndex}`);
    if (parkingsCtx && parkings) {
        const publics = parkings.filter(p => p.type_parking === 'public').length;
        const prives = parkings.length - publics;
        
        new Chart(parkingsCtx, {
            type: 'bar',
            data: {
                labels: ['Public', 'Privé'],
                datasets: [{
                    label: 'Nombre de parkings',
                    data: [publics, prives],
                    backgroundColor: ['#10b981', '#6b7280'],
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
    
    // 3. Investissements PPI
    const ppiCtx = document.getElementById(`chartPPI-${pageIndex}`);
    if (ppiCtx && ppi) {
        const top5 = ppi
            .sort((a, b) => (b.montant_revalorise_a_date_de_juin_2025 || 0) - (a.montant_revalorise_a_date_de_juin_2025 || 0))
            .slice(0, 5);
        
        new Chart(ppiCtx, {
            type: 'bar',
            data: {
                labels: top5.map(p => p.operations.split(' ').slice(0, 3).join(' ')),
                datasets: [{
                    label: 'Montant (M€)',
                    data: top5.map(p => (p.montant_revalorise_a_date_de_juin_2025 || 0) / 1000000),
                    backgroundColor: '#f59e0b',
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
    
    // 4. Stations vélo par type
    const veloCtx = document.getElementById(`chartVelo-${pageIndex}`);
    if (veloCtx && velos) {
        const types = {};
        velos.forEach(v => {
            types[v.type] = (types[v.type] || 0) + 1;
        });
        
        new Chart(veloCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(types),
                datasets: [{
                    data: Object.values(types),
                    backgroundColor: ['#67ce81ff', '#0e5518ff', '#c83434ff'],
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
}