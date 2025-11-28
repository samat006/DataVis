# Territoires de Corse

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-green.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-black.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

**Projet de Data Visualisation Interactive - Concours 2025**

[Démo](#demo) • [Installation](#installation) • [Documentation](#documentation) • [Contribuer](#contribuer)

</div>

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Sources de Données](#-sources-de-données)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contribuer](#-contribuer)
- [Licence](#-licence)
- [Auteurs](#-auteurs)

---

## 🎯 À Propos

**Portrait des Territoires de Corse** est une application web interactive de data visualisation qui propose une analyse approfondie du territoire corse à travers 6 dimensions fondamentales :

- 📊 **Démographie** - Évolution de la population, pyramide des âges
- 🌍 **Environnement** - Qualité de l'eau, pollution, températures, déchets
- 🏥 **Santé** - Professionnels de santé, services d'urgence
- 🏡 **Bien-être** - Logement, emploi, éducation, transport
- 👴 **Seniors** - Indicateurs de vieillissement, autonomie
- ⚽ **Sport** - Infrastructures sportives, accessibilité

### 🎓 Contexte

Projet réalisé dans le cadre du **Concours DataVis 2025**, ce livre interactif 3D exploite les technologies web modernes pour offrir une expérience immersive de navigation dans les données territoriales.

---

## ✨ Fonctionnalités

### 🗺️ Visualisation 3D
- Cartes interactives avec **Cesium.js**
- Navigation immersive sur le territoire
- Marqueurs géolocalisés pour tous les équipements
- Rotation, zoom, inclinaison de la vue

### 📊 Graphiques Dynamiques
- 27+ graphiques interactifs avec **Chart.js**
- Types variés : lignes, barres, donuts, radar, scatter
- Filtres et tri en temps réel
- Export des données

### 📖 Livre 3D Interactif
- Navigation page par page avec effet de tournage
- Animations fluides et transitions
- Responsive design (desktop, tablette, mobile)
- Mode plein écran

### 🔍 Recherche & Filtres
- Recherche par nom de fichier
- Filtrage multi-critères
- Navigation rapide entre sections
- Tableaux de données triables

### 💾 Export de Données
- API REST pour accès programmatique
- Téléchargement des sources JSON
- Export ZIP complet
- Prévisualisation des fichiers

---

## 🛠️ Technologies

### Backend
- **Python 3.9+** - Langage principal
- **Flask 3.0** - Framework web
- **Flask-CORS** - Gestion des requêtes cross-origin

### Frontend
- **JavaScript ES6+** - Logique interactive
- **HTML5 / CSS3** - Structure et design
- **Cesium.js** - Visualisation 3D et cartographie
- **Chart.js 4.4** - Graphiques statistiques
- **Font Awesome** - Icônes

### Design
- **Space Grotesk** - Typographie moderne
- **CSS Grid / Flexbox** - Layout responsive
- **Animations CSS** - Transitions fluides
- **Glassmorphism** - Effets visuels

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │   HTML5    │  │   CSS3     │  │    JavaScript       │  │
│  │  Templates │  │   Styles   │  │   (ES6 Modules)     │  │
│  └────────────┘  └────────────┘  └─────────────────────┘  │
│                          │                                   │
│                          │  HTTP Requests                    │
│                          ▼                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    FLASK SERVER (Python)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    app.py                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐ │  │
│  │  │   Routes   │  │  API REST  │  │  File System   │ │  │
│  │  │  /         │  │ /api/...   │  │   Handler      │ │  │
│  │  └────────────┘  └────────────┘  └────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │  File I/O
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  data/                                                │  │
│  │  ├── logement/                                        │  │
│  │  │   ├── prix_construction.json                      │  │
│  │  │   └── logements_sociaux.json                      │  │
│  │  ├── education/                                       │  │
│  │  ├── transport/                                       │  │
│  │  └── ...                                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Flux de Données
```
User Action → JavaScript Module → API Request → Flask Route
     ↓                                               ↓
DOM Update ← Response Processing ← JSON Response ← Data Processing
```

---

## 📦 Installation

### Prérequis

- **Python 3.9+** ([Télécharger](https://www.python.org/downloads/))
- **pip** (inclus avec Python)
- Navigateur moderne (Chrome, Firefox, Edge, Safari)

### Étapes d'Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/corse-datavis.git
cd corse-datavis
```

2. **Créer un environnement virtuel** (recommandé)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Préparer les données**
```bash
# Créer les dossiers nécessaires
mkdir -p data/logement data/education data/transport data/sante data/seniors data/sport

# Placer vos fichiers JSON dans les dossiers appropriés
```

5. **Configurer l'application**
```bash
# Créer un fichier .env (optionnel)
cp .env.example .env

# Éditer .env avec vos paramètres
FLASK_ENV=development
FLASK_DEBUG=True
DATA_PATH=./data
```

6. **Lancer le serveur**
```bash
python app.py
```

7. **Ouvrir dans le navigateur**
```
http://localhost:5000
```

---

## 🚀 Utilisation

### Démarrage Rapide
```bash
# 1. Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 2. Lancer le serveur
python app.py

# 3. Ouvrir le navigateur
# http://localhost:5000
```

### Navigation

1. **Page d'Accueil**
   - Vue d'ensemble des statistiques
   - Cartes des territoires
   - Accès rapide au livre 3D

2. **Livre 3D Interactif**
   - Tourner les pages avec les boutons
   - Cliquer sur les cartes pour explorer
   - Interagir avec les graphiques
   - Rechercher des données

3. **Page Sources**
   - Explorer l'arborescence des fichiers
   - Prévisualiser les JSON
   - Télécharger les données

### Raccourcis Clavier

| Touche | Action |
|--------|--------|
| `→` | Page suivante |
| `←` | Page précédente |
| `Home` | Première page |
| `End` | Dernière page |
| `F` | Mode plein écran |
| `Esc` | Quitter plein écran |

---

## 📁 Structure du Projet
```
corse-datavis/
├── app.py                          # Application Flask principale
├── requirements.txt                # Dépendances Python
├── README.md                       # Ce fichier
├── .env.example                    # Variables d'environnement
├── .gitignore                      # Fichiers à ignorer
│
├── data/                           # Données sources (JSON)
│   ├── logement/
│   │   ├── prix_construction.json
│   │   └── logements_sociaux.json
│   ├── education/
│   │   ├── annuaire.json
│   │   └── personnel.json
│   ├── transport/
│   ├── sante/
│   ├── seniors/
│   └── sport/
│
├── templates/                      # Templates HTML
│   └── index.html                  # Page principale
│
└── static/                         # Ressources statiques
    ├── style.css                   # Styles généraux
    ├── home.css                    # Page d'accueil
    ├── source.css                  # Page sources
    ├── introduction.css            # Page introduction
    ├── conclusion-page.css         # Page conclusion
    ├── logement.css                # Dashboard logement
    ├── emploi.css                  # Dashboard emploi
    ├── education.css               # Dashboard éducation
    ├── transport.css               # Dashboard transport
    ├── senior.css                  # Dashboard seniors
    ├── sport.css                   # Dashboard sport
    │
    ├── main.js                     # Script principal
    ├── sources.js                  # Gestion sources
    ├── introduction.js             # Page introduction
    ├── conclusion-page.js          # Page conclusion
    ├── logement.js                 # Dashboard logement
    ├── emploi.js                   # Dashboard emploi
    ├── education.js                # Dashboard éducation
    ├── transport.js                # Dashboard transport
    ├── senior.js                   # Dashboard seniors
    └── sport.js                    # Dashboard sport
```

---

## 🔌 API Endpoints

### Sources de Données

#### `GET /api/sources/tree`
Récupère l'arborescence complète des fichiers

**Réponse**
```json
{
  "tree": {
    "name": "data",
    "type": "folder",
    "children": [...]
  },
  "stats": {
    "folders": 6,
    "files": 25,
    "totalSize": 15728640
  }
}
```

#### `GET /api/sources/download/<path:filepath>`
Télécharge un fichier spécifique

**Exemple**
```bash
curl http://localhost:5000/api/sources/download/logement/prix.json -O
```

#### `GET /api/sources/view/<path:filepath>`
Prévisualise le contenu d'un fichier

**Réponse**
```json
{
  "type": "json",
  "content": {...}
}
```

#### `GET /api/sources/search?q=query`
Recherche des fichiers par nom

**Paramètres**
- `q` (string) : Terme de recherche

**Exemple**
```bash
curl "http://localhost:5000/api/sources/search?q=logement"
```

#### `GET /api/sources/stats`
Statistiques globales des fichiers

**Réponse**
```json
{
  "totalFolders": 6,
  "totalFiles": 25,
  "totalSize": 15728640,
  "byExtension": {
    ".json": {
      "count": 25,
      "size": 15728640
    }
  }
}
```

#### `GET /api/sources/download-all`
Télécharge tous les fichiers en ZIP

**Exemple**
```bash
curl http://localhost:5000/api/sources/download-all -o sources.zip
```

### Santé

#### `GET /api/health`
Vérifie que l'API fonctionne

**Réponse**
```json
{
  "status": "ok",
  "dataPath": "./data",
  "dataPathExists": true
}
```

---

## 📊 Sources de Données

### Organismes Publics

| Source | Description | Format |
|--------|-------------|--------|
| **INSEE** | Statistiques démographiques, économiques et sociales | JSON |
| **Data.gouv.fr** | Données publiques françaises | JSON/CSV |
| **Collectivité de Corse** | Données territoriales locales | JSON |
| **Ministère de la Santé** | Annuaire des professionnels de santé | JSON |
| **Ministère de l'Éducation** | Établissements scolaires | JSON |
| **Ministère de la Transition Écologique** | Environnement, déchets | JSON |

### Datasets Utilisés

- 📊 `insee-population-par-sexe-et-age`
- 📊 `logements-et-logements-sociaux-dans-les-regions`
- 📊 `insee-emp-g2-taux-de-chomage`
- 📊 `annuaire-de-leducation`
- 📊 `terrains-sportifs-en-corse`
- 📊 `60-et-plus-indicateurs-au-niveau-de-la-commune`
- 🌍 `temperature-quotidienne-regionale`
- 🌍 `qualite-eau-potable`
- 🏥 `annuaire-sante-professionnels`
- 🚆 `gtfs-transport-horaires-cars`
- ♻️ `tri-selectif-dechets`

---

## 📸 Screenshots

### Page d'Accueil
![Accueil](docs/screenshots/home.png)

### Livre 3D Interactif
![Livre 3D](docs/screenshots/book.png)

### Dashboard Démographie
![Démographie](docs/screenshots/demo.png)

### Carte 3D Interactive
![Carte 3D](docs/screenshots/map.png)

### Page Sources
![Sources](docs/screenshots/sources.png)

---

## 🗺️ Roadmap

### Version 1.0 ✅
- [x] Application Flask fonctionnelle
- [x] Livre 3D interactif
- [x] 6 dashboards thématiques
- [x] Cartes 3D avec Cesium.js
- [x] 27 graphiques Chart.js
- [x] API REST complète
- [x] Page sources avec téléchargement
- [x] Design responsive

### Version 1.1 🚧
- [ ] Mode sombre
- [ ] Export PDF des pages
- [ ] Partage sur réseaux sociaux
- [ ] Comparaison inter-territoires
- [ ] Favoris et annotations

### Version 2.0 🔮
- [ ] Application mobile (React Native)
- [ ] Données temps réel
- [ ] Intelligence artificielle (prédictions)
- [ ] API GraphQL
- [ ] Multi-langues (corse, anglais)
- [ ] Collaboration en temps réel

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment participer :

### Workflow

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Guidelines

- Suivre le style de code existant
- Écrire des messages de commit clairs
- Documenter les nouvelles fonctionnalités
- Ajouter des tests si possible
- Mettre à jour le README si nécessaire

### Signaler un Bug

Ouvrez une issue avec :
- Description claire du problème
- Étapes pour reproduire
- Comportement attendu vs obtenu
- Screenshots si applicable
- Environnement (OS, navigateur, version Python)

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.
```
MIT License

Copyright (c) 2025 [Votre Nom]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Auteurs

**[Votre Nom]** - *Développeur Principal* 
- GitHub: [@votre-username](https://github.com/votre-username)
- Email: votre.email@example.com
- LinkedIn: [Votre Profil](https://linkedin.com/in/votre-profil)

---

## 🙏 Remerciements

- **INSEE** pour les données démographiques
- **Data.gouv.fr** pour l'ouverture des données publiques
- **Collectivité de Corse** pour les données territoriales
- **Cesium** pour la bibliothèque de visualisation 3D
- **Chart.js** pour les graphiques interactifs
- Communauté **Open Source** pour les outils utilisés

---

## 📞 Support

Pour toute question ou assistance :

- 📧 **Email** : support@corse-datavis.fr
- 💬 **Discord** : [Rejoindre le serveur](https://discord.gg/...)
- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-username/corse-datavis/issues)
- 📖 **Documentation** : [Wiki](https://github.com/votre-username/corse-datavis/wiki)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=votre-username/corse-datavis&type=Date)](https://star-history.com/#votre-username/corse-datavis&Date)

---

<div align="center">

**[⬆ Retour en haut](#-portrait-des-territoires-de-corse)**

Fait avec ❤️ en Corse 🏝️

</div>
