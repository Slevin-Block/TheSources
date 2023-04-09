const fs = require('fs');
const path = require('path');

const JSON_DIR = '../json/';
const TAG_CID_PINATA = '#TAGCIDPINATA';
const TAG_CID_IPFS = '#TAGCIDIPFS';
const TAG_ADDRESS_MARKETPLACE = '#TAGMARKETPLACE';

// TOKENS_IMG CID

const CID = 'QmcLYdsQJCsYC6W6GJfpzPLxPSToG3cotDnktL7xt8Zh8q'
const CID_PINATA = `https://ipfs.io/ipfs/${CID}/`;
const CID_IPFS = 'ipfs://bafybeigp7taatynbpztnoun6hcepmg6wfjuwluj4ag2672hz2ghgyi3koy/';
const ADDRESS_MARKETPLACE = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';

// Fonction pour parcourir les fichiers JSON dans un répertoire et les modifier
function modifyJsonFiles(directoryPath, newCidPinata, newCidIpfs, addressMarketPlace) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Parcourir tous les fichiers JSON dans le répertoire
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);

      // Lire le fichier JSON
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        // Remplacer les tags par les nouvelles chaînes de caractères
        const newData = data.replace(new RegExp(TAG_CID_PINATA, 'g'), newCidPinata)
                            .replace(new RegExp(TAG_CID_IPFS, 'g'), newCidIpfs)
                            .replace(new RegExp(TAG_ADDRESS_MARKETPLACE, 'g'), addressMarketPlace);

        // Sauvegarder le fichier JSON modifié
        fs.writeFile(filePath, newData, err => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
  });
}

// Appel de la fonction pour modifier les fichiers JSON dans le répertoire spécifié
modifyJsonFiles(JSON_DIR, CID_PINATA, CID_IPFS, ADDRESS_MARKETPLACE);