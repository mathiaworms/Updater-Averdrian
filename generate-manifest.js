const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Fonction pour calculer le hachage d'un fichier
function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (chunk) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// Fonction pour obtenir la liste des fichiers avec leurs métadonnées
async function getFilesList(dir) {
  let results = [];
  
  // Lire tous les fichiers et dossiers dans le répertoire courant
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Si c'est un répertoire, le parcourir récursivement
      results = results.concat(await getFilesList(filePath));
    } else {
      // Sinon, ajouter le fichier avec ses métadonnées
      const hash = await calculateFileHash(filePath);
      results.push({
        name: path.relative('./CDN', filePath), // Chemin relatif pour plus de clarté
        size: stats.size,
        type: path.extname(filePath), // Type de fichier basé sur l'extension
        hash: hash // Ajouter le hachage
      });
    }
  }

  return results;
}

// Générer le manifeste
(async () => {
  try {
    const manifest = {
      files: await getFilesList('./CDN') // Spécifiez le répertoire racine à parcourir
    };

    // Écrire le manifeste dans un fichier
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));

    console.log('Manifeste généré avec succès.');
  } catch (error) {
    console.error('Erreur lors de la génération du manifeste:', error);
  }
})();
