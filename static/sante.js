/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏥 DASHBOARD SANTÉ & BIEN-ÊTRE - CONCOURS DATAVIS
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createSanteDashboard(professionelsSante, structuresSociales, hopitaux, centresHospitaliers, pageIndex) {
    console.log('🏥 Création du dashboard santé pour page:', pageIndex);
    
    // Calcul des statistiques globales
    const stats = calculateSanteStats(professionelsSante, structuresSociales, hopitaux, centresHospitaliers);
    
    // Container principal
    const container = document.createElement('div');
    container.className = 'sante-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="sante-dashboard-header">
            <h2><i class="fas fa-heartbeat"></i> Santé </h2>
            <p>Vue d'ensemble de l'offre de soins et d'accompagnement social en Corse</p>
        </div>

        <!-- STATISTIQUES GLOBALES -->
        <div class="sante-stats-global">
            <div class="sante-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">👨‍⚕️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalProfessionnels}</div>
                    <div class="stat-label">Professionnels de Santé</div>
                </div>
            </div>
            
            <div class="sante-stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="stat-icon">🏥</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalHopitaux}</div>
                    <div class="stat-label">Établissements Hospitaliers</div>
                </div>
            </div>
            
            <div class="sante-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">🤝</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalStructures}</div>
                    <div class="stat-label">Structures Sociales</div>
                </div>
            </div>
            
            <div class="sante-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">📍</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalPoints}</div>
                    <div class="stat-label">Points de Service Total</div>
                </div>
            </div>
        </div>

        <!-- CARTE 3D GLOBALE -->
        <div class="sante-map-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-map-marked-alt"></i> Carte Interactive 3D
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('santeMap-${pageIndex}')">
                    <i class="fas fa-eye"></i> Masquer
                </button>
            </div>
            <div id="santeMap-${pageIndex}" class="sante-map-container">
                <div id="cesiumSante-${pageIndex}" class="cesium-sante-viewer"></div>
                <div class="map-legend-sante">
                    <h4><i class="fas fa-info-circle"></i> Légende</h4>
                    <div class="legend-items">
                        <div class="legend-item">
                            <span class="legend-marker" style="background: #10b981;">👨‍⚕️</span>
                            <span>Professionnels</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-marker" style="background: #3b82f6;">🏥</span>
                            <span>Hôpitaux</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-marker" style="background: #f59e0b;">🤝</span>
                            <span>Structures Sociales</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FILTRES RAPIDES -->
        <div class="sante-filters">
            <button class="filter-btn active" data-filter="all">
                <i class="fas fa-list"></i> Tous
            </button>
            <button class="filter-btn" data-filter="professionnels">
                <i class="fas fa-user-md"></i> Professionnels
            </button>
            <button class="filter-btn" data-filter="hopitaux">
                <i class="fas fa-hospital"></i> Hôpitaux
            </button>
            <button class="filter-btn" data-filter="social">
                <i class="fas fa-hands-helping"></i> Social
            </button>
        </div>

        <!-- SECTION PROFESSIONNELS DE SANTÉ -->
        <div class="sante-section" id="profSection-${pageIndex}">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-user-md"></i> Professionnels de Santé (${stats.totalProfessionnels})
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('profContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="profContent-${pageIndex}" class="section-content">
                ${generateProfessionnelsSection(professionelsSante, pageIndex)}
            </div>
        </div>

        <!-- SECTION HÔPITAUX -->
        <div class="sante-section" id="hopSection-${pageIndex}">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-hospital"></i> Établissements Hospitaliers (${stats.totalHopitaux})
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('hopContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="hopContent-${pageIndex}" class="section-content">
                ${generateHopitauxSection(hopitaux, centresHospitaliers, pageIndex)}
            </div>
        </div>

        <!-- SECTION STRUCTURES SOCIALES -->
        <div class="sante-section" id="socialSection-${pageIndex}">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-hands-helping"></i> Structures d'Accompagnement Social (${stats.totalStructures})
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('socialContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="socialContent-${pageIndex}" class="section-content">
                ${generateStructuresSocialesSection(structuresSociales, pageIndex)}
            </div>
        </div>

        <!-- ANALYSE GÉOGRAPHIQUE -->
        <div class="sante-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-chart-bar"></i> Répartition Géographique
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('geoAnalysis-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="geoAnalysis-${pageIndex}" class="section-content">
                <div class="charts-grid">
                    <div class="chart-wrapper">
                        <h4>Par Département</h4>
                        <canvas id="chartDept-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Par Type de Service</h4>
                        <canvas id="chartType-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        initSanteCesiumMap(professionelsSante, structuresSociales, hopitaux, centresHospitaliers, pageIndex);
        initSanteCharts(stats, pageIndex);
        initSanteFilters(pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CALCUL DES STATISTIQUES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateSanteStats(professionnels, structures, hopitaux, centres) {
    return {
        totalProfessionnels: professionnels.length,
        totalStructures: structures.length,
        totalHopitaux: hopitaux.length + centres.length,
        totalPoints: professionnels.length + structures.length + hopitaux.length + centres.length,
        parDepartement: calculateByDepartment(professionnels, structures, hopitaux, centres)
    };
}

function calculateByDepartment(professionnels, structures, hopitaux, centres) {
    const stats = { '2A': 0, '2B': 0 };
    
    // Compter professionnels
    professionnels.forEach(p => {
        if (p.dep_code === '2A') stats['2A']++;
        else if (p.dep_code === '2B') stats['2B']++;
    });
    
    // Compter structures
    structures.forEach(s => {
        const commune = s.commune?.toUpperCase() || '';
        if (commune.includes('AJACCIO') || commune.includes('PORTO')) stats['2A']++;
        else stats['2B']++;
    });
    
    // Compter hôpitaux (approximatif basé sur les coordonnées)
    [...hopitaux, ...centres].forEach(h => {
        const lat = h.geo_point_2d?.lat || 0;
        if (lat < 42.3) stats['2A']++;
        else stats['2B']++;
    });
    
    return stats;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👨‍⚕️ SECTION PROFESSIONNELS DE SANTÉ
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateProfessionnelsSection(data, pageIndex) {
    // Grouper par profession
    const parProfession = {};
    data.forEach(prof => {
        const profession = prof.libelle_profession || 'Non spécifié';
        if (!parProfession[profession]) {
            parProfession[profession] = [];
        }
        parProfession[profession].push(prof);
    });
    
    return `
        <div class="prof-stats-mini">
            <div class="mini-stat">
                <span class="mini-icon">📋</span>
                <span class="mini-value">${Object.keys(parProfession).length}</span>
                <span class="mini-label">Spécialités</span>
            </div>
            <div class="mini-stat">
                <span class="mini-icon">💶</span>
                <span class="mini-value">${calculateAverageTarif(data)}€</span>
                <span class="mini-label">Tarif Moyen</span>
            </div>
            <div class="mini-stat">
                <span class="mini-icon">🏥</span>
                <span class="mini-value">${countSecteur1(data)}</span>
                <span class="mini-label">Secteur 1</span>
            </div>
        </div>
        
        <div class="search-bar">
            <input type="text" id="searchProf-${pageIndex}" placeholder="🔍 Rechercher un professionnel, une commune..." class="search-input">
        </div>
        
        <div class="prof-grid" id="profGrid-${pageIndex}">
            ${data.slice(0, 20).map(prof => `
                <div class="prof-card" data-commune="${prof.commune}" data-profession="${prof.libelle_profession}">
                    <div class="prof-card-header">
                        <div class="prof-avatar">👨‍⚕️</div>
                        <div class="prof-info">
                            <h4>${prof.nom}</h4>
                            <span class="prof-profession">${prof.libelle_profession}</span>
                        </div>
                    </div>
                    <div class="prof-card-body">
                        <div class="prof-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${prof.commune} (${prof.dep_code})</span>
                        </div>
                        <div class="prof-detail">
                            <i class="fas fa-phone"></i>
                            <span>${prof.column_10 || 'Non renseigné'}</span>
                        </div>
                        <div class="prof-detail">
                            <i class="fas fa-stethoscope"></i>
                            <span>${prof.nom_acte || prof.libelle}</span>
                        </div>
                        <div class="prof-detail">
                            <i class="fas fa-euro-sign"></i>
                            <span>${prof.tarif_1 || prof.tarif_base_de_remboursement_securite_sociale || 'NC'}€</span>
                        </div>
                        ${prof.column_14 ? `
                            <div class="prof-badge" style="background: #10b981;">
                                ${prof.column_14}
                            </div>
                        ` : ''}
                    </div>
                    <div class="prof-card-footer">
                        <button class="btn-locate" onclick="flyToSante(${prof.coordonnees?.lat}, ${prof.coordonnees?.lon}, ${pageIndex})">
                            <i class="fas fa-map-marker-alt"></i> Localiser
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${data.length > 20 ? `
            <div class="load-more-container">
                <button class="btn-load-more" onclick="loadMoreProf(${pageIndex})">
                    <i class="fas fa-plus-circle"></i> Charger plus (${data.length - 20} restants)
                </button>
            </div>
        ` : ''}
    `;
}

function calculateAverageTarif(data) {
    const tarifs = data.map(d => parseFloat(d.tarif_1 || d.tarif_base_de_remboursement_securite_sociale || 0)).filter(t => t > 0);
    return tarifs.length > 0 ? (tarifs.reduce((a, b) => a + b, 0) / tarifs.length).toFixed(0) : 0;
}

function countSecteur1(data) {
    return data.filter(d => d.column_14?.includes('Secteur 1')).length;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏥 SECTION HÔPITAUX
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateHopitauxSection(hopitaux, centres, pageIndex) {
    const allHopitaux = [...hopitaux, ...centres];
    
    return `
        <div class="hopitaux-grid">
            ${allHopitaux.map(hop => `
                <div class="hopital-card">
                    <div class="hopital-header" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <span class="hopital-icon">🏥</span>
                        <h4>${hop.name}</h4>
                    </div>
                    <div class="hopital-body">
                        ${hop.operator_type ? `
                            <div class="hopital-badge" style="background: ${hop.operator_type === 'public' ? '#10b981' : '#f59e0b'};">
                                ${hop.operator_type === 'public' ? '🏛️ Public' : '🏢 Privé'}
                            </div>
                        ` : ''}
                        
                        ${hop.healthcare_speciality ? `
                            <div class="hopital-speciality">
                                <i class="fas fa-star"></i>
                                <span>Spécialité: ${hop.healthcare_speciality}</span>
                            </div>
                        ` : ''}
                        
                        ${hop.phone ? `
                            <div class="hopital-contact">
                                <i class="fas fa-phone"></i>
                                <a href="tel:${hop.phone}">${hop.phone}</a>
                            </div>
                        ` : ''}
                        
                        ${hop.website ? `
                            <div class="hopital-contact">
                                <i class="fas fa-globe"></i>
                                <a href="${hop.website}" target="_blank">Site web</a>
                            </div>
                        ` : ''}
                        
                        <div class="hopital-coords">
                            <i class="fas fa-map-pin"></i>
                            <span>${hop.geo_point_2d?.lat.toFixed(4)}°N, ${hop.geo_point_2d?.lon.toFixed(4)}°E</span>
                        </div>
                    </div>
                    <div class="hopital-footer">
                        <button class="btn-locate" onclick="flyToSante(${hop.geo_point_2d?.lat}, ${hop.geo_point_2d?.lon}, ${pageIndex})">
                            <i class="fas fa-map-marker-alt"></i> Localiser
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
window.loadMoreProf = function(pageIndex) {
    const grid = document.getElementById(`profGrid-${pageIndex}`);
    const button = document.querySelector(`#page-${pageIndex} .btn-load-more`);

    if (!grid) {
        console.error("Grid introuvable pour page :", pageIndex);
        return;
    }

    const alreadyLoaded = grid.children.length;
    const allCards = window.professionnelsData?.[pageIndex] || [];

    const nextItems = allCards.slice(alreadyLoaded, alreadyLoaded + 20);

    if (nextItems.length === 0) {
        button?.remove();
        return;
    }

    nextItems.forEach(prof => {
        const div = document.createElement("div");
        div.className = "prof-card";
        div.innerHTML = `
            <div class="prof-card-header">
                <div class="prof-avatar">👨‍⚕️</div>
                <div class="prof-info">
                    <h4>${prof.nom}</h4>
                    <span class="prof-profession">${prof.libelle_profession}</span>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });

    const remaining = allCards.length - grid.children.length;
    if (remaining <= 0) {
        button?.remove();
    } else {
        button.innerHTML = `<i class="fas fa-plus-circle"></i> Charger plus (${remaining} restants)`;
    }
};

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🤝 SECTION STRUCTURES SOCIALES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateStructuresSocialesSection(structures, pageIndex) {
    return `
        <div class="structures-grid">
            ${structures.map(struct => {
                const services = getServicesActifs(struct);
                
                return `
                    <div class="structure-card">
                        <div class="structure-header" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                            <span class="structure-icon">🤝</span>
                            <div>
                                <h4>${struct.nom}</h4>
                                <span class="structure-type">${struct.type_d_accueil}</span>
                            </div>
                        </div>
                        <div class="structure-body">
                            <div class="structure-info">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${struct.adresse}, ${struct.code_postal} ${struct.commune}</span>
                            </div>
                            
                            ${struct.telephone ? `
                                <div class="structure-info">
                                    <i class="fas fa-phone"></i>
                                    <a href="tel:${struct.telephone}">${struct.telephone}</a>
                                </div>
                            ` : ''}
                            
                            ${struct.courriel ? `
                                <div class="structure-info">
                                    <i class="fas fa-envelope"></i>
                                    <a href="mailto:${struct.courriel}">${struct.courriel}</a>
                                </div>
                            ` : ''}
                            
                            ${struct.horaires_d_ouverture ? `
                                <div class="structure-info">
                                    <i class="fas fa-clock"></i>
                                    <span>${struct.horaires_d_ouverture}</span>
                                </div>
                            ` : ''}
                            
                            ${services.length > 0 ? `
                                <div class="services-section">
                                    <h5><i class="fas fa-check-circle"></i> Services proposés:</h5>
                                    <div class="services-tags">
                                        ${services.map(service => `
                                            <span class="service-tag">${service}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <div class="structure-footer">
                            <button class="btn-locate" onclick="flyToSante(${struct.coord_1?.lat}, ${struct.coord_1?.lon}, ${pageIndex})">
                                <i class="fas fa-map-marker-alt"></i> Localiser
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getServicesActifs(struct) {
    const services = [];
    const mapping = {
        'hebergement_d_urgence': '🏠 Hébergement d\'urgence',
        'aide_alimentaire': '🍽️ Aide alimentaire',
        'offre_de_soins': '⚕️ Offre de soins',
        'accompagnement_et_prevention_pour_la_sante': '🏥 Prévention santé',
        'insertion_professionnelle': '💼 Insertion pro',
        'acces_aux_droits': '📋 Accès aux droits',
        'soutien_scolaire_et_insertion_sociale': '📚 Soutien scolaire',
        'accompagnement_a_la_parentalite': '👨‍👩‍👧 Parentalité'
    };
    
    Object.entries(mapping).forEach(([key, label]) => {
        if (struct[key] === 'oui') {
            services.push(label);
        }
    });
    
    return services;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗺️ CARTE CESIUM 3D
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function initSanteCesiumMap(professionnels, structures, hopitaux, centres,viewer, pageIndex) {
    const viewerElement = document.getElementById(`cesiumSante-${pageIndex}`);
    if (!viewerElement) return;
    
  
    
    // Stocker le viewer
    if (!window.cesiumViewers) window.cesiumViewers = {};
    window.cesiumViewers[pageIndex] = viewer;
    
    // Ajouter les professionnels (vert)
    professionnels.forEach(prof => {
        if (prof.coordonnees?.lat && prof.coordonnees?.lon) {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(prof.coordonnees.lon, prof.coordonnees.lat),
                billboard: {
                    image: createMarkerCanvas('👨‍⚕️', '#10b981'),
                    scale: 0.8,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                label: {
                    text: prof.nom,
                    font: 'bold 14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -40),
                    show: false
                },
                description: createProfDescription(prof)
            });
        }
    });
    
    // Ajouter les hôpitaux (bleu)
    [...hopitaux, ...centres].forEach(hop => {
        if (hop.geo_point_2d?.lat && hop.geo_point_2d?.lon) {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(hop.geo_point_2d.lon, hop.geo_point_2d.lat),
                billboard: {
                    image: createMarkerCanvas('🏥', '#3b82f6'),
                    scale: 1.0,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                label: {
                    text: hop.name,
                    font: 'bold 14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -40),
                    show: false
                },
                description: createHopitalDescription(hop)
            });
        }
    });
    
    // Ajouter les structures sociales (orange)
    structures.forEach(struct => {
        if (struct.coord_1?.lat && struct.coord_1?.lon) {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(struct.coord_1.lon, struct.coord_1.lat),
                billboard: {
                    image: createMarkerCanvas('🤝', '#f59e0b'),
                    scale: 0.9,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                label: {
                    text: struct.nom,
                    font: 'bold 14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -40),
                    show: false
                },
                description: createStructureDescription(struct)
            });
        }
    });
    
    // Vue sur la Corse
     viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(9.5, 41.5, 2500000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0
        },
        duration: 1
    });
}

/**
 * Créer un marqueur canvas personnalisé
 */
function createMarkerCanvas(emoji, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Fond du marqueur
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(24, 20, 20, 0, Math.PI * 2);
    ctx.moveTo(24, 40);
    ctx.lineTo(14, 56);
    ctx.quadraticCurveTo(24, 64, 34, 56);
    ctx.closePath();
    ctx.fill();
    
    // Bordure
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Emoji
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 24, 20);
    
    return canvas.toDataURL();
}

/**
 * Descriptions HTML pour les entités
 */
function createProfDescription(prof) {
    return `
        <div class="cesium-popup">
            <h3>${prof.nom}</h3>
            <p><strong>${prof.libelle_profession}</strong></p>
            <p>${prof.commune} (${prof.dep_code})</p>
            ${prof.column_10 ? `<p>📞 ${prof.column_10}</p>` : ''}
            ${prof.column_14 ? `<p>💼 ${prof.column_14}</p>` : ''}
        </div>
    `;
}

function createHopitalDescription(hop) {
    return `
        <div class="cesium-popup">
            <h3>${hop.name}</h3>
            ${hop.operator_type ? `<p>${hop.operator_type === 'public' ? '🏛️ Public' : '🏢 Privé'}</p>` : ''}
            ${hop.phone ? `<p>📞 ${hop.phone}</p>` : ''}
            ${hop.website ? `<p><a href="${hop.website}" target="_blank">🌐 Site web</a></p>` : ''}
        </div>
    `;
}

function createStructureDescription(struct) {
    const services = getServicesActifs(struct);
    return `
        <div class="cesium-popup">
            <h3>${struct.nom}</h3>
            <p><strong>${struct.type_d_accueil}</strong></p>
            <p>${struct.commune}</p>
            ${struct.telephone ? `<p>📞 ${struct.telephone}</p>` : ''}
            ${services.length > 0 ? `<p>Services: ${services.join(', ')}</p>` : ''}
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 GRAPHIQUES CHART.JS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function initSanteCharts(stats, pageIndex) {
    // Graphique par département
    const deptCtx = document.getElementById(`chartDept-${pageIndex}`);
    if (deptCtx) {
        new Chart(deptCtx, {
            type: 'bar',
            data: {
                labels: ['Corse-du-Sud (2A)', 'Haute-Corse (2B)'],
                datasets: [{
                    label: 'Nombre de points de service',
                    data: [stats.parDepartement['2A'], stats.parDepartement['2B']],
                    backgroundColor: ['#3b82f6', '#ec4899'],
                    borderWidth: 2,
                    borderColor: ['#2563eb', '#db2777']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Graphique par type
    const typeCtx = document.getElementById(`chartType-${pageIndex}`);
    if (typeCtx) {
        new Chart(typeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Professionnels', 'Hôpitaux', 'Structures Sociales'],
                datasets: [{
                    data: [stats.totalProfessionnels, stats.totalHopitaux, stats.totalStructures],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎛️ FONCTION TOGGLE SECTIONS
 * ════════════════════════════════════════════════════════════════════════════════
 */

window.toggleSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    const btn = event.target.closest('.toggle-section-btn');
    
    if (section.style.display === 'none') {
        section.style.display = '';
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Réduire';
    } else {
        section.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Afficher';
    }
};

/**
 * Fonction de vol vers un point de santé
 */
window.flyToSante = function(lat, lon, pageIndex, height = 20000) {
    const viewer = window.cesiumViewers[pageIndex];
    if (!viewer || !lat || !lon) return;
    
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0
        },
        duration: 2
    });
};

/**
 * Filtres
 */
function initSanteFilters(pageIndex) {
    const filterButtons = document.querySelectorAll('.sante-filters .filter-btn');

    const sectionMap = {
        professionnels: 'profSection',
        hopitaux: 'hopSection',
        social: 'socialSection'
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            Object.values(sectionMap).forEach(sectionId => {
                const section = document.getElementById(`${sectionId}-${pageIndex}`);
                if (!section) return;

                if (filter === 'all') {
                    section.style.display = '';
                } else if (sectionMap[filter] === sectionId) {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}
