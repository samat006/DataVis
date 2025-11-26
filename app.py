from flask import Flask, render_template, jsonify
import json, glob
import os

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False



LIVRE = {}
GLOBAL_STATS = {}
#MIN_POPULATION = 1000  # seuil pour considérer "ville"


# Charger la structure du livre
with open("data/livre.json", "r", encoding="utf-8") as f:
    livre = json.load(f)


# =========================
# Fonctions utilitaires
# =========================

def ajouter_donnees_au_chapitre(livre, chapitre_id, dossier):
    """
    Ajoute les fichiers JSON d'un dossier donné
    au chapitre correspondant dans le livre.
    """
    folder_path = os.path.join("data", dossier)
    files_to_add = glob.glob(os.path.join(folder_path, "*.json"))

    chapitre_trouve = False

    for chap in livre:
        if chap.get("id") == chapitre_id:

            # Initialiser la clé "data" si elle n'existe pas
            if "data" not in chap or not isinstance(chap["data"], dict):
                chap["data"] = {}

            # Ajouter le contenu des fichiers
            for filepath in files_to_add:
                with open(filepath, "r", encoding="utf-8") as f:
                    contenu = json.load(f)
                    nom_fichier = os.path.splitext(os.path.basename(filepath))[0]

                    chap["data"][nom_fichier] = contenu

                    

            chapitre_trouve = True
            break

    if not chapitre_trouve:
        raise ValueError(f"Le chapitre {chapitre_id} n'existe pas dans la structure du livre.")


def update_donnees_au_chapitre(cle ,livre, chapitre_id, dossier):
    """
    Fusionne directement le contenu des fichiers JSON
    dans chap["data"].
    """
    folder_path = os.path.join("data", dossier)
    files_to_add = glob.glob(os.path.join(folder_path, "*.json"))

    chapitre_trouve = False
   
    for chap in livre:
        if chap.get("id") == chapitre_id:

            # data devient un dict
            if "data" not in chap or not isinstance(chap["data"], dict):
                chap["data"] = {}

            # initialiser la clé "env"
            if cle not in chap["data"]:
                chap["data"][cle] = []

            # fusionner les fichiers
            for filepath in files_to_add:
                with open(filepath, "r", encoding="utf-8") as f:
                    contenu = json.load(f)

                    if isinstance(contenu, list):
                        chap["data"][cle].extend(contenu)

                    elif isinstance(contenu, dict):
                        chap["data"][cle].append(contenu)

                    else:
                        raise ValueError(f"{filepath} format invalide")

            chapitre_trouve = True
            break

# =========================
# Insertion des données
# =========================

ajouter_donnees_au_chapitre(livre, chapitre_id=2, dossier="pop")
update_donnees_au_chapitre("DonneEnv",livre, chapitre_id=3, dossier="environnemental/pollution")
ajouter_donnees_au_chapitre(livre, chapitre_id=3, dossier="environnemental/eau")
ajouter_donnees_au_chapitre(livre, chapitre_id=3, dossier="environnemental/temp")
ajouter_donnees_au_chapitre(livre, chapitre_id=3, dossier="environnemental/dechet")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="bienPop/sante")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="bienPop/log")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="bienPop/job")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="bienPop/education")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="bienPop/transport")







# =========================
# Sauvegarde
# =========================

with open("data/livre_mis_a_jour.json", "w", encoding="utf-8") as f:
    json.dump(livre, f, ensure_ascii=False, indent=4)


GLOBAL_STATS =  {
    "total_population": 360200,
    "annual_growth": 1.0,
    "new_residents_per_year": 3900,
    "aging_population_65plus": 25,
    "avi_fibre_c overage": 84,
    "5g_antennas": 953,
    "students": 48818,
    "sports_clubs": 170,
    "data_sources": ["INSEE", "ARCEP", "Académie de Corse", "Collectivité de Corse"],
    "last_update": "2025-11-17"
  }
#result = LIVRE | GLOBAL_STATS
LIVRE = livre

@app.route('/')
def index():
    return render_template('index.html', 
                         livre=list(livre),
                         stats=GLOBAL_STATS)

@app.route('/api/cities')
def api_cities():
    return jsonify({"success": True, "cities": LIVRE})

@app.route('/api/city/<city_id>')
def api_city(city_id):
    if city_id not in LIVRE:
        return jsonify({"success": False, "error": "Not found"}), 404
    return jsonify({"success": True, "city": LIVRE[city_id]})

@app.route('/api/stats')
def api_stats():
    return jsonify({"success": True, "stats": GLOBAL_STATS})

if __name__ == '__main__':
    print("🏆 CORSE DATAVIS - http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5001)