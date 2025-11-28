/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CONCLUSION DASHBOARD COMPLET
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createConclusionDashboard(dataArray, pageIndex) {
    console.log('📊 === CRÉATION CONCLUSION ===');
    console.log('DataArray reçu:', dataArray);
    console.log('Page index:', pageIndex);
    
    // ═══════════════════════════════════════════════════════════════════════
    // 📦 COLLECTER TOUTES LES DONNÉES
    // ═══════════════════════════════════════════════════════════════════════
    
    const collectedData = {
        logement: { prixConstruction: [], donneesRegionales: [], equipements: [] },
        travail: { chomageParDiplome: [], pauvreteParAge: [], pauvreteLogement: [], csoProfessionnelles: [] },
        education: { annuaire: [], beneficiaires: [], personnel: [] },
        transport: { tranCorseSud: [], horaireCar2A: [], horaireGTF: [], parkings: [], ppi: [], bornesElec: [], stationsVelo: [] },
        seniors: { communesData: [], departementData: [] },
        sport: { terrainsSportifs: [] }
    };
    
    // Parcourir dataArray et collecter
    dataArray.forEach(dataObj => {
        // LOGEMENT
        if (dataObj["constructionrehabilitation_logementsocial_surface_prix"]) {
            collectedData.logement.prixConstruction = dataObj["constructionrehabilitation_logementsocial_surface_prix"] || [];
            collectedData.logement.donneesRegionales = dataObj["logements-et-logements-sociaux-dans-les-regions"] || [];
            collectedData.logement.equipements = dataObj["insee-log-t8m-confort-des-residences-principales"] || [];
        }
        
        // TRAVAIL
        if (dataObj["insee-emp-g2-taux-de-chomage-au-sens-du-recensement-des-15-64-ans-par-diplome-e0"]) {
            collectedData.travail.chomageParDiplome = dataObj["insee-emp-g2-taux-de-chomage-au-sens-du-recensement-des-15-64-ans-par-diplome-e0"] || [];
            collectedData.travail.pauvreteParAge = dataObj["insee-rev-g1-taux-de-pauvrete-par-tranche-d-age-du-referent-fiscal-en-2020"] || [];
            collectedData.travail.pauvreteLogement = dataObj["insee-rev-g2-taux-de-pauvrete-par-statut-d-occupation-du-logement-du-referent-fi"] || [];
            collectedData.travail.csoProfessionnelles = dataObj["insee-sal-g1-salaire-net-horaire-moyen-en-euros-selon-la-categorie-socioprofess0"] || [];
        }
        
        // ÉDUCATION
        if (dataObj["annuaire-de-leducation"]) {
            collectedData.education.annuaire = dataObj["annuaire-de-leducation"] || [];
            collectedData.education.beneficiaires = dataObj["les-beneficiaires-de-la-prime-d-excellence-scientifique"] || [];
            collectedData.education.personnel = dataObj["les-enseignants-titulaires-de-l-enseignement-superieur-public"] || [];
        }
        
        // TRANSPORT
        if (dataObj["gtfs-transport-horaires-cars-de-haute-corse"]) {
            collectedData.transport.tranCorseSud = dataObj["gtfs-transport-horaires-cars-de-haute-corse"] || [];
            collectedData.transport.horaireCar2A = dataObj["horaires-cars2a-gtfs"] || [];
            collectedData.transport.horaireGTF = dataObj["horaires-cfc-gtfs"] || [];
            collectedData.transport.parkings = dataObj["parking"] || [];
            collectedData.transport.ppi = dataObj["ppi-fer-2026-2030"] || [];
            collectedData.transport.bornesElec = dataObj["signal-reseau-corse-recharge-vehicule-electrique"] || [];
            collectedData.transport.stationsVelo = dataObj["stationnement_velo"] || [];
        }
        
        // SENIORS
        if (dataObj["60-et-plus_indicateurs-au-niveau-de-la-commune"]) {
            collectedData.seniors.communesData = dataObj["60-et-plus_indicateurs-au-niveau-de-la-commune"] || [];
            collectedData.seniors.departementData = dataObj["75-ans-et-plus-indicateurs-de-vieillissement-par-departement"] || [];
        }
        
        // SPORT
        if (dataObj["terrains-sportifs-en-corse"]) {
            collectedData.sport.terrainsSportifs = dataObj["terrains-sportifs-en-corse"] || [];
        }
    });
    
    console.log('✅ Données collectées:', collectedData);
    
    // Vérifier qu'on a au moins une donnée
    const hasData = Object.values(collectedData).some(section => {
        return Object.values(section).some(data => {
            if (Array.isArray(data)) return data.length > 0;
            return data !== null && data !== undefined;
        });
    });
    
    if (!hasData) {
        console.warn('⚠️ Aucune donnée disponible pour la conclusion');
        return `
            <div class="conclusion-no-data">
                <div class="no-data-icon">📊</div>
                <h2>Aucune donnée disponible</h2>
                <p>La page de conclusion affichera les graphiques une fois les données chargées.</p>
            </div>
        `;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 CRÉER LE HTML COMPLET
    // ═══════════════════════════════════════════════════════════════════════
    
    const html = `
        <div class="conclusion-dashboard">
            <!-- EN-TÊTE -->
            <div class="conclusion-header">
                <h2><i class="fas fa-chart-line"></i> Vue d'Ensemble - Analyses Statistiques</h2>
                <p>Synthèse graphique de toutes les données du territoire corse</p>
            </div>
            
            <!-- LOGEMENT -->
            ${collectedData.logement.prixConstruction.length > 0 ? window.renderLogementChartsSection(pageIndex) : ''}
            
            <!-- TRAVAIL -->
            ${collectedData.travail.chomageParDiplome.length > 0 ? window.renderTravailChartsSection(pageIndex) : ''}
            
            <!-- ÉDUCATION -->
            ${collectedData.education.annuaire.length > 0 ? window.renderEducationChartsSection(pageIndex) : ''}
            
            <!-- TRANSPORT -->
            ${collectedData.transport.tranCorseSud.length > 0 ? window.renderTransportChartsSection(pageIndex) : ''}
            
            <!-- SENIORS -->
            ${collectedData.seniors.communesData.length > 0 ? window.renderSeniorsChartsSection(pageIndex) : ''}
            
            <!-- SPORT -->
            ${collectedData.sport.terrainsSportifs.length > 0 ? window.renderSportChartsSection(pageIndex) : ''}
        </div>
    `;
    
    // ═══════════════════════════════════════════════════════════════════════
    // 📊 INITIALISER LES GRAPHIQUES
    // ═══════════════════════════════════════════════════════════════════════
    
    setTimeout(() => {
        console.log('🎨 Initialisation des graphiques de conclusion...');
        
        try {
            // LOGEMENT
            if (collectedData.logement.prixConstruction.length > 0) {
                initLogementChartsConclusion(collectedData.logement, pageIndex);
            }
            
            // TRAVAIL
            if (collectedData.travail.chomageParDiplome.length > 0) {
                initTravailChartsConclusion(collectedData.travail, pageIndex);
            }
            
            // ÉDUCATION
            if (collectedData.education.annuaire.length > 0) {
                initEducationChartsConclusion(collectedData.education, pageIndex);
            }
            
            // TRANSPORT
            if (collectedData.transport.tranCorseSud.length > 0) {
                initTransportChartsConclusion(collectedData.transport, pageIndex);
            }
            
            // SENIORS
            if (collectedData.seniors.communesData.length > 0) {
                initSeniorsChartsConclusion(collectedData.seniors, pageIndex);
            }
            
            // SPORT
            if (collectedData.sport.terrainsSportifs.length > 0) {
                initSportChartsConclusion(collectedData.sport, pageIndex);
            }
            
            console.log('✅ Tous les graphiques initialisés');
        } catch (error) {
            console.error('❌ Erreur initialisation graphiques:', error);
        }
    }, 500);
    
    return html;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎨 SECTIONS DE RENDU HTML (vos fonctions existantes + nouvelles)
 * ════════════════════════════════════════════════════════════════════════════════
 */

// LOGEMENT
window.renderLogementChartsSection = function(pageIndex) {
    return `
        <div class="logement-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-home"></i> Logement & Habitat
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsLogement-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsLogement-${pageIndex}" class="section-content">
                <div class="charts-grid">
                    <div class="chart-wrapper">
                        <h4>Évolution des Prix</h4>
                        <canvas id="chartLogementPrix-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Répartition Logements</h4>
                        <canvas id="chartLogementRepartition-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Types de Chauffage</h4>
                        <canvas id="chartLogementChauffage-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Social vs Privé</h4>
                        <canvas id="chartLogementSocial-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// TRAVAIL
window.renderTravailChartsSection = function(pageIndex) {
    return `
        <div class="travail-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-briefcase"></i> Travail & Emploi
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsTravail-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsTravail-${pageIndex}" class="section-content">
                <div class="charts-grid">
                    <div class="chart-wrapper">
                        <h4>Chômage par Diplôme</h4>
                        <canvas id="chartTravailChomage-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Pauvreté par Âge</h4>
                        <canvas id="chartTravailAge-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Pauvreté & Logement</h4>
                        <canvas id="chartTravailLogement-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Répartition CSP</h4>
                        <canvas id="chartTravailCSP-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ÉDUCATION (votre version existante)
window.renderEducationChartsSection = function(pageIndex) {
    return `
        <div class="education-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-graduation-cap"></i> Éducation
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsEducation-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsEducation-${pageIndex}" class="section-content">
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
};

// TRANSPORT (votre version existante)
window.renderTransportChartsSection = function(pageIndex) {
    return `
        <div class="transport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-bus"></i> Transport & Mobilité
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsTransport-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsTransport-${pageIndex}" class="section-content">
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
};

// SENIORS (votre version existante)
window.renderSeniorsChartsSection = function(pageIndex) {
    return `
        <div class="seniors-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-heart"></i> Bien Vieillir
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsSeniors-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsSeniors-${pageIndex}" class="section-content">
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
};

// SPORT (votre version existante)
window.renderSportChartsSection = function(pageIndex) {
    return `
        <div class="sport-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-futbol"></i> Sport & Infrastructures
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsSport-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsSport-${pageIndex}" class="section-content">
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
};

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 FONCTIONS D'INITIALISATION DES GRAPHIQUES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function initLogementChartsConclusion(data, pageIndex) {
    // Graphique 1 : Prix
    const ctx1 = document.getElementById(`chartLogementPrix-${pageIndex}`);
    if (ctx1 && data.prixConstruction.length > 0) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: data.prixConstruction.map(p => p.annee_signature),
                datasets: [{
                    label: 'Prix médian (€)',
                    data: data.prixConstruction.map(p => p.construction_prix_de_revient_median_des_operations_au_logement),
                    borderColor: '#10b981',
                    tension: 0.4
                }]
            }
        });
    }
    // Ajouter les autres graphiques...
}

function initTravailChartsConclusion(data, pageIndex) {
    // Implémentation similaire
}

function initEducationChartsConclusion(data, pageIndex) {
    // Implémentation similaire
}

function initTransportChartsConclusion(data, pageIndex) {
    // Implémentation similaire
}

function initSeniorsChartsConclusion(data, pageIndex) {
    // Implémentation similaire
}

function initSportChartsConclusion(data, pageIndex) {
    // Implémentation similaire
}