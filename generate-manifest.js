const fs = require('fs');
const path = require('path');

// Fonction pour obtenir la liste des fichiers avec leurs métadonnées
function getFilesList(dir) {
  let results = [];
  
  // Lire tous les fichiers et dossiers dans le répertoire courant
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Si c'est un répertoire, le parcourir récursivement
      results = results.concat(getFilesList(filePath));
    } else {
      // Sinon, ajouter le fichier avec ses métadonnées
      results.push({
        name: path.relative('./', filePath), // Chemin relatif pour plus de clarté
        size: stats.size,
        type: path.extname(filePath) // Type de fichier basé sur l'extension
      });
    }
  });

  return results;
}

// Générer le manifeste
const manifest = {
  files: getFilesList('./') // Spécifiez le répertoire racine à parcourir
};

// Écrire le manifeste dans un fichier
fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));

console.log('Manifeste généré avec succès.');
