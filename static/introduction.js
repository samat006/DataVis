/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📖 PAGE INTRODUCTION - PRÉSENTATION DU PROJET
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createIntroductionPage(pageIndex) {
    return `
        <div class="introduction-dashboard">
            <!-- EN-TÊTE -->
            <div class="intro-header">
                <div class="intro-icon">📊</div>
                <h1>Portrait des Territoires de Corse</h1>
                <p class="intro-subtitle">Data Visualisation Interactive - Concours 2025</p>
            </div>

            <!-- PRÉSENTATION -->
            <section class="intro-section">
                <div class="section-icon">🎯</div>
                <h2>À Propos du Projet</h2>
                <div class="intro-content">
                    <p class="intro-text">
                        Ce livre interactif propose une <strong>analyse approfondie et visuelle</strong> du territoire corse à travers une approche moderne de la data visualisation. Développé dans le cadre du <strong>Concours DataVis 2025</strong>, ce projet met en lumière les multiples facettes de la Corse : démographie, économie, environnement, infrastructures et qualité de vie.
                    </p>
                    <p class="intro-text">
                        Grâce à des <strong>visualisations 3D interactives</strong>, des graphiques dynamiques et une navigation immersive, découvrez les données qui façonnent le quotidien des territoires corses et leurs enjeux pour l'avenir.
                    </p>
                </div>
            </section>

            <!-- OBJECTIFS -->
            <section class="intro-section">
                <div class="section-icon">🎓</div>
                <h2>Objectifs</h2>
                <div class="objectives-grid">
                    <div class="objective-card">
                        <div class="objective-icon">📈</div>
                        <h3>Valoriser les données</h3>
                        <p>Rendre accessibles et compréhensibles les données territoriales à travers des visualisations claires et attractives.</p>
                    </div>
                    <div class="objective-card">
                        <div class="objective-icon">🗺️</div>
                        <h3>Cartographier le territoire</h3>
                        <p>Offrir une vision géographique et contextuelle des indicateurs grâce à l'intégration de cartes 3D interactives.</p>
                    </div>
                    <div class="objective-card">
                        <div class="objective-icon">💡</div>
                        <h3>Éclairer les décisions</h3>
                        <p>Fournir des analyses statistiques robustes pour soutenir la prise de décision publique et citoyenne.</p>
                    </div>
                    <div class="objective-card">
                        <div class="objective-icon">🚀</div>
                        <h3>Innover techniquement</h3>
                        <p>Exploiter les technologies web modernes pour créer une expérience utilisateur unique et immersive.</p>
                    </div>
                </div>
            </section>

            <!-- STRUCTURE DU LIVRE -->
            <section class="intro-section">
                <div class="section-icon">📚</div>
                <h2>Structure du Livre</h2>
                <div class="chapters-timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background: linear-gradient(135deg, #87c19cff, #357045ff);">1</div>
                        <div class="timeline-content">
                            <h3>Chapitre 1 : Démographie</h3>
                            <p>Évolution démographique, pyramide des âges, taux de natalité et mortalité</p>
                            <div class="timeline-badge">📊 Graphiques temporels</div>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background: linear-gradient(135deg, #f97316, #ea580c);">2</div>
                        <div class="timeline-content">
                            <h3>Chapitre 2 : Environnement</h3>
                            <p>Qualité de l'eau, pollution atmosphérique, températures, gestion des déchets</p>
                            <div class="timeline-badge">🌍 Cartes interactives</div>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background: linear-gradient(135deg, #10b981, #059669);">3</div>
                        <div class="timeline-content">
                            <h3>Chapitre 3 : Santé & Services</h3>
                            <p>Professionnels de santé, services d'urgence, accessibilité des soins</p>
                            <div class="timeline-badge">🏥 Géolocalisation</div>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">4</div>
                        <div class="timeline-content">
                            <h3>Chapitre 4 : Bien-être des Populations</h3>
                            <p>Logement, emploi, éducation, infrastructures de transport</p>
                            <div class="timeline-badge">📈 Analyses croisées</div>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-dot" style="background: linear-gradient(135deg, #ec4899, #db2777);">5</div>
                        <div class="timeline-content">
                            <h3>Chapitre 5 : Bien_veillir</h3>
                            <p>Démographie 60+, autonomie, logement adapté, accompagnement</p>
                            <div class="timeline-badge">👴 Indicateurs sociaux</div>
                        </div>
                    </div>
                    
                   
                </div>
            </section>

            <!-- MÉTHODOLOGIE -->
            <section class="intro-section">
                <div class="section-icon">🔬</div>
                <h2>Méthodologie</h2>
                <div class="methodology-grid">
                    <div class="method-card">
                        <i class="fas fa-database method-icon"></i>
                        <h3>Sources de Données</h3>
                        <ul>
                            <li><strong>INSEE</strong> - Statistiques démographiques et socio-économiques</li>
                            <li><strong>Data.gouv.fr</strong> - Données publiques françaises</li>
                            <li><strong>Collectivité de Corse</strong> - Données territoriales locales</li>
                            <li><strong>Ministères</strong> - Éducation, Santé, Environnement</li>
                        </ul>
                    </div>
                    
                    <div class="method-card">
                        <i class="fas fa-cogs method-icon"></i>
                        <h3>Technologies</h3>
                        <ul>
                            <li><strong>Cesium.js</strong> - Visualisation 3D et cartographie interactive</li>
                            <li><strong>Chart.js</strong> - Graphiques statistiques dynamiques</li>
                            <li><strong>Python Flask</strong> - Backend et API REST</li>
                            <li><strong>JavaScript ES6+</strong> - Interactivité front-end</li>
                        </ul>
                    </div>
                    
                    <div class="method-card">
                        <i class="fas fa-chart-line method-icon"></i>
                        <h3>Traitement des Données</h3>
                        <ul>
                            <li><strong>Nettoyage</strong> - Validation et normalisation des données</li>
                            <li><strong>Agrégation</strong> - Calculs statistiques et indicateurs</li>
                            <li><strong>Géocodage</strong> - Localisation précise des entités</li>
                            <li><strong>Optimisation</strong> - Performance et temps de chargement</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- FONCTIONNALITÉS -->
            <section class="intro-section">
                <div class="section-icon">✨</div>
                <h2>Fonctionnalités Clés</h2>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">🗺️</div>
                        <h4>Cartes 3D Interactives</h4>
                        <p>Navigation immersive sur le territoire avec marqueurs géolocalisés</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">📊</div>
                        <h4>Graphiques Dynamiques</h4>
                        <p>Visualisations statistiques interactives et personnalisables</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🔍</div>
                        <h4>Recherche & Filtres</h4>
                        <p>Exploration ciblée des données par critères multiples</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">📱</div>
                        <h4>Design Responsive</h4>
                        <p>Adaptation automatique à tous les écrans (desktop, tablette, mobile)</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">💾</div>
                        <h4>Export de Données</h4>
                        <p>Téléchargement des sources au format JSON pour réutilisation</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🎨</div>
                        <h4>Interface Moderne</h4>
                        <p>Design épuré avec animations fluides et ergonomie optimale</p>
                    </div>
                </div>
            </section>

            <!-- STATISTIQUES CLÉS -->
            <section class="intro-section highlight">
                <h2>Le Projet en Chiffres</h2>
                <div class="stats-highlight">
                    <div class="stat-highlight-item">
                        <div class="stat-highlight-value">27</div>
                        <div class="stat-highlight-label">Graphiques Interactifs</div>
                    </div>
                    <div class="stat-highlight-item">
                        <div class="stat-highlight-value">15+</div>
                        <div class="stat-highlight-label">Sources de Données</div>
                    </div>
                    <div class="stat-highlight-item">
                        <div class="stat-highlight-value">6</div>
                        <div class="stat-highlight-label">Chapitres Thématiques</div>
                    </div>
                    <div class="stat-highlight-item">
                        <div class="stat-highlight-value">100%</div>
                        <div class="stat-highlight-label">Open Source</div>
                    </div>
                </div>
            </section>

           
        </div>
    `;
}