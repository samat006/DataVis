/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎯 PAGE CONCLUSION - SYNTHÈSE DU PROJET
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function createConclusionPage(pageIndex) {
    return `
        <div class="conclusion-page-dashboard">
            <!-- EN-TÊTE -->
            <div class="conclusion-page-header">
                <div class="conclusion-icon-animated">🎯</div>
                <h1>Conclusion</h1>
                <p class="conclusion-subtitle">Portrait des Territoires de Corse - Synthèse et Perspectives</p>
            </div>

            <!-- SYNTHÈSE GÉNÉRALE -->
            <section class="conclusion-section">
                <div class="section-icon">📊</div>
                <h2>Synthèse du Portrait Territorial</h2>
                <div class="conclusion-content">
                    <p class="conclusion-text highlight-text">
                        Ce livre interactif a permis de dresser un <strong>portrait complet et dynamique</strong> du territoire corse à travers six dimensions fondamentales : démographie, environnement, santé, bien-être des populations, seniors et infrastructures sportives.
                    </p>
                    <p class="conclusion-text">
                        L'analyse croisée de ces données révèle un territoire aux <strong>multiples facettes</strong>, marqué par des enjeux spécifiques liés à sa géographie insulaire, sa démographie vieillissante et ses défis environnementaux. La Corse se distingue par la richesse de son patrimoine naturel, la qualité de vie offerte à ses habitants, mais aussi par des disparités territoriales qu'il convient d'adresser.
                    </p>
                </div>
            </section>

            <!-- ENSEIGNEMENTS CLÉS -->
            <section class="conclusion-section">
                <div class="section-icon">💡</div>
                <h2>Enseignements Clés</h2>
                <div class="insights-grid">
                    <div class="insight-card" style="--card-color: #667eea;">
                        <div class="insight-number">1</div>
                        <h3>Démographie & Vieillissement</h3>
                        <p>
                            La Corse connaît un <strong>vieillissement démographique marqué</strong> avec une proportion croissante de personnes de 60 ans et plus. 
                            Les politiques de maintien à domicile et d'adaptation des logements sont essentielles pour répondre aux besoins des seniors.
                        </p>
                        <div class="insight-stat">
                            <span class="stat-big">20%+</span>
                            <span class="stat-label">Population 60+</span>
                        </div>
                    </div>

                    <div class="insight-card" style="--card-color: #10b981;">
                        <div class="insight-number">2</div>
                        <h3>Environnement & Qualité</h3>
                        <p>
                            Le territoire bénéficie d'une <strong>qualité environnementale globalement bonne</strong> (eau, air), 
                            mais la gestion des déchets et l'évolution des températures nécessitent une vigilance accrue et des actions ciblées.
                        </p>
                        <div class="insight-stat">
                            <span class="stat-big">85%</span>
                            <span class="stat-label">Eau potable conforme</span>
                        </div>
                    </div>

                    <div class="insight-card" style="--card-color: #f59e0b;">
                        <div class="insight-number">3</div>
                        <h3>Infrastructures & Accessibilité</h3>
                        <p>
                            Le déploiement des infrastructures (transport, sport, santé) progresse, 
                            mais les <strong>disparités territoriales persistent</strong> entre zones urbaines et rurales, 
                            notamment en matière d'accessibilité aux services.
                        </p>
                        <div class="insight-stat">
                            <span class="stat-big">150+</span>
                            <span class="stat-label">Terrains sportifs</span>
                        </div>
                    </div>

                    <div class="insight-card" style="--card-color: #ec4899;">
                        <div class="insight-number">4</div>
                        <h3>Logement & Emploi</h3>
                        <p>
                            Le marché du logement connaît une <strong>tension croissante</strong> avec des prix en hausse. 
                            Le taux de chômage, bien qu'en amélioration, reste supérieur à la moyenne nationale, 
                            particulièrement chez les jeunes et les non-diplômés.
                        </p>
                        <div class="insight-stat">
                            <span class="stat-big">12%</span>
                            <span class="stat-label">Taux de chômage moyen</span>
                        </div>
                    </div>

                    <div class="insight-card" style="--card-color: #06b6d4;">
                        <div class="insight-number">5</div>
                        <h3>Éducation & Formation</h3>
                        <p>
                            Le système éducatif corse est <strong>bien maillé</strong> avec une bonne couverture territoriale. 
                            L'enseignement supérieur et la formation continue constituent des leviers essentiels 
                            pour l'insertion professionnelle des jeunes.
                        </p>
                        <div class="insight-stat">
                            <span class="stat-big">300+</span>
                            <span class="stat-label">Établissements scolaires</span>
                        </div>
                    </div>

                    <div class="insight-card" style="--card-color: #8b5cf6;">
                        <div class="insight-number">6</div>
                        <h3>Santé & Services</h3>
                        <p>
                            L'offre de soins est <strong>globalement satisfaisante</strong> dans les pôles urbains, 
                            mais la couverture en professionnels de santé en zone rurale nécessite des mesures incitatives 
                            pour lutter contre la désertification médicale.
                        </p>
                        <div class="insight-stat">
                            <span class="stat-big">500+</span>
                            <span class="stat-label">Professionnels de santé</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- RECOMMANDATIONS -->
            <section class="conclusion-section">
                <div class="section-icon">🎯</div>
                <h2>Recommandations & Axes de Développement</h2>
                <div class="recommendations-list">
                    <div class="recommendation-item">
                        <div class="recommendation-icon">🏡</div>
                        <div class="recommendation-content">
                            <h3>Accompagnement du Vieillissement</h3>
                            <p>Développer des politiques de maintien à domicile, adapter les logements, renforcer l'aide aux aidants et créer des structures d'accueil adaptées.</p>
                        </div>
                    </div>

                    <div class="recommendation-item">
                        <div class="recommendation-icon">🌱</div>
                        <div class="recommendation-content">
                            <h3>Transition Écologique</h3>
                            <p>Intensifier les efforts en matière de tri sélectif, développer les énergies renouvelables, protéger les ressources en eau et anticiper l'impact du changement climatique.</p>
                        </div>
                    </div>

                    <div class="recommendation-item">
                        <div class="recommendation-icon">🚆</div>
                        <div class="recommendation-content">
                            <h3>Mobilité & Connectivité</h3>
                            <p>Moderniser les infrastructures de transport, développer la multimodalité, améliorer la desserte des zones rurales et poursuivre le déploiement de la fibre optique.</p>
                        </div>
                    </div>

                    <div class="recommendation-item">
                        <div class="recommendation-icon">💼</div>
                        <div class="recommendation-content">
                            <h3>Dynamique Économique</h3>
                            <p>Soutenir l'entrepreneuriat local, favoriser la diversification économique, développer la formation professionnelle et réduire la précarité de l'emploi.</p>
                        </div>
                    </div>

                    <div class="recommendation-item">
                        <div class="recommendation-icon">🏥</div>
                        <div class="recommendation-content">
                            <h3>Accès aux Soins</h3>
                            <p>Lutter contre la désertification médicale, développer la télémédecine, renforcer la prévention santé et faciliter l'installation de jeunes médecins.</p>
                        </div>
                    </div>

                    <div class="recommendation-item">
                        <div class="recommendation-icon">⚽</div>
                        <div class="recommendation-content">
                            <h3>Sport & Bien-être</h3>
                            <p>Moderniser les équipements sportifs existants, développer de nouvelles infrastructures dans les zones sous-équipées et promouvoir l'activité physique pour tous les âges.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- MÉTHODOLOGIE & LIMITES -->
            <section class="conclusion-section grey">
                <div class="section-icon">⚙️</div>
                <h2>Méthodologie & Limites</h2>
                <div class="methodology-box">
                    <h3>Points Forts</h3>
                    <ul>
                        <li>✅ <strong>Données officielles</strong> issues de sources reconnues (INSEE, ministères, collectivités)</li>
                        <li>✅ <strong>Visualisations interactives</strong> facilitant la compréhension des enjeux</li>
                        <li>✅ <strong>Approche multidimensionnelle</strong> couvrant six thématiques clés</li>
                        <li>✅ <strong>Géolocalisation précise</strong> des données pour une vision territoriale fine</li>
                    </ul>
                    
                    <h3>Limites & Précautions</h3>
                    <ul>
                        <li>⚠️ <strong>Temporalité variable</strong> : certaines données datent de 2020-2021 et peuvent ne pas refléter la situation actuelle</li>
                        <li>⚠️ <strong>Granularité limitée</strong> : certaines statistiques sont agrégées au niveau régional</li>
                        <li>⚠️ <strong>Données manquantes</strong> : tous les indicateurs ne sont pas disponibles pour toutes les communes</li>
                        <li>⚠️ <strong>Interprétation</strong> : les corrélations observées ne signifient pas nécessairement des relations de causalité</li>
                    </ul>
                </div>
            </section>

            <!-- PERSPECTIVES -->
            <section class="conclusion-section">
                <div class="section-icon">🚀</div>
                <h2>Perspectives d'Évolution</h2>
                <div class="perspectives-grid">
                    <div class="perspective-card">
                        <i class="fas fa-chart-line perspective-icon"></i>
                        <h3>Données Temps Réel</h3>
                        <p>Intégrer des flux de données en temps réel (météo, qualité de l'air, trafic) pour un suivi dynamique du territoire.</p>
                    </div>

                    <div class="perspective-card">
                        <i class="fas fa-mobile-alt perspective-icon"></i>
                        <h3>Application Mobile</h3>
                        <p>Développer une application mobile dédiée permettant aux citoyens d'accéder aux données territoriales sur le terrain.</p>
                    </div>

                    <div class="perspective-card">
                        <i class="fas fa-brain perspective-icon"></i>
                        <h3>Intelligence Artificielle</h3>
                        <p>Utiliser l'IA pour prédire les évolutions démographiques, anticiper les besoins et optimiser les politiques publiques.</p>
                    </div>

                    <div class="perspective-card">
                        <i class="fas fa-users perspective-icon"></i>
                        <h3>Participation Citoyenne</h3>
                        <p>Permettre aux citoyens de contribuer avec leurs données (crowdsourcing) et d'interagir avec les décideurs.</p>
                    </div>
                </div>
            </section>

            <!-- MESSAGE FINAL -->
            <section class="final-message">
                <div class="final-icon">✨</div>
                <h2>Un Outil au Service du Territoire</h2>
                <p>
                    Ce livre interactif n'est pas une fin en soi, mais un <strong>point de départ</strong> pour mieux comprendre, 
                    analyser et agir sur les enjeux du territoire corse. Il a vocation à évoluer, s'enrichir de nouvelles données 
                    et fonctionnalités, et à servir de support aux décideurs, chercheurs, citoyens et acteurs locaux.
                </p>
                <p>
                    La <strong>data visualisation</strong> n'est pas qu'une question d'esthétique : 
                    c'est un moyen puissant de <strong>révéler l'invisible</strong>, de faire parler les chiffres, 
                    et de transformer l'information brute en <strong>connaissance actionnable</strong>.
                </p>
                <div class="final-quote">
                    <i class="fas fa-quote-left"></i>
                    <p>"Les données sont le nouveau pétrole, mais contrairement au pétrole, elles sont renouvelables et se bonifient avec le partage."</p>
                    <i class="fas fa-quote-right"></i>
                </div>
            </section>

            <!-- REMERCIEMENTS -->
            <section class="thanks-section">
                <h2>Remerciements</h2>
                <p>
                    Ce projet n'aurait pas pu voir le jour sans le travail remarquable des organismes publics 
                    qui collectent, structurent et mettent à disposition les données ouvertes.
                </p>
                <div class="thanks-logos">
                    <div class="thanks-item">
                        <i class="fas fa-database"></i>
                        <span>INSEE</span>
                    </div>
                    <div class="thanks-item">
                        <i class="fas fa-landmark"></i>
                        <span>Data.gouv.fr</span>
                    </div>
                    <div class="thanks-item">
                        <i class="fas fa-mountain"></i>
                        <span>Collectivité de Corse</span>
                    </div>
                    <div class="thanks-item">
                        <i class="fas fa-university"></i>
                        <span>Ministères</span>
                    </div>
                </div>
                <p class="thanks-footer">
                    Merci également aux développeurs des technologies open-source utilisées : 
                    <strong>Cesium.js</strong>, <strong>Chart.js</strong>, <strong>Flask</strong>, et toute la communauté du web.
                </p>
            </section>

            <!-- CTA FINAL -->
            <div class="final-cta">
                <h3>🎓 Concours DataVis 2025</h3>
                <p>Projet réalisé dans le cadre du Concours de Data Visualisation</p>
                <div class="cta-buttons">
                    <button class="cta-btn primary" onclick="alert('Retour au début du livre')">
                        <i class="fas fa-book"></i> Relire le Livre
                    </button>
                    <button class="cta-btn secondary" onclick="alert('Télécharger les sources')">
                        <i class="fas fa-download"></i> Télécharger les Sources
                    </button>
                </div>
                <p class="signature">© 2025 - Portrait des Territoires de Corse</p>
            </div>
        </div>
    `;
}