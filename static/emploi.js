/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💼 DASHBOARD TRAVAIL & EMPLOI 
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createTravailDashboard(chomageParDiplome, pauvreteParAge, pauvreteLogement, csoProfessionnelles, pageIndex) {
    console.log('💼 Création du dashboard travail pour page:', pageIndex);
    
    const stats = calculateTravailStats(chomageParDiplome, pauvreteParAge, pauvreteLogement, csoProfessionnelles);
    
    const container = document.createElement('div');
    container.className = 'travail-dashboard';
    container.innerHTML = `
        <!-- EN-TÊTE -->
        <div class="travail-dashboard-header">
            <h2><i class="fas fa-briefcase"></i> Travail & Emploi en Corse</h2>
            <p>Chômage, pauvreté et répartition socio-professionnelle</p>
        </div>

        <!-- STATS CLÉS -->
        <div class="travail-stats-global">
            <div class="travail-stat-card" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.chomageMax}%</div>
                    <div class="stat-label">Chômage Maximum</div>
                    <div class="stat-detail">Sans diplôme</div>
                </div>
            </div>
            
            <div class="travail-stat-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                <div class="stat-icon">🎓</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.chomageMin}%</div>
                    <div class="stat-label">Chômage Minimum</div>
                    <div class="stat-detail">Bac+5</div>
                </div>
            </div>
            
            <div class="travail-stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.pauvreteGlobal}%</div>
                    <div class="stat-label">Taux de Pauvreté</div>
                    <div class="stat-detail">Moyenne régionale</div>
                </div>
            </div>
            
            <div class="travail-stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                <div class="stat-icon">👔</div>
                <div class="stat-content">
                    <div class="stat-value">${stats.cadres}%</div>
                    <div class="stat-label">Cadres</div>
                    <div class="stat-detail">Population active</div>
                </div>
            </div>
        </div>

        <!-- INSIGHT PRINCIPAL -->
        <div class="insight-banner">
            <div class="insight-icon">💡</div>
            <div class="insight-text">
                <strong>Constat clé :</strong> Le diplôme divise par 3 le risque de chômage. 
                La pauvreté touche davantage les locataires (28%) que les propriétaires (11%).
            </div>
        </div>

        <!-- SECTION CHÔMAGE PAR DIPLÔME -->
        <div class="travail-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-graduation-cap"></i> Chômage selon le Diplôme
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chomageContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chomageContent-${pageIndex}" class="section-content">
                <p class="section-intro">💡 Plus le niveau d'études augmente, plus le taux de chômage diminue.</p>
                ${generateChomageDiplomeSection(chomageParDiplome, pageIndex)}
            </div>
        </div>

        <!-- SECTION PAUVRETÉ PAR ÂGE -->
        <div class="travail-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-users"></i> Pauvreté selon l'Âge
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('ageContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="ageContent-${pageIndex}" class="section-content">
                <p class="section-intro">👥 Les jeunes de moins de 30 ans sont les plus touchés (23.8%).</p>
                ${generatePauvreteAgeSection(pauvreteParAge, pageIndex)}
            </div>
        </div>

        <!-- SECTION PAUVRETÉ & LOGEMENT -->
        <div class="travail-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-home"></i> Pauvreté & Statut d'Occupation
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('logementContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="logementContent-${pageIndex}" class="section-content">
                <p class="section-intro">🏠 Être propriétaire réduit fortement le risque de pauvreté.</p>
                ${generatePauvreteLogementSection(pauvreteLogement, pageIndex)}
            </div>
        </div>

        <!-- SECTION CSP -->
        <div class="travail-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-chart-pie"></i> Catégories Socio-Professionnelles
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('cspContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="cspContent-${pageIndex}" class="section-content">
                <p class="section-intro">👔 Les cadres représentent 22.9% de la population active.</p>
                ${generateCSPSection(csoProfessionnelles, pageIndex)}
            </div>
        </div>

        <!-- GRAPHIQUES COMPARATIFS -->
        <div class="travail-section">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="fas fa-chart-bar"></i> Vue d'Ensemble
                </h3>
                <button class="toggle-section-btn" onclick="toggleSection('chartsContent-${pageIndex}')">
                    <i class="fas fa-chevron-down"></i> Réduire
                </button>
            </div>
            <div id="chartsContent-${pageIndex}" class="section-content">
                <div class="charts-grid">
                    <div class="chart-wrapper">
                        <h4>Chômage par Diplôme</h4>
                        <canvas id="chartChomage-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Pauvreté par Âge</h4>
                        <canvas id="chartAge-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Pauvreté Propriétaires vs Locataires</h4>
                        <canvas id="chartLogement-${pageIndex}"></canvas>
                    </div>
                    <div class="chart-wrapper">
                        <h4>Répartition des CSP</h4>
                        <canvas id="chartCSP-${pageIndex}"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        initTravailCharts(chomageParDiplome, pauvreteParAge, pauvreteLogement, csoProfessionnelles, pageIndex);
    }, 100);
    
    return container.outerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 CALCUL DES STATS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function calculateTravailStats(chomage, pauvrete, logement, csp) {
    const chomageValues = chomage.map(d => d.taux_de_chomage_en);
    const pauvreteGlobal = pauvrete.find(p => p.empty === 'Ensemble');
    const cadres = csp.find(c => c.empty === 'Cadres*');
    
    return {
        chomageMax: Math.max(...chomageValues).toFixed(1),
        chomageMin: Math.min(...chomageValues).toFixed(1),
        pauvreteGlobal: pauvreteGlobal ? pauvreteGlobal.taux_en : 18.3,
        cadres: cadres ? cadres.ensemble : 22.9
    };
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎓 SECTION CHÔMAGE PAR DIPLÔME
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateChomageDiplomeSection(data, pageIndex) {
    const sorted = [...data].sort((a, b) => b.taux_de_chomage_en - a.taux_de_chomage_en);
    
    return `
        <div class="diplome-grid">
            ${sorted.map((diplome, index) => {
                const color = getChomageColor(diplome.taux_de_chomage_en);
                return `
                    <div class="diplome-card" style="animation-delay: ${index * 0.1}s;">
                        <div class="diplome-header" style="background: ${color};">
                            <div class="diplome-icon">${getDiplomeIcon(diplome.empty)}</div>
                            <div class="diplome-taux">${diplome.taux_de_chomage_en}%</div>
                        </div>
                        <div class="diplome-body">
                            <h4>${diplome.empty}</h4>
                            <div class="diplome-bar">
                                <div class="diplome-bar-fill" style="width: ${(diplome.taux_de_chomage_en / 20) * 100}%; background: ${color};"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getDiplomeIcon(diplome) {
    if (diplome.includes('bac + 5')) return '🎓';
    if (diplome.includes('bac + 3') || diplome.includes('bac + 4')) return '📚';
    if (diplome.includes('bac + 2')) return '📖';
    if (diplome.includes('Baccalauréat')) return '📝';
    if (diplome.includes('CAP') || diplome.includes('BEP')) return '🔧';
    if (diplome.includes('BEPC')) return '📄';
    return '❌';
}

function getChomageColor(taux) {
    if (taux < 7) return 'linear-gradient(135deg, #10b981, #059669)';
    if (taux < 10) return 'linear-gradient(135deg, #3b82f6, #2563eb)';
    if (taux < 13) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    return 'linear-gradient(135deg, #ef4444, #dc2626)';
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👥 SECTION PAUVRETÉ PAR ÂGE
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generatePauvreteAgeSection(data, pageIndex) {
    const filtered = data.filter(d => d.empty !== 'Ensemble');
    const sorted = [...filtered].sort((a, b) => b.taux_en - a.taux_en);
    
    return `
        <div class="age-comparison">
            ${sorted.map((age, index) => {
                const percentage = (age.taux_en / 30) * 100;
                return `
                    <div class="age-row" style="animation-delay: ${index * 0.1}s;">
                        <div class="age-label">${age.empty}</div>
                        <div class="age-bar-container">
                            <div class="age-bar-fill" style="width: ${percentage}%; background: ${getPauvreteColor(age.taux_en)};">
                                <span class="age-value">${age.taux_en}%</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="age-insight">
            <span class="insight-badge red">⚠️ À risque</span>
            <p>Les moins de 30 ans sont 1.5x plus touchés que la moyenne.</p>
        </div>
    `;
}

function getPauvreteColor(taux) {
    if (taux > 22) return '#ef4444';
    if (taux > 19) return '#f59e0b';
    if (taux > 17) return '#3b82f6';
    return '#10b981';
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🏠 SECTION PAUVRETÉ & LOGEMENT
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generatePauvreteLogementSection(data, pageIndex) {
    const proprio = data.find(d => d.empty === 'Propriétaire');
    const locataire = data.find(d => d.empty === 'Locataire');
    
    return `
        <div class="logement-comparison">
            <div class="logement-card proprio">
                <div class="logement-icon">🏡</div>
                <h4>Propriétaires</h4>
                <div class="logement-taux">${proprio.taux_en}%</div>
                <div class="logement-label">Taux de pauvreté</div>
                <div class="logement-badge success">✅ Protégés</div>
            </div>
            
            <div class="vs-separator">VS</div>
            
            <div class="logement-card locataire">
                <div class="logement-icon">🏢</div>
                <h4>Locataires</h4>
                <div class="logement-taux">${locataire.taux_en}%</div>
                <div class="logement-label">Taux de pauvreté</div>
                <div class="logement-badge danger">⚠️ Vulnérables</div>
            </div>
        </div>
        
        <div class="logement-insight">
            <div class="insight-icon">📊</div>
            <div class="insight-content">
                <strong>Écart majeur :</strong> Les locataires ont un taux de pauvreté 2.5x supérieur aux propriétaires.
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 👔 SECTION CSP
 * ════════════════════════════════════════════════════════════════════════════════
 */

function generateCSPSection(data, pageIndex) {
    const filtered = data.filter(d => d.empty !== 'Ensemble');
    const sorted = [...filtered].sort((a, b) => b.ensemble - a.ensemble);
    
    return `
        <div class="csp-grid">
            ${sorted.map((csp, index) => `
                <div class="csp-card" style="animation-delay: ${index * 0.1}s;">
                    <div class="csp-header">
                        <span class="csp-icon">${getCSPIcon(csp.empty)}</span>
                        <h4>${csp.empty}</h4>
                    </div>
                    <div class="csp-stats">
                        <div class="csp-stat total">
                            <div class="csp-stat-value">${csp.ensemble}%</div>
                            <div class="csp-stat-label">Total</div>
                        </div>
                        <div class="csp-stat women">
                            <div class="csp-stat-value">${csp.femmes}%</div>
                            <div class="csp-stat-label">Femmes</div>
                        </div>
                        <div class="csp-stat men">
                            <div class="csp-stat-value">${csp.hommes}%</div>
                            <div class="csp-stat-label">Hommes</div>
                        </div>
                    </div>
                    <div class="csp-gender-bar">
                        <div class="gender-bar-women" style="width: ${(csp.femmes / csp.ensemble) * 50}%;" title="Femmes: ${csp.femmes}%"></div>
                        <div class="gender-bar-men" style="width: ${(csp.hommes / csp.ensemble) * 50}%;" title="Hommes: ${csp.hommes}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="csp-insight">
            <span class="insight-badge blue">💼 Observation</span>
            <p>Les cadres sont la catégorie la mieux représentée, avec une légère majorité masculine.</p>
        </div>
    `;
}

function getCSPIcon(csp) {
    if (csp.includes('Cadres')) return '👔';
    if (csp.includes('Professions')) return '💼';
    if (csp.includes('Employés')) return '👨‍💼';
    if (csp.includes('Ouvriers')) return '🔧';
    return '👤';
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📊 GRAPHIQUES CHART.JS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function initTravailCharts(chomage, pauvrete, logement, csp, pageIndex) {
    // 1. Chômage par diplôme
    const chomageCtx = document.getElementById(`chartChomage-${pageIndex}`);
    if (chomageCtx) {
        const sorted = [...chomage].sort((a, b) => a.taux_de_chomage_en - b.taux_de_chomage_en);
        new Chart(chomageCtx, {
            type: 'bar',
            data: {
                labels: sorted.map(d => d.empty.split(' ').slice(0, 3).join(' ')),
                datasets: [{
                    label: 'Taux de chômage (%)',
                    data: sorted.map(d => d.taux_de_chomage_en),
                    backgroundColor: sorted.map(d => {
                        if (d.taux_de_chomage_en < 7) return '#10b981';
                        if (d.taux_de_chomage_en < 10) return '#3b82f6';
                        if (d.taux_de_chomage_en < 13) return '#f59e0b';
                        return '#ef4444';
                    }),
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
    
    // 2. Pauvreté par âge
    const ageCtx = document.getElementById(`chartAge-${pageIndex}`);
    if (ageCtx) {
        const filtered = pauvrete.filter(p => p.empty !== 'Ensemble');
        new Chart(ageCtx, {
            type: 'line',
            data: {
                labels: filtered.map(p => p.empty),
                datasets: [{
                    label: 'Taux de pauvreté (%)',
                    data: filtered.map(p => p.taux_en),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
    
    // 3. Propriétaires vs Locataires
    const logementCtx = document.getElementById(`chartLogement-${pageIndex}`);
    if (logementCtx) {
        const filtered = logement.filter(l => l.empty !== 'Ensemble');
        new Chart(logementCtx, {
            type: 'doughnut',
            data: {
                labels: filtered.map(l => l.empty),
                datasets: [{
                    data: filtered.map(l => l.taux_en),
                    backgroundColor: ['#10b981', '#ef4444'],
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
    
    // 4. CSP
    const cspCtx = document.getElementById(`chartCSP-${pageIndex}`);
    if (cspCtx) {
        const filtered = csp.filter(c => c.empty !== 'Ensemble');
        new Chart(cspCtx, {
            type: 'bar',
            data: {
                labels: filtered.map(c => c.empty),
                datasets: [
                    {
                        label: 'Femmes',
                        data: filtered.map(c => c.femmes),
                        backgroundColor: '#ec4899'
                    },
                    {
                        label: 'Hommes',
                        data: filtered.map(c => c.hommes),
                        backgroundColor: '#3b82f6'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}
