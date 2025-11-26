/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏠 DASHBOARD LOGEMENT - CONCOURS DATAVIS
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createLogementDashboard(prixConstruction, donneesRegionales, equipements, pageIndex) {
    console.log('🏠 Création du dashboard logement pour page:', pageIndex);
    
    // Calcul des statistiques
    const stats = calculateLogementStats(prixConstruction, donneesRegionales, equipements);
    
    const container = document.createElement('div');
    container.className = 'logement-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="logement-dashboard-header">
            <h2><i class="fas fa-home"></i> Logement & Habitat en Corse</h2>
            <p>Analyse complète du parc immobilier, des prix et du confort des logements</p>
        </div>

        <!-- STATISTIQUES GLOBALES -->
        <div class="logement-stats-global">
            <div class="logement-stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="stat-icon">🏘️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalLogements.toLocaleString()}</div>
                    <div class="stat-label">Logements Totaux</div>
                    <div class="stat-detail">dont ${stats.residencesPrincipales.toLocaleString()} résidences principales</div>
                </div>
            </div>
            
            <div class="logement-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">💶</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.prixMedian.toLocaleString()}€</div>
                    <div class="stat-label">Prix Médian au Logement</div>
                    <div class="stat-detail">${stats.prixM2.toLocaleString()}€/m²</div>
                </div>
            </div>
            
            <div class="logement-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">🏗️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.constructionNeuve.toLocaleString()}</div>
                    <div class="stat-label">Construction Neuve/an</div>
                    <div class="stat-detail">Moyenne sur 10 ans</div>
                </div>
            </div>
            
            <div class="logement-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">🏛️</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.tauxSocial}%</div>
                    <div class="stat-label">Logements Sociaux</div>
                    <div class="stat-detail">${stats.logementsociaux.toLocaleString()} logements</div>
                </div>
            </div>
        </div>

        <!-- INDICATEURS CLÉS -->
        <div class="indicateurs-section">
            <div class="indicateur-box">
                <div class="indicateur-icon" style="background: #ef4444;">📊</div>
                <div class="indicateur-content">
                    <div class="indicateur-value">${stats.tauxVacants}%</div>
                    <div class="indicateur-label">Taux de Vacance</div>
                </div>
            </div>
            <div class="indicateur-box">
                <div class="indicateur-icon" style="background: #06b6d4;">🏡</div>
                <div class="indicateur-content">
                    <div class="indicateur-value">${stats.tauxIndividuels}%</div>
                    <div class="indicateur-label">Logements Individuels</div>
                </div>
            </div>
            <div class="indicateur-box">
                <div class="indicateur-icon" style="background: #ec4899;">⚡</div>
                <div class="indicateur-content">
                    <div class="indicateur-value">${stats.chauffageElec}%</div>
                    <div class="indicateur-label">Chauffage Électrique</div>
                </div>
            </div>
            <div class="indicateur-box">
                <div class="indicateur-icon" style="background: #10b981;">🌡️</div>
                <div class="indicateur-content">
                    <div class="indicateur-value">${stats.tauxEnergivores}%</div>
                    <div class="indicateur-label">Logements Énergivores</div>
                </div>
            </div>
        </div>

        <!-- SECTION PRIX DE L'IMMOBILIER -->
        <div class="logement-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-euro-sign"></i> Prix de l'Immobilier
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('prixContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="prixContent-${pageIndex}" class="section-content">
                ${generatePrixSection(prixConstruction, pageIndex)}
            </div>
        </div>

        <!-- SECTION ÉVOLUTION TEMPORELLE -->
        <div class="logement-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-chart-line"></i> Évolution du Parc de Logements (2009-2020)
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('evolutionContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="evolutionContent-${pageIndex}" class="section-content">
                ${generateEvolutionSection(equipements, pageIndex)}
            </div>
        </div>

        <!-- SECTION CONFORT & ÉQUIPEMENTS -->
        <div class="logement-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-bath"></i> Confort & Équipements des Logements
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('confortContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="confortContent-${pageIndex}" class="section-content">
                ${generateConfortSection(equipements, pageIndex)}
            </div>
        </div>

        <!-- SECTION PARC SOCIAL -->
        <div class="logement-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-building"></i> Parc de Logements Sociaux
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('socialContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="socialContent-${pageIndex}" class="section-content">
                ${generateParcSocialSection(donneesRegionales, pageIndex)}
            </div>
        </div>

        <!-- SECTION ANALYSE COMPARATIVE -->
        <div class="logement-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-balance-scale"></i> Analyse Comparative
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('compareContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="compareContent-${pageIndex}" class="section-content">
                <div class="charts-grid">
                    <div class="chart-wrapper">
                        <h4>Répartition des Logements</h4>
                        <canvas id="chartRepartition-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Types de Chauffage (2020)</h4>
                        <canvas id="chartChauffage-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Évolution du Confort (2009-2020)</h4>
                        <canvas id="chartConfort-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Parc Social vs Parc Privé</h4>
                        <canvas id="chartSocialPrive-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION DONNÉES DÉMOGRAPHIQUES -->
        <div class="logement-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-users"></i> Contexte Démographique
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('demoContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="demoContent-${pageIndex}" class="section-content">
                ${generateDemoSection(donneesRegionales, pageIndex)}
            </div>
        </div>
    `;
    
    // Initialisation
    setTimeout(() => {
        initLogementCharts(prixConstruction, donneesRegionales, equipements, pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CALCUL DES STATISTIQUES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateLogementStats(prixConstruction, donneesRegionales, equipements) {
    const region = donneesRegionales[0]; // Données 2019
    
    // Prix médian (dernière année disponible)
    const derniereAnnee = prixConstruction[prixConstruction.length - 1];
    
    // Chauffage électrique en 2020
    const chauffageElec2020 = equipements.find(e => e.empty?.includes('tout électrique') && e['2020']);
    
    return {
        totalLogements: region.nombre_de_logements,
        residencesPrincipales: region.nombre_de_residences_principales,
        prixMedian: derniereAnnee.construction_prix_de_revient_median_des_operations_au_logement,
        prixM2: derniereAnnee.construction_prix_de_revient_median_au_m2_des_operations,
        constructionNeuve: region.moyenne_annuelle_de_la_construction_neuve_sur_10_ans,
        tauxSocial: region.taux_de_logements_sociaux_en,
        logementsociaux: region.parc_social_nombre_de_logements,
        tauxVacants: region.taux_de_logements_vacants_en,
        tauxIndividuels: region.taux_de_logements_individuels_en,
        chauffageElec: chauffageElec2020 ? parseFloat(chauffageElec2020.id1) : 60.0,
        tauxEnergivores: region.parc_social_taux_de_logements_energivores_e_f_g_en
    };
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💶 SECTION PRIX DE L'IMMOBILIER
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generatePrixSection(prixData, pageIndex) {
    return `
        <div class="prix-highlight-box">
            <div class="highlight-icon">💰</div>
            <div class="highlight-content">
                <h4>Analyse des Prix de Construction</h4>
                <p>Évolution des coûts de construction et réhabilitation en Corse</p>
            </div>
        </div>

        <div class="prix-grid">
            ${prixData.map((annee, index) => `
                <div class="prix-card" style="animation-delay: ${index * 0.1}s;">
                    <div class="prix-card-header">
                        <span class="prix-year">📅 ${annee.annee_signature}</span>
                        <span class="prix-badge">Construction</span>
                    </div>
                    <div class="prix-card-body">
                        <div class="prix-main">
                            <div class="prix-value-large">${annee.construction_prix_de_revient_median_des_operations_au_logement.toLocaleString()}€</div>
                            <div class="prix-label">Prix médian par logement</div>
                        </div>
                        <div class="prix-details">
                            <div class="prix-detail-item">
                                <i class="fas fa-ruler-combined"></i>
                                <span>${annee.construction_surface_mediane_des_operations_m2_su} m²</span>
                                <small>Surface médiane</small>
                            </div>
                            <div class="prix-detail-item">
                                <i class="fas fa-euro-sign"></i>
                                <span>${annee.construction_prix_de_revient_median_au_m2_des_operations.toLocaleString()}€/m²</span>
                                <small>Prix au m²</small>
                            </div>
                        </div>
                        ${annee.rehabilitation_prix_de_revient_median_des_operations_au_logement > 0 ? `
                            <div class="prix-rehab">
                                <h5><i class="fas fa-tools"></i> Réhabilitation</h5>
                                <div class="prix-rehab-details">
                                    <span>${annee.rehabilitation_prix_de_revient_median_des_operations_au_logement.toLocaleString()}€</span>
                                    <span>${annee.rehabilitation_prix_de_revient_median_au_m2_des_operations.toLocaleString()}€/m²</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="chart-wrapper" style="margin-top: 30px;">
            <h4>Évolution des Prix de Construction</h4>
            <canvas id="chartPrixEvolution-${pageIndex}"></canvas>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📈 SECTION ÉVOLUTION TEMPORELLE
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateEvolutionSection(equipements, pageIndex) {
    // Trouver la ligne "Ensemble"
    const ensemble = equipements.find(e => e.empty === 'Ensemble');
    
    return `
        <div class="evolution-timeline">
            <div class="timeline-item">
                <div class="timeline-year">2009</div>
                <div class="timeline-value">${ensemble['2009']}</div>
                <div class="timeline-label">Résidences principales</div>
            </div>
            <div class="timeline-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="timeline-item">
                <div class="timeline-year">2014</div>
                <div class="timeline-value">${ensemble['2014']}</div>
                <div class="timeline-label">Résidences principales</div>
            </div>
            <div class="timeline-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="timeline-item">
                <div class="timeline-year">2020</div>
                <div class="timeline-value">${ensemble['2020']}</div>
                <div class="timeline-label">Résidences principales</div>
            </div>
        </div>

        <div class="evolution-stats">
            <div class="evolution-stat-box">
                <div class="evolution-icon">📊</div>
                <div class="evolution-content">
                    <div class="evolution-value">+${calculateGrowth(ensemble['2009'], ensemble['2020'])}%</div>
                    <div class="evolution-label">Croissance 2009-2020</div>
                </div>
            </div>
            <div class="evolution-stat-box">
                <div class="evolution-icon">🏠</div>
                <div class="evolution-content">
                    <div class="evolution-value">${calculateNewHomes(ensemble['2009'], ensemble['2020']).toLocaleString()}</div>
                    <div class="evolution-label">Nouveaux Logements</div>
                </div>
            </div>
            <div class="evolution-stat-box">
                <div class="evolution-icon">📅</div>
                <div class="evolution-content">
                    <div class="evolution-value">${calculateAnnualGrowth(ensemble['2009'], ensemble['2020'])}%</div>
                    <div class="evolution-label">Croissance Annuelle</div>
                </div>
            </div>
        </div>

        <div class="equipements-table-wrapper">
            <h4><i class="fas fa-table"></i> Détail de l'Évolution des Équipements</h4>
            <div class="table-scroll">
                <table class="equipements-table">
                    <thead>
                        <tr>
                            <th>Équipement</th>
                            <th>2009</th>
                            <th>% 2009</th>
                            <th>2014</th>
                            <th>% 2014</th>
                            <th>2020</th>
                            <th>% 2020</th>
                            <th>Évolution</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${equipements.filter(e => e.empty !== 'Ensemble').map(equip => {
                            const evolution = calculateGrowth(equip.id, equip.id1);
                            return `
                                <tr>
                                    <td><strong>${equip.empty}</strong></td>
                                    <td>${equip['2009']}</td>
                                    <td>${equip.id}%</td>
                                    <td>${equip['2014']}</td>
                                    <td>${equip.id0}%</td>
                                    <td>${equip['2020']}</td>
                                    <td>${equip.id1}%</td>
                                    <td>
                                        <div class="evolution-badge" style="background: ${evolution > 0 ? '#10b981' : '#ef4444'};">
                                            <i class="fas fa-arrow-${evolution > 0 ? 'up' : 'down'}"></i>
                                            ${Math.abs(evolution).toFixed(1)}%
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛁 SECTION CONFORT & ÉQUIPEMENTS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateConfortSection(equipements, pageIndex) {
    const sallebain = equipements.find(e => e.empty?.includes('Salle de bain'));
    const chauffageElec = equipements.find(e => e.empty?.includes('tout électrique'));
    const chauffageCentral = equipements.find(e => e.empty?.includes('Chauffage central individuel'));
    const chauffageCollectif = equipements.find(e => e.empty?.includes('Chauffage central collectif'));
    
    return `
        <div class="confort-grid">
            <div class="confort-card" style="--card-color: #3b82f6;">
                <div class="confort-icon">🛁</div>
                <h4>Salle de Bain</h4>
                <div class="confort-percentage">${sallebain.id1}%</div>
                <div class="confort-details">
                    <span>${sallebain['2020']} logements</span>
                    <div class="confort-trend">
                        <i class="fas fa-arrow-up"></i> +${(sallebain.id1 - sallebain.id).toFixed(1)}% depuis 2009
                    </div>
                </div>
            </div>

            <div class="confort-card" style="--card-color: #ec4899;">
                <div class="confort-icon">⚡</div>
                <h4>Chauffage Électrique</h4>
                <div class="confort-percentage">${chauffageElec.id1}%</div>
                <div class="confort-details">
                    <span>${chauffageElec['2020']} logements</span>
                    <div class="confort-trend">
                        <i class="fas fa-arrow-up"></i> +${(chauffageElec.id1 - chauffageElec.id).toFixed(1)}% depuis 2009
                    </div>
                </div>
            </div>

            <div class="confort-card" style="--card-color: #f59e0b;">
                <div class="confort-icon">🔥</div>
                <h4>Chauffage Central</h4>
                <div class="confort-percentage">${chauffageCentral.id1}%</div>
                <div class="confort-details">
                    <span>${chauffageCentral['2020']} logements</span>
                    <div class="confort-trend ${chauffageCentral.id1 < chauffageCentral.id ? 'negative' : ''}">
                        <i class="fas fa-arrow-${chauffageCentral.id1 < chauffageCentral.id ? 'down' : 'up'}"></i> 
                        ${Math.abs(chauffageCentral.id1 - chauffageCentral.id).toFixed(1)}% depuis 2009
                    </div>
                </div>
            </div>

            <div class="confort-card" style="--card-color: #10b981;">
                <div class="confort-icon">🏢</div>
                <h4>Chauffage Collectif</h4>
                <div class="confort-percentage">${chauffageCollectif.id1}%</div>
                <div class="confort-details">
                    <span>${chauffageCollectif['2020']} logements</span>
                    <div class="confort-trend ${chauffageCollectif.id1 < chauffageCollectif.id ? 'negative' : ''}">
                        <i class="fas fa-arrow-${chauffageCollectif.id1 < chauffageCollectif.id ? 'down' : 'up'}"></i> 
                        ${Math.abs(chauffageCollectif.id1 - chauffageCollectif.id).toFixed(1)}% depuis 2009
                    </div>
                </div>
            </div>
        </div>

        <div class="confort-insight-box">
            <div class="insight-icon">💡</div>
            <div class="insight-content">
                <h4>Tendances Observées</h4>
                <ul>
                    <li>📈 <strong>Forte progression du chauffage électrique</strong> : +${(chauffageElec.id1 - chauffageElec.id).toFixed(1)}% en 11 ans</li>
                    <li>📉 <strong>Baisse du chauffage central</strong> : reflète l'évolution vers des solutions individuelles</li>
                    <li>✅ <strong>Équipement sanitaire quasi-universel</strong> : ${sallebain.id1}% des logements disposent d'une salle de bain</li>
                    <li>🏡 <strong>Individualisation du chauffage</strong> : tendance vers plus d'autonomie énergétique</li>
                </ul>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏛️ SECTION PARC SOCIAL
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateParcSocialSection(data, pageIndex) {
    const region = data[0];
    
    return `
        <div class="social-highlight">
            <div class="social-main-stat">
                <div class="social-icon">🏛️</div>
                <div class="social-content">
                    <div class="social-value">${region.parc_social_nombre_de_logements.toLocaleString()}</div>
                    <div class="social-label">Logements Sociaux</div>
                    <div class="social-percentage">${region.taux_de_logements_sociaux_en}% du parc total</div>
                </div>
            </div>
        </div>

        <div class="social-grid">
            <div class="social-info-card">
                <div class="social-info-icon" style="background: #10b981;">📈</div>
                <div class="social-info-content">
                    <div class="social-info-value">${region.parc_social_logements_mis_en_location.toLocaleString()}</div>
                    <div class="social-info-label">Mis en Location (2019)</div>
                </div>
            </div>

            <div class="social-info-card">
                <div class="social-info-icon" style="background: #ef4444;">🏚️</div>
                <div class="social-info-content">
                    <div class="social-info-value">${region.parc_social_taux_de_logements_vacants_en}%</div>
                    <div class="social-info-label">Taux de Vacance</div>
                </div>
            </div>

            <div class="social-info-card">
                <div class="social-info-icon" style="background: #3b82f6;">💶</div>
                <div class="social-info-content">
                    <div class="social-info-value">${region.parc_social_loyer_moyen_en_eur_m2_mois}€/m²</div>
                    <div class="social-info-label">Loyer Moyen Mensuel</div>
                </div>
            </div>

            <div class="social-info-card">
                <div class="social-info-icon" style="background: #8b5cf6;">📅</div>
                <div class="social-info-content">
                    <div class="social-info-value">${region.parc_social_age_moyen_du_parc_en_annees} ans</div>
                    <div class="social-info-label">Âge Moyen du Parc</div>
                </div>
            </div>

            <div class="social-info-card">
                <div class="social-info-icon" style="background: #f59e0b;">🌡️</div>
                <div class="social-info-content">
                    <div class="social-info-value">${region.parc_social_taux_de_logements_energivores_e_f_g_en}%</div>
                    <div class="social-info-label">Logements Énergiv ores</div>
                </div>
            </div>

            <div class="social-info-card">
                <div class="social-info-icon" style="background: #06b6d4;">🏡</div>
                <div class="social-info-content">
                    <div class="social-info-value">${region.parc_social_taux_de_logements_individuels_en}%</div>
                    <div class="social-info-label">Logements Individuels</div>
                </div>
            </div>
        </div>

        <div class="social-operations">
            <h4><i class="fas fa-cogs"></i> Opérations sur le Parc (2019)</h4>
            <div class="operations-grid">
                <div class="operation-item success">
                    <div class="operation-icon"><i class="fas fa-plus-circle"></i></div>
                    <div class="operation-value">${region.parc_social_logements_mis_en_location}</div>
                    <div class="operation-label">Mises en Location</div>
                </div>
                <div class="operation-item danger">
                    <div class="operation-icon"><i class="fas fa-minus-circle"></i></div>
                    <div class="operation-value">${region.parc_social_logements_demolis}</div>
                    <div class="operation-label">Démolitions</div>
                </div>
                <div class="operation-item info">
                    <div class="operation-icon"><i class="fas fa-home"></i></div>
                    <div class="operation-value">${region.parc_social_ventes_a_des_personnes_physiques}</div>
                    <div class="operation-label">Ventes</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👥 SECTION DÉMOGRAPHIQUE
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateDemoSection(data, pageIndex) {
    const region = data[0];
    
    return `
        <div class="demo-stats-row">
            <div class="demo-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <div class="demo-icon">👥</div>
                <div class="demo-value">${region.nombre_d_habitants.toLocaleString()}</div>
                <div class="demo-label">Habitants</div>
                <div class="demo-detail">${region.densite_de_population_au_km2} hab/km²</div>
            </div>

            <div class="demo-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="demo-icon">📈</div>
                <div class="demo-value">+${region.variation_de_la_population_sur_10_ans_en}%</div>
                <div class="demo-label">Variation 10 ans</div>
                <div class="demo-detail">Solde migratoire: +${region.dont_contribution_du_solde_migratoire_en}%</div>
            </div>

            <div class="demo-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="demo-icon">💼</div>
                <div class="demo-value">${region.taux_de_chomage_au_t4_en}%</div>
                <div class="demo-label">Taux de Chômage</div>
                <div class="demo-detail">T4 2019</div>
            </div>

            <div class="demo-card" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                <div class="demo-icon">📊</div>
                <div class="demo-value">${region.taux_de_pauvrete_en}%</div>
                <div class="demo-label">Taux de Pauvreté</div>
                <div class="demo-detail">Indicateur social</div>
            </div>
        </div>

        <div class="demo-pyramid">
            <h4><i class="fas fa-chart-bar"></i> Structure par Âge</h4>
            <div class="pyramid-bars">
                <div class="pyramid-bar">
                    <div class="pyramid-label">Moins de 20 ans</div>
                    <div class="pyramid-bar-fill" style="width: ${region.population_de_moins_de_20_ans * 3}%; background: #3b82f6;">
                        ${region.population_de_moins_de_20_ans}%
                    </div>
                </div>
                <div class="pyramid-bar">
                    <div class="pyramid-label">20-59 ans</div>
                    <div class="pyramid-bar-fill" style="width: ${(100 - region.population_de_moins_de_20_ans - region.population_de_60_ans_et_plus) * 3}%; background: #10b981;">
                        ${(100 - region.population_de_moins_de_20_ans - region.population_de_60_ans_et_plus).toFixed(1)}%
                    </div>
                </div>
                <div class="pyramid-bar">
                    <div class="pyramid-label">60 ans et plus</div>
                    <div class="pyramid-bar-fill" style="width: ${region.population_de_60_ans_et_plus * 3}%; background: #f59e0b;">
                        ${region.population_de_60_ans_et_plus}%
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

function initLogementCharts(prixData, regionData, equipements, pageIndex) {
    const region = regionData[0];
    
    // 1. Évolution des prix
    const prixCtx = document.getElementById(`chartPrixEvolution-${pageIndex}`);
    if (prixCtx) {
        new Chart(prixCtx, {
            type: 'line',
            data: {
                labels: prixData.map(p => p.annee_signature),
                datasets: [
                    {
                        label: 'Prix au logement (€)',
                        data: prixData.map(p => p.construction_prix_de_revient_median_des_operations_au_logement),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Prix au m² (€)',
                        data: prixData.map(p => p.construction_prix_de_revient_median_au_m2_des_operations),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Prix par logement (€)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Prix au m² (€)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    // 2. Répartition des logements
    const repartitionCtx = document.getElementById(`chartRepartition-${pageIndex}`);
    if (repartitionCtx) {
        new Chart(repartitionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Résidences Principales', 'Résidences Secondaires', 'Logements Vacants'],
                datasets: [{
                    data: [
                        region.nombre_de_residences_principales,
                        region.nombre_de_logements - region.nombre_de_residences_principales - (region.nombre_de_logements * region.taux_de_logements_vacants_en / 100),
                        region.nombre_de_logements * region.taux_de_logements_vacants_en / 100
                    ],
                    backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // 3. Types de chauffage 2020
    const chauffageCtx = document.getElementById(`chartChauffage-${pageIndex}`);
    if (chauffageCtx) {
        const chauffageData = equipements.filter(e => 
            e.empty?.includes('Chauffage') && e['2020']
        );
        
        new Chart(chauffageCtx, {
            type: 'bar',
            data: {
                labels: chauffageData.map(c => c.empty.replace('Chauffage', '').trim()),
                datasets: [{
                    label: 'Nombre de logements',
                    data: chauffageData.map(c => parseInt(c['2020'].replace(/\s/g, ''))),
                    backgroundColor: ['#3b82f6', '#ec4899', '#f59e0b'],
                    borderWidth: 2,
                    borderColor: ['#2563eb', '#db2777', '#d97706']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // 4. Évolution du confort
    const confortCtx = document.getElementById(`chartConfort-${pageIndex}`);
    if (confortCtx) {
        const sallebain = equipements.find(e => e.empty?.includes('Salle de bain'));
        
        new Chart(confortCtx, {
            type: 'line',
            data: {
                labels: ['2009', '2014', '2020'],
                datasets: [{
                    label: 'Taux d\'équipement salle de bain (%)',
                    data: [sallebain.id, sallebain.id0, sallebain.id1],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 95,
                        max: 100
                    }
                }
            }
        });
    }
    
    // 5. Social vs Privé
    const socialPriveCtx = document.getElementById(`chartSocialPrive-${pageIndex}`);
    if (socialPriveCtx) {
        new Chart(socialPriveCtx, {
            type: 'bar',
            data: {
                labels: ['Parc Social', 'Parc Privé'],
                datasets: [{
                    label: 'Nombre de logements',
                    data: [
                        region.parc_social_nombre_de_logements,
                        region.nombre_de_logements - region.parc_social_nombre_de_logements
                    ],
                    backgroundColor: ['#8b5cf6', '#3b82f6'],
                    borderWidth: 2,
                    borderColor: ['#7c3aed', '#2563eb']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛠️ FONCTIONS UTILITAIRES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateGrowth(start, end) {
    start = parseFloat(start);
    end = parseFloat(end);
    return ((end - start) / start * 100).toFixed(1);
}

function calculateNewHomes(start2009, end2020) {
    const start = parseInt(start2009.replace(/\s/g, ''));
    const end = parseInt(end2020.replace(/\s/g, ''));
    return end - start;
}

function calculateAnnualGrowth(start2009, end2020) {
    const years = 11;
    const start = parseInt(start2009.replace(/\s/g, ''));
    const end = parseInt(end2020.replace(/\s/g, ''));
    const totalGrowth = ((end - start) / start * 100);
    return (totalGrowth / years).toFixed(1);
}