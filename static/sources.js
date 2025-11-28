/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📁 PAGE SOURCES - ARBORESCENCE FICHIERS
 * ════════════════════════════════════════════════════════════════════════════════
 */

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛠️ FONCTIONS UTILITAIRES
 * ════════════════════════════════════════════════════════════════════════════════
 */

function formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(extension) {
    const icons = {
        'json': 'fas fa-file-code',
        'csv': 'fas fa-file-csv',
        'txt': 'fas fa-file-alt',
        'pdf': 'fas fa-file-pdf',
        'xlsx': 'fas fa-file-excel',
        'xls': 'fas fa-file-excel',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'zip': 'fas fa-file-archive',
        'png': 'fas fa-file-image',
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'md': 'fas fa-file-alt'
    };
    
    return icons[extension] || 'fas fa-file';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📡 APPELS API
 * ════════════════════════════════════════════════════════════════════════════════
 */

async function loadSourcesTree(pageIndex) {
    try {
        const response = await fetch(`${API_BASE_URL}/sources/tree`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Arborescence chargée:', data);
            return data;
        } else {
            console.error('❌ Erreur API:', data.error);
            return null;
        }
    } catch (error) {
        console.error('❌ Erreur réseau:', error);
        return null;
    }
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎨 CRÉATION DE LA PAGE
 * ════════════════════════════════════════════════════════════════════════════════
 */

export async function createSourcesPage(pageIndex) {
    console.log('📁 Création page sources...');
    
    // Charger les données
    const sourcesData = await loadSourcesTree(pageIndex);
    
    if (!sourcesData) {
        return `
            <div class="sources-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger l'arborescence des sources.</p>
                <p style="font-size: 0.9em; color: #6b7280; margin-top: 10px;">
                    Assurez-vous que le serveur Flask est démarré sur http://localhost:5000
                </p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Réessayer
                </button>
            </div>
        `;
    }
    
    const { tree, stats } = sourcesData;
    
    return `
        <div class="sources-dashboard">
            <!-- EN-TÊTE -->
            <div class="sources-header">
                <div class="header-content">
                    <h2><i class="fas fa-database"></i> Sources de Données</h2>
                    <p>Accédez à tous les fichiers de données utilisés dans ce livre</p>
                </div>
                <div class="header-stats">
                    <div class="stat-badge">
                        <i class="fas fa-folder"></i>
                        <span>${stats.folders}</span>
                        <label>Dossiers</label>
                    </div>
                    <div class="stat-badge">
                        <i class="fas fa-file"></i>
                        <span>${stats.files}</span>
                        <label>Fichiers</label>
                    </div>
                    <div class="stat-badge">
                        <i class="fas fa-hdd"></i>
                        <span>${formatSize(stats.totalSize)}</span>
                        <label>Taille totale</label>
                    </div>
                </div>
            </div>
            
            <!-- BARRE DE RECHERCHE -->
            <div class="sources-search">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input 
                        type="text" 
                        id="sources-search-input-${pageIndex}" 
                        placeholder="Rechercher un fichier ou dossier..."
                        oninput="filterSources(${pageIndex}, this.value)"
                    >
                    <button class="clear-btn" onclick="clearSearch(${pageIndex})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-actions">
                    <button class="action-btn" onclick="expandAll(${pageIndex})">
                        <i class="fas fa-folder-open"></i> Tout ouvrir
                    </button>
                    <button class="action-btn" onclick="collapseAll(${pageIndex})">
                        <i class="fas fa-folder"></i> Tout fermer
                    </button>
                    <button class="action-btn primary" onclick="downloadAll()">
                        <i class="fas fa-download"></i> Tout télécharger
                    </button>
                </div>
            </div>
            
            <!-- ARBORESCENCE -->
            <div class="sources-tree" id="sources-tree-${pageIndex}">
                ${renderTree(tree, pageIndex, 0)}
            </div>
            
            <!-- MESSAGE VIDE -->
            <div class="sources-empty" id="sources-empty-${pageIndex}" style="display: none;">
                <i class="fas fa-search"></i>
                <h3>Aucun résultat</h3>
                <p>Aucun fichier ne correspond à votre recherche</p>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🌳 RENDU DE L'ARBORESCENCE
 * ════════════════════════════════════════════════════════════════════════════════
 */

function renderTree(node, pageIndex, level) {
    if (!node) return '';
    
    if (node.type === 'folder') {
        return renderFolder(node, pageIndex, level);
    } else {
        return renderFile(node, pageIndex, level);
    }
}

function renderFolder(folder, pageIndex, level) {
    const indent = level * 20;
    const hasChildren = folder.children && folder.children.length > 0;
    const childrenCount = hasChildren ? folder.children.length : 0;
    
    // Calculer la taille totale du dossier
    let totalSize = 0;
    if (hasChildren) {
        const calculateFolderSize = (node) => {
            if (node.type === 'file') {
                return node.size || 0;
            } else if (node.type === 'folder' && node.children) {
                return node.children.reduce((sum, child) => sum + calculateFolderSize(child), 0);
            }
            return 0;
        };
        totalSize = calculateFolderSize(folder);
    }
    
    let html = `
        <div class="tree-folder" data-level="${level}" style="padding-left: ${indent}px;">
            <div class="folder-header" onclick="toggleFolder(this, ${pageIndex})">
                <i class="fas fa-chevron-right folder-toggle"></i>
                <i class="fas fa-folder folder-icon"></i>
                <span class="folder-name">${folder.name}</span>
                <span class="folder-count">${childrenCount} élément${childrenCount > 1 ? 's' : ''}</span>
                <span class="folder-size">${formatSize(totalSize)}</span>
            </div>
            <div class="folder-children" style="display: none;">
    `;
    
    if (hasChildren) {
        folder.children.forEach(child => {
            html += renderTree(child, pageIndex, level + 1);
        });
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function renderFile(file, pageIndex, level) {
    const indent = level * 20;
    const extension = file.extension ? file.extension.substring(1) : '';
    const icon = getFileIcon(extension);
    
    return `
        <div class="tree-file" data-level="${level}" data-filename="${file.name.toLowerCase()}" style="padding-left: ${indent}px;">
            <div class="file-header">
                <i class="${icon} file-icon"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatSize(file.size || 0)}</span>
                <div class="file-actions">
                    <button 
                        class="file-action-btn view" 
                        onclick="viewFile('${file.path}', '${file.name}', ${pageIndex})"
                        title="Aperçu"
                    >
                        <i class="fas fa-eye"></i>
                    </button>
                    <button 
                        class="file-action-btn download" 
                        onclick="downloadFile('${file.path}', '${file.name}')"
                        title="Télécharger"
                    >
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🎬 ACTIONS INTERACTIVES
 * ════════════════════════════════════════════════════════════════════════════════
 */

window.toggleFolder = function(element, pageIndex) {
    const folder = element.closest('.tree-folder');
    const children = folder.querySelector('.folder-children');
    const toggle = folder.querySelector('.folder-toggle');
    const icon = folder.querySelector('.folder-icon');
    
    if (children.style.display === 'none') {
        children.style.display = 'block';
        toggle.style.transform = 'rotate(90deg)';
        icon.classList.remove('fa-folder');
        icon.classList.add('fa-folder-open');
    } else {
        children.style.display = 'none';
        toggle.style.transform = 'rotate(0deg)';
        icon.classList.remove('fa-folder-open');
        icon.classList.add('fa-folder');
    }
};

window.expandAll = function(pageIndex) {
    const tree = document.getElementById(`sources-tree-${pageIndex}`);
    if (!tree) return;
    
    const folders = tree.querySelectorAll('.tree-folder');
    
    folders.forEach(folder => {
        const children = folder.querySelector('.folder-children');
        const toggle = folder.querySelector('.folder-toggle');
        const icon = folder.querySelector('.folder-icon');
        
        if (children && toggle && icon) {
            children.style.display = 'block';
            toggle.style.transform = 'rotate(90deg)';
            icon.classList.remove('fa-folder');
            icon.classList.add('fa-folder-open');
        }
    });
};

window.collapseAll = function(pageIndex) {
    const tree = document.getElementById(`sources-tree-${pageIndex}`);
    if (!tree) return;
    
    const folders = tree.querySelectorAll('.tree-folder');
    
    folders.forEach(folder => {
        const children = folder.querySelector('.folder-children');
        const toggle = folder.querySelector('.folder-toggle');
        const icon = folder.querySelector('.folder-icon');
        
        if (children && toggle && icon) {
            children.style.display = 'none';
            toggle.style.transform = 'rotate(0deg)';
            icon.classList.remove('fa-folder-open');
            icon.classList.add('fa-folder');
        }
    });
};

window.filterSources = function(pageIndex, query) {
    const tree = document.getElementById(`sources-tree-${pageIndex}`);
    const empty = document.getElementById(`sources-empty-${pageIndex}`);
    
    if (!tree || !empty) return;
    
    const searchLower = query.toLowerCase().trim();
    
    if (!searchLower) {
        // Réinitialiser
        tree.querySelectorAll('.tree-file, .tree-folder').forEach(el => {
            el.style.display = '';
        });
        tree.style.display = 'block';
        empty.style.display = 'none';
        return;
    }
    
    let hasResults = false;
    
    // Filtrer les fichiers
    tree.querySelectorAll('.tree-file').forEach(file => {
        const filename = file.dataset.filename || '';
        if (filename.includes(searchLower)) {
            file.style.display = '';
            hasResults = true;
            
            // Montrer tous les parents
            let parent = file.closest('.folder-children');
            while (parent) {
                parent.style.display = 'block';
                const parentFolder = parent.closest('.tree-folder');
                if (parentFolder) {
                    parentFolder.style.display = '';
                    const toggle = parentFolder.querySelector('.folder-toggle');
                    const icon = parentFolder.querySelector('.folder-icon');
                    if (toggle && icon) {
                        toggle.style.transform = 'rotate(90deg)';
                        icon.classList.remove('fa-folder');
                        icon.classList.add('fa-folder-open');
                    }
                }
                parent = parentFolder ? parentFolder.parentElement.closest('.folder-children') : null;
            }
        } else {
            file.style.display = 'none';
        }
    });
    
    // Filtrer les dossiers vides
    tree.querySelectorAll('.tree-folder').forEach(folder => {
        const children = folder.querySelector('.folder-children');
        if (children) {
            const hasVisibleChildren = Array.from(children.children).some(
                child => child.style.display !== 'none'
            );
            
            if (!hasVisibleChildren) {
                folder.style.display = 'none';
            }
        }
    });
    
    // Afficher message vide si besoin
    if (hasResults) {
        tree.style.display = 'block';
        empty.style.display = 'none';
    } else {
        tree.style.display = 'none';
        empty.style.display = 'flex';
    }
};

window.clearSearch = function(pageIndex) {
    const input = document.getElementById(`sources-search-input-${pageIndex}`);
    if (input) {
        input.value = '';
        filterSources(pageIndex, '');
    }
};

window.downloadFile = function(filePath, fileName) {
    console.log('📥 Téléchargement:', filePath);
    
    const url = `${API_BASE_URL}/sources/download/${encodeURIComponent(filePath)}`;
    
    // Créer un lien temporaire pour télécharger
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('✅ Téléchargement démarré', `${fileName} est en cours de téléchargement`);
};

window.viewFile = async function(filePath, fileName, pageIndex) {
    console.log('👁️ Aperçu:', filePath);
    
    try {
        const response = await fetch(`${API_BASE_URL}/sources/view/${encodeURIComponent(filePath)}`);
        const data = await response.json();
        
        if (response.ok) {
            let content = '';
            if (data.type === 'json') {
                content = JSON.stringify(data.content, null, 2);
            } else if (data.type === 'text') {
                content = data.content;
            }
            showPreviewModal(fileName, content, pageIndex);
        } else {
            showNotification('❌ Erreur', data.error || 'Impossible d\'afficher l\'aperçu');
        }
    } catch (error) {
        console.error('❌ Erreur aperçu:', error);
        showNotification('❌ Erreur', 'Impossible d\'afficher l\'aperçu');
    }
};

window.downloadAll = function() {
    showNotification('📦 Préparation', 'Création de l\'archive ZIP en cours...');
    
    const url = `${API_BASE_URL}/sources/download-all`;
    window.open(url, '_blank');
};

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🔔 NOTIFICATIONS
 * ════════════════════════════════════════════════════════════════════════════════
 */

function showNotification(title, message) {
    // Supprimer les anciennes notifications
    const oldNotifs = document.querySelectorAll('.source-notification');
    oldNotifs.forEach(n => n.remove());
    
    // Créer notification
    const notification = document.createElement('div');
    notification.className = 'source-notification';
    notification.innerHTML = `
        <strong>${title}</strong>
        <p>${message}</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🖼️ MODAL APERÇU
 * ════════════════════════════════════════════════════════════════════════════════
 */

function showPreviewModal(fileName, content, pageIndex) {
    // Supprimer les anciens modals
    const oldModals = document.querySelectorAll('.preview-modal');
    oldModals.forEach(m => m.remove());
    
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <h3><i class="fas fa-eye"></i> ${fileName}</h3>
                <button onclick="this.closest('.preview-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="preview-body">
                <pre><code>${escapeHtml(content)}</code></pre>
            </div>
        </div>
    `;
    
    // Fermer en cliquant sur le fond
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('show'), 100);
}