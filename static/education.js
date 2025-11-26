/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎓 DASHBOARD ÉDUCATION 
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createEducationDashboard(annuaire, beneficiaires, personnel, pageIndex) {
    console.log('🎓 Création du dashboard éducation pour page:', pageIndex);
    
    const stats = calculateEducationStats(annuaire, beneficiaires, personnel);
    
    const container = document.createElement('div');
    container.className = 'education-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="education-dashboard-header">
            <h2><i class="fas fa-graduation-cap"></i> Éducation en Corse</h2>
            <p>Établissements, personnel enseignant et enseignement supérieur</p>
        </div>

        <!-- STATS GLOBALES -->
        <div class="education-stats-global">
            <div class="education-stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="stat-icon">🏫</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalEtablissements}</div>
                    <div class="stat-label">Établissements</div>
                    <div class="stat-detail">${stats.publics} publics, ${stats.prives} privés</div>
                </div>
            </div>
            
            <div class="education-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">👨‍🏫</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalPersonnel}</div>
                    <div class="stat-label">Enseignants</div>
                    <div class="stat-detail">Toutes catégories</div>
                </div>
            </div>
            
            <div class="education-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">🎓</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.colleges}</div>
                    <div class="stat-label">Collèges</div>
                    <div class="stat-detail">${stats.lycees} lycées</div>
                </div>
            </div>
            
            <div class="education-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">🏛️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.beneficiairesUniv}</div>
                    <div class="stat-label">Bénéficiaires Univ.</div>
                    <div class="stat-detail">Université de Corse</div>
                </div>
            </div>
        </div>

        <!-- INSIGHT BANNER -->
        <div class="insight-banner">
            <div class="insight-icon">💡</div>
            <div class="insight-text">
                <strong>Réseau dense :</strong> ${stats.totalEtablissements} établissements répartis sur le territoire. 
                ${Math.round(stats.publics / stats.totalEtablissements * 100)}% sont publics.
            </div>
        </div>

        <!-- CARTE CESIUM -->
        <div class="education-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-map-marked-alt"></i> Carte des Établissements
                </h3>
                <div class="map-controls">
                    <button class="map-control-btn" onclick="clearMap(${pageIndex})">
                        <i class="fas fa-eraser"></i> Vider
                    </button>
                    <button class="map-control-btn" onclick="showEducationOnMap(${pageIndex})">
                        <i class="fas fa-eye"></i> Afficher
                    </button>
                    <button class="toggle-section-btn" onclick="toggleSection('mapContent-${pageIndex}')">
                        <i class="fas fa-chevron-down"></i> Réduire
                    </button>
                </div>
            </div>
            <div id="mapContent-${pageIndex}" class="section-content">
                <p class="section-intro">📍 Cliquez sur "Afficher" pour voir tous les établissements sur la carte 3D.</p>
                <div class="education-map-container">
                    <div id="cesiumEducation-${pageIndex}" class="cesium-education-viewer"></div>
                    <div class="map-legend-education">
                        <h4><i class="fas fa-info-circle"></i> Légende</h4>
                        <div class="legend-items">
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #3b82f6;">🏫</span>
                                <span>Collèges</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #10b981;">🎓</span>
                                <span>Lycées</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-marker" style="background: #f59e0b;">🏛️</span>
                                <span>Universités</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION ÉTABLISSEMENTS -->
        <div class="education-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-school"></i> Établissements Scolaires
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('etablContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="etablContent-${pageIndex}" class="section-content">
                <p class="section-intro">🏫 ${stats.totalEtablissements} établissements du primaire au supérieur.</p>
                ${generateEtablissementsSection(annuaire, pageIndex)}
            </div>
        </div>

        <!-- SECTION PERSONNEL -->
        <div class="education-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-chalkboard-teacher"></i> Personnel Enseignant
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('personnelContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="personnelContent-${pageIndex}" class="section-content">
                <p class="section-intro">👨‍🏫 Répartition du personnel par discipline et catégorie.</p>
                ${generatePersonnelSection(personnel, pageIndex)}
            </div>
        </div>

        <!-- SECTION UNIVERSITÉ -->
        <div class="education-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-university"></i> Enseignement Supérieur
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('univContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="univContent-${pageIndex}" class="section-content">
                <p class="section-intro">🎓 Université de Corse - Pasquale Paoli.</p>
                ${generateUniversiteSection(beneficiaires, pageIndex)}
            </div>
        </div>

        <!-- GRAPHIQUES -->
        <div class="education-section">
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
                        <h4>Types d'Établissements</h4>
                        <canvas id="chartEtab-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Public vs Privé</h4>
                        <canvas id="chartStatut-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Personnel par Discipline</h4>
                        <canvas id="chartDiscipline-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Répartition Hommes/Femmes</h4>
                        <canvas id="chartGenre-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        initEducationCesiumMap(pageIndex);
        storeEducationData(annuaire, beneficiaires, personnel, pageIndex);
        initEducationCharts(annuaire, beneficiaires, personnel, pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CALCUL DES STATS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateEducationStats(annuaire, beneficiaires, personnel) {
    const publics = annuaire.filter(e => e.statut_public_prive === 'Public').length;
    const prives = annuaire.filter(e => e.statut_public_prive === 'Privé').length;
    const colleges = annuaire.filter(e => e.type_etablissement === 'Collège').length;
    const lycees = annuaire.filter(e => e.type_etablissement?.includes('Lycée')).length;
    const totalPersonnel = personnel.reduce((sum, p) => sum + (p.effectif || 0), 0);
    
    return {
        totalEtablissements: annuaire.length,
        publics,
        prives,
        colleges,
        lycees,
        totalPersonnel,
        beneficiairesUniv: beneficiaires.length
    };
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗺️ GESTION CESIUM
 * ════════════════════════════════════════════════════════════════════════════════
 */

// Stocker les données globalement pour chaque page
if (!window.educationDataStore) window.educationDataStore = {};

function storeEducationData(annuaire, beneficiaires, personnel, pageIndex) {
    window.educationDataStore[pageIndex] = {
        annuaire,
        beneficiaires,
        personnel
    };
}

export function initEducationCesiumMap(viewer,pageIndex) {
    const viewerElement = document.getElementById(`cesiumEducation-${pageIndex}`);
    if (!viewerElement) return;
    
  
    
    // Stocker le viewer
    if (!window.cesiumViewers) window.cesiumViewers = {};
    window.cesiumViewers[`education-${pageIndex}`] = viewer;
    
    // Vue sur la Corse
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(9.0, 42.15, 150000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0
        },
        duration: 1
    });
}



/**
 * AFFICHER LES DONNÉES SUR LA CARTE
 */
window.showEducationOnMap = function(pageIndex) {
    const viewer = window.cesiumViewers[`education-${pageIndex}`];
    const data = window.educationDataStore[pageIndex];
    
    if (!viewer || !data) {
        console.error('❌ Viewer ou données non disponibles');
        return;
    }
    
    console.log('📍 Affichage des établissements...');
    
    // Vider d'abord
    viewer.entities.removeAll();
    
    const { annuaire, beneficiaires } = data;
    let count = 0;
    
    // Ajouter les établissements
    annuaire.forEach(etab => {
        if (etab.position?.lat && etab.position?.lon) {
            const color = getEtablissementColor(etab.type_etablissement);
            const icon = getEtablissementIcon(etab.type_etablissement);
            
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(etab.position.lon, etab.position.lat),
                billboard: {
                    image: createMarkerCanvas(icon, color),
                    scale: 0.7,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: etab.nom_etablissement,
                    font: 'bold 12px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -35),
                    show: false
                },
                description: createEtablissementDescription(etab)
            });
            count++;
        }
    });
    
    // Ajouter l'université
    beneficiaires.forEach(univ => {
        if (univ.geo_localisation?.lat && univ.geo_localisation?.lon) {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(univ.geo_localisation.lon, univ.geo_localisation.lat),
                billboard: {
                    image: createMarkerCanvas('🎓', '#f59e0b'),
                    scale: 1.0,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: univ.etablissement || 'Université de Corse',
                    font: 'bold 14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -40),
                    show: false
                },
                description: createUnivDescription(univ)
            });
            count++;
        }
    });
    
    // Feedback visuel
    const btn = event.target.closest('.map-control-btn');
    if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check"></i> ${count} affichés !`;
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    }
    
    console.log(`✅ ${count} établissements affichés`);
};

function getEtablissementColor(type) {
    if (type?.includes('Collège')) return '#3b82f6';
    if (type?.includes('Lycée')) return '#10b981';
    if (type?.includes('Université')) return '#f59e0b';
    return '#6b7280';
}

function getEtablissementIcon(type) {
    if (type?.includes('Collège')) return '🏫';
    if (type?.includes('Lycée')) return '🎓';
    if (type?.includes('Université')) return '🏛️';
    return '📚';
}

function createMarkerCanvas(emoji, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Fond
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

function createEtablissementDescription(etab) {
    return `
        <div class="cesium-popup">
            <h3>${etab.nom_etablissement}</h3>
            <p><strong>${etab.type_etablissement}</strong> - ${etab.statut_public_prive}</p>
            <p>${etab.adresse_1}, ${etab.code_postal} ${etab.nom_commune}</p>
            ${etab.telephone ? `<p>📞 ${etab.telephone}</p>` : ''}
            ${etab.web ? `<p><a href="${etab.web}" target="_blank">🌐 Site web</a></p>` : ''}
        </div>
    `;
}

function createUnivDescription(univ) {
    return `
        <div class="cesium-popup">
            <h3>${univ.etablissement}</h3>
            <p><strong>${univ.secteur_disciplinaire}</strong></p>
            <p>${univ.groupe_de_corps}</p>
            <p>Année: ${univ.annee}</p>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏫 SECTION ÉTABLISSEMENTS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateEtablissementsSection(annuaire, pageIndex) {
    // Filtrer et limiter
    const displayed = annuaire.slice(0, 12);
    
    return `
        <div class="etabl-filters">
            <button class="filter-btn active" data-filter="all">Tous</button>
            <button class="filter-btn" data-filter="Collège">Collèges</button>
            <button class="filter-btn" data-filter="Lycée">Lycées</button>
            <button class="filter-btn" data-filter="Public">Public</button>
            <button class="filter-btn" data-filter="Privé">Privé</button>
        </div>
        
        <div class="etabl-grid">
            ${displayed.map((etab, index) => `
                <div class="etabl-card" data-type="${etab.type_etablissement}" data-statut="${etab.statut_public_prive}" style="animation-delay: ${index * 0.05}s;">
                    <div class="etabl-header" style="background: ${getEtablissementColor(etab.type_etablissement)};">
                        <span class="etabl-icon">${getEtablissementIcon(etab.type_etablissement)}</span>
                        <span class="etabl-type">${etab.type_etablissement}</span>
                    </div>
                    <div class="etabl-body">
                        <h4>${etab.nom_etablissement}</h4>
                        <div class="etabl-info">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${etab.nom_commune}</span>
                        </div>
                        <div class="etabl-info">
                            <i class="fas fa-building"></i>
                            <span>${etab.statut_public_prive}</span>
                        </div>
                        ${etab.telephone ? `
                            <div class="etabl-info">
                                <i class="fas fa-phone"></i>
                                <span>${etab.telephone}</span>
                            </div>
                        ` : ''}
                        ${etab.web ? `
                            <div class="etabl-info">
                                <i class="fas fa-globe"></i>
                                <a href="${etab.web}" target="_blank">Site web</a>
                            </div>
                        ` : ''}
                    </div>
                    ${etab.position?.lat ? `
                        <div class="etabl-footer">
                            <button class="btn-locate" onclick="flyToEducation(${etab.position.lat}, ${etab.position.lon}, ${pageIndex})">
                                <i class="fas fa-map-marker-alt"></i> Localiser
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        
        ${annuaire.length > 12 ? `
            <div class="load-more-container">
                <p>Affichage de 12 sur ${annuaire.length} établissements</p>
            </div>
        ` : ''}
    `;
}

/**
 * VOL VERS UN ÉTABLISSEMENT
 */
window.flyToEducation = function(lat, lon, pageIndex, height = 2000) {
    const viewer = window.cesiumViewers[`education-${pageIndex}`];
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
 * ════════════════════════════════════════════════════════════════════════════════
 * 👨‍🏫 SECTION PERSONNEL ENSEIGNANT
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generatePersonnelSection(personnel, pageIndex) {
    // Agréger par discipline
    const parDiscipline = {};
    personnel.forEach(p => {
        const discipline = p.grande_discipline || 'Non spécifié';
        if (!parDiscipline[discipline]) {
            parDiscipline[discipline] = { total: 0, hommes: 0, femmes: 0 };
        }
        parDiscipline[discipline].total += p.effectif || 0;
        if (p.sexe === 'Homme') parDiscipline[discipline].hommes += p.effectif || 0;
        if (p.sexe === 'Femme') parDiscipline[discipline].femmes += p.effectif || 0;
    });
    
    // Convertir en array et trier
    const disciplines = Object.entries(parDiscipline)
        .map(([nom, data]) => ({ nom, ...data }))
        .sort((a, b) => b.total - a.total);
    
    return `
        <div class="personnel-stats">
            <div class="personnel-stat-box">
                <div class="personnel-icon">👨‍🏫</div>
                <div class="personnel-value">${personnel.reduce((s, p) => s + (p.effectif || 0), 0)}</div>
                <div class="personnel-label">Total Enseignants</div>
            </div>
            <div class="personnel-stat-box">
                <div class="personnel-icon">📚</div>
                <div class="personnel-value">${Object.keys(parDiscipline).length}</div>
                <div class="personnel-label">Disciplines</div>
            </div>
            <div class="personnel-stat-box">
                <div class="personnel-icon">🎓</div>
                <div class="personnel-value">${disciplines[0]?.nom.split(' ')[0]}</div>
                <div class="personnel-label">Discipline Principale</div>
            </div>
        </div>
        
        <div class="personnel-grid">
            ${disciplines.slice(0, 6).map((disc, index) => {
                const pourcentageFemmes = disc.total > 0 ? (disc.femmes / disc.total * 100).toFixed(0) : 0;
                const pourcentageHommes = disc.total > 0 ? (disc.hommes / disc.total * 100).toFixed(0) : 0;
                
                return `
                    <div class="personnel-card" style="animation-delay: ${index * 0.1}s;">
                        <div class="personnel-card-header">
                            <span class="personnel-discipline-icon">${getDisciplineIcon(disc.nom)}</span>
                            <h4>${disc.nom}</h4>
                        </div>
                        <div class="personnel-card-body">
                            <div class="personnel-total">${disc.total} enseignants</div>
                            <div class="personnel-repartition">
                                <div class="repartition-row">
                                    <span class="repartition-label">👨 Hommes</span>
                                    <span class="repartition-value">${disc.hommes}</span>
                                    <span class="repartition-percent">${pourcentageHommes}%</span>
                                </div>
                                <div class="repartition-row">
                                    <span class="repartition-label">👩 Femmes</span>
                                    <span class="repartition-value">${disc.femmes}</span>
                                    <span class="repartition-percent">${pourcentageFemmes}%</span>
                                </div>
                            </div>
                            <div class="personnel-gender-bar">
                                <div class="gender-bar-m" style="width: ${pourcentageHommes}%;" title="Hommes: ${pourcentageHommes}%"></div>
                                <div class="gender-bar-f" style="width: ${pourcentageFemmes}%;" title="Femmes: ${pourcentageFemmes}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        ${disciplines.length > 6 ? `
            <div class="load-more-container">
                <p>Affichage de 6 sur ${disciplines.length} disciplines</p>
            </div>
        ` : ''}
    `;
}

function getDisciplineIcon(discipline) {
    if (discipline.includes('Sciences')) return '🔬';
    if (discipline.includes('Lettres')) return '📖';
    if (discipline.includes('Droit')) return '⚖️';
    if (discipline.includes('Économie')) return '💰';
    if (discipline.includes('STAPS')) return '⚽';
    if (discipline.includes('Santé')) return '⚕️';
    return '📚';
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎓 SECTION UNIVERSITÉ
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateUniversiteSection(beneficiaires, pageIndex) {
    // Agréger par secteur disciplinaire
    const parSecteur = {};
    beneficiaires.forEach(b => {
        const secteur = b.secteur_disciplinaire || 'Non spécifié';
        if (!parSecteur[secteur]) {
            parSecteur[secteur] = { total: 0, hommes: 0, femmes: 0 };
        }
        parSecteur[secteur].total += b.beneficiaires || 1;
        if (b.sexe === 'Hommes') parSecteur[secteur].hommes += b.beneficiaires || 1;
        if (b.sexe === 'Femmes') parSecteur[secteur].femmes += b.beneficiaires || 1;
    });
    
    const secteurs = Object.entries(parSecteur)
        .map(([nom, data]) => ({ nom, ...data }))
        .sort((a, b) => b.total - a.total);
    
    // Agréger par année
    const parAnnee = {};
    beneficiaires.forEach(b => {
        const annee = b.annee || 'N/A';
        parAnnee[annee] = (parAnnee[annee] || 0) + (b.beneficiaires || 1);
    });
    
    return `
        <div class="univ-header-card">
            <div class="univ-logo">🏛️</div>
            <div class="univ-info">
                <h3>Université de Corse - Pasquale Paoli</h3>
                <p>Établissement public d'enseignement supérieur et de recherche</p>
                <div class="univ-stats-mini">
                    <span><strong>${beneficiaires.length}</strong> bénéficiaires</span>
                    <span><strong>${Object.keys(parSecteur).length}</strong> secteurs</span>
                    <span><strong>${Object.keys(parAnnee).length}</strong> années</span>
                </div>
            </div>
        </div>
        
        <h4 class="subsection-title"><i class="fas fa-chart-pie"></i> Bénéficiaires par Secteur Disciplinaire</h4>
        <div class="secteur-grid">
            ${secteurs.map((secteur, index) => `
                <div class="secteur-card" style="animation-delay: ${index * 0.1}s;">
                    <div class="secteur-icon">${getSecteurIcon(secteur.nom)}</div>
                    <h5>${secteur.nom}</h5>
                    <div class="secteur-total">${secteur.total}</div>
                    <div class="secteur-details">
                        <span class="secteur-detail homme">👨 ${secteur.hommes}</span>
                        <span class="secteur-detail femme">👩 ${secteur.femmes}</span>
                    </div>
                    <div class="secteur-bar">
                        <div class="secteur-bar-h" style="width: ${(secteur.hommes / secteur.total * 100)}%;"></div>
                        <div class="secteur-bar-f" style="width: ${(secteur.femmes / secteur.total * 100)}%;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <h4 class="subsection-title"><i class="fas fa-calendar"></i> Évolution Temporelle</h4>
        <div class="annee-timeline">
            ${Object.entries(parAnnee).sort(([a], [b]) => a.localeCompare(b)).map(([annee, count]) => `
                <div class="timeline-year-item">
                    <div class="timeline-year">${annee}</div>
                    <div class="timeline-bar-container">
                        <div class="timeline-bar" style="width: ${(count / Math.max(...Object.values(parAnnee))) * 100}%;">
                            ${count}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getSecteurIcon(secteur) {
    if (secteur.includes('Sciences')) return '🔬';
    if (secteur.includes('Lettres')) return '📖';
    if (secteur.includes('Droit')) return '⚖️';
    if (secteur.includes('Économie')) return '💼';
    if (secteur.includes('STAPS')) return '⚽';
    if (secteur.includes('Santé')) return '⚕️';
    return '🎓';
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 GRAPHIQUES CHART.JS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function initEducationCharts(annuaire, beneficiaires, personnel, pageIndex) {
    // 1. Types d'établissements
    const etabCtx = document.getElementById(`chartEtab-${pageIndex}`);
    if (etabCtx) {
        const types = {};
        annuaire.forEach(e => {
            const type = e.type_etablissement || 'Autre';
            types[type] = (types[type] || 0) + 1;
        });
        
        new Chart(etabCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(types),
                datasets: [{
                    data: Object.values(types),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
    
    // 2. Public vs Privé
    const statutCtx = document.getElementById(`chartStatut-${pageIndex}`);
    if (statutCtx) {
        const publics = annuaire.filter(e => e.statut_public_prive === 'Public').length;
        const prives = annuaire.filter(e => e.statut_public_prive === 'Privé').length;
        
        new Chart(statutCtx, {
            type: 'bar',
            data: {
                labels: ['Public', 'Privé'],
                datasets: [{
                    label: "Nombre d'établissements",
                    data: [publics, prives],
                    backgroundColor: ['#3b82f6', '#10b981'],
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
    
    // 3. Personnel par discipline
    const disciplineCtx = document.getElementById(`chartDiscipline-${pageIndex}`);
    if (disciplineCtx) {
        const disciplines = {};
        personnel.forEach(p => {
            const disc = p.grande_discipline || 'Non spécifié';
            disciplines[disc] = (disciplines[disc] || 0) + (p.effectif || 0);
        });
        
        const top5 = Object.entries(disciplines)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
        
        new Chart(disciplineCtx, {
            type: 'bar',
            data: {
                labels: top5.map(([nom]) => nom.split(' ').slice(0, 2).join(' ')),
                datasets: [{
                    label: 'Effectifs',
                    data: top5.map(([, val]) => val),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
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
    
    // 4. Répartition Hommes/Femmes
    const genreCtx = document.getElementById(`chartGenre-${pageIndex}`);
    if (genreCtx) {
        let hommes = 0, femmes = 0;
        personnel.forEach(p => {
            if (p.sexe === 'Homme') hommes += p.effectif || 0;
            if (p.sexe === 'Femme') femmes += p.effectif || 0;
        });
        
        new Chart(genreCtx, {
            type: 'pie',
            data: {
                labels: ['Hommes', 'Femmes'],
                datasets: [{
                    data: [hommes, femmes],
                    backgroundColor: ['#3b82f6', '#ec4899'],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}