import json, glob
import os
from flask import Flask, jsonify, send_file, request,render_template
from flask_cors import CORS
import os
import json
from pathlib import Path
from datetime import datetime
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

ajouter_donnees_au_chapitre(livre, chapitre_id=2, dossier="Chapitre_2")
update_donnees_au_chapitre("DonneEnv",livre, chapitre_id=3, dossier="Chapitre_3/pollution")
ajouter_donnees_au_chapitre(livre, chapitre_id=3, dossier="Chapitre_3/eau")
ajouter_donnees_au_chapitre(livre, chapitre_id=3, dossier="Chapitre_3/temp")
ajouter_donnees_au_chapitre(livre, chapitre_id=3, dossier="Chapitre_3/dechet")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="Chapitre_4/sante")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="Chapitre_4/log")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="Chapitre_4/job")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="Chapitre_4/education")
ajouter_donnees_au_chapitre(livre, chapitre_id=4, dossier="Chapitre_4/transport")
ajouter_donnees_au_chapitre(livre, chapitre_id=5, dossier="chapitre_5/senior")
ajouter_donnees_au_chapitre(livre, chapitre_id=5, dossier="chapitre_5/sport")








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




app = Flask(__name__)
CORS(app)  # Permettre les requêtes cross-origin

# Configuration
FOLDER_PATH = "/Users/seck/Documents/portrer/portrait/data"  # Chemin vers vos données
ALLOWED_EXTENSIONS = {'.json', '.csv', '.txt', '.pdf', '.xlsx', '.xls'}

def get_file_size(path):
    """Obtenir la taille d'un fichier en bytes"""
    try:
        return os.path.getsize(path)
    except:
        return 0

def get_file_modified_date(path):
    """Obtenir la date de modification"""
    try:
        timestamp = os.path.getmtime(path)
        return datetime.fromtimestamp(timestamp).isoformat()
    except:
        return None

def build_tree_structure(path, relative_to=None):
    """
    Construire récursivement la structure de l'arborescence
    """
    if relative_to is None:
        relative_to = path
    
    name = os.path.basename(path)
    
    # Si c'est un fichier
    if os.path.isfile(path):
        extension = Path(path).suffix
        relative_path = os.path.relpath(path, relative_to)
        
        return {
            "name": name,
            "type": "file",
            "path": relative_path.replace("\\", "/"),
            "size": get_file_size(path),
            "extension": extension,
            "modified": get_file_modified_date(path)
        }
    
    # Si c'est un dossier
    elif os.path.isdir(path):
        children = []
        try:
            items = sorted(os.listdir(path))
            for item in items:
                # Ignorer les fichiers cachés
                if item.startswith('.'):
                    continue
                
                child_path = os.path.join(path, item)
                child_node = build_tree_structure(child_path, relative_to)
                
                if child_node:
                    children.append(child_node)
        except PermissionError:
            pass
        
        return {
            "name": name,
            "type": "folder",
            "path": os.path.relpath(path, relative_to).replace("\\", "/"),
            "children": children
        }
    
    return None

@app.route('/api/sources/tree', methods=['GET'])
def get_sources_tree():
    """
    Récupérer l'arborescence complète des sources
    """
    try:
        if not os.path.exists(FOLDER_PATH):
            return jsonify({
                "error": "Le dossier de données n'existe pas",
                "path": FOLDER_PATH
            }), 404
        
        tree = build_tree_structure(FOLDER_PATH)
        
        # Calculer les statistiques
        stats = calculate_tree_stats(tree)
        
        return jsonify({
            "tree": tree,
            "stats": stats
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def calculate_tree_stats(node):
    """Calculer les statistiques de l'arborescence"""
    stats = {"folders": 0, "files": 0, "totalSize": 0}
    
    if node["type"] == "folder":
        stats["folders"] = 1
        for child in node.get("children", []):
            child_stats = calculate_tree_stats(child)
            stats["folders"] += child_stats["folders"]
            stats["files"] += child_stats["files"]
            stats["totalSize"] += child_stats["totalSize"]
    else:
        stats["files"] = 1
        stats["totalSize"] = node.get("size", 0)
    
    return stats

@app.route('/api/sources/download/<path:filepath>', methods=['GET'])
def download_file(filepath):
    """
    Télécharger un fichier spécifique
    """
    try:
        # Sécurité : empêcher l'accès aux fichiers en dehors du dossier
        safe_path = os.path.normpath(os.path.join(FOLDER_PATH, filepath))
        
        if not safe_path.startswith(os.path.abspath(FOLDER_PATH)):
            return jsonify({"error": "Accès refusé"}), 403
        
        if not os.path.exists(safe_path):
            return jsonify({"error": "Fichier introuvable"}), 404
        
        if not os.path.isfile(safe_path):
            return jsonify({"error": "Ce n'est pas un fichier"}), 400
        
        # Télécharger le fichier
        return send_file(
            safe_path,
            as_attachment=True,
            download_name=os.path.basename(safe_path)
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sources/view/<path:filepath>', methods=['GET'])
def view_file(filepath):
    """
    Voir le contenu d'un fichier (JSON, TXT, CSV)
    """
    try:
        # Sécurité
        safe_path = os.path.normpath(os.path.join(FOLDER_PATH, filepath))
        
        if not safe_path.startswith(os.path.abspath(FOLDER_PATH)):
            return jsonify({"error": "Accès refusé"}), 403
        
        if not os.path.exists(safe_path):
            return jsonify({"error": "Fichier introuvable"}), 404
        
        extension = Path(safe_path).suffix.lower()
        
        # JSON
        if extension == '.json':
            with open(safe_path, 'r', encoding='utf-8') as f:
                content = json.load(f)
            return jsonify({
                "type": "json",
                "content": content
            })
        
        # Texte brut (TXT, CSV, etc.)
        elif extension in ['.txt', '.csv', '.md']:
            with open(safe_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return jsonify({
                "type": "text",
                "content": content
            })
        
        else:
            return jsonify({
                "error": "Type de fichier non supporté pour l'aperçu",
                "extension": extension
            }), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sources/search', methods=['GET'])
def search_files():
    """
    Rechercher des fichiers par nom
    """
    try:
        query = request.args.get('q', '').lower()
        
        if not query:
            return jsonify({"error": "Paramètre 'q' requis"}), 400
        
        results = []
        
        # Parcourir récursivement
        for root, dirs, files in os.walk(FOLDER_PATH):
            for file in files:
                if query in file.lower():
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, FOLDER_PATH)
                    
                    results.append({
                        "name": file,
                        "path": relative_path.replace("\\", "/"),
                        "size": get_file_size(file_path),
                        "modified": get_file_modified_date(file_path)
                    })
        
        return jsonify({
            "query": query,
            "count": len(results),
            "results": results
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sources/stats', methods=['GET'])
def get_stats():
    """
    Obtenir les statistiques globales
    """
    try:
        stats = {
            "totalFolders": 0,
            "totalFiles": 0,
            "totalSize": 0,
            "byExtension": {}
        }
        
        for root, dirs, files in os.walk(FOLDER_PATH):
            stats["totalFolders"] += len(dirs)
            stats["totalFiles"] += len(files)
            
            for file in files:
                file_path = os.path.join(root, file)
                file_size = get_file_size(file_path)
                stats["totalSize"] += file_size
                
                # Par extension
                ext = Path(file).suffix.lower()
                if ext not in stats["byExtension"]:
                    stats["byExtension"][ext] = {
                        "count": 0,
                        "size": 0
                    }
                stats["byExtension"][ext]["count"] += 1
                stats["byExtension"][ext]["size"] += file_size
        
        return jsonify(stats)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sources/download-all', methods=['GET'])
def download_all():
    """
    Télécharger tous les fichiers en ZIP
    """
    try:
        import zipfile
        import io
        
        # Créer un fichier ZIP en mémoire
        memory_file = io.BytesIO()
        
        with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(FOLDER_PATH):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, FOLDER_PATH)
                    zipf.write(file_path, arcname)
        
        memory_file.seek(0)
        
        return send_file(
            memory_file,
            mimetype='application/zip',
            as_attachment=True,
            download_name='sources_donnees.zip'
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Vérifier que l'API fonctionne"""
    return jsonify({
        "status": "ok",
        "dataPath": FOLDER_PATH,
        "dataPathExists": os.path.exists(FOLDER_PATH)
    })


@app.route('/')
def index():
    return render_template('index.html', 
                         livre=list(livre),
                         stats=GLOBAL_STATS)




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