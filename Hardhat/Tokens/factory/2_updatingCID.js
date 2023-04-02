const fs = require('fs');
const path = require('path');

const JSON_DIR = '../json/';
const TAG_CID_PINATA = '#TAGCIDPINATA';
const TAG_CID_IPFS = '#TAGCIDIPFS';
const TAG_ADDRESS_MARKETPLACE = '#TAGMARKETPLACE';

const CID_PINATA = 'https://gateway.pinata.cloud/ipfs/QmXrDH8xL4nDyoP1HpmbGYQCrfXiTN4w7FhTpPmDfipa3Q/';
const CID_IPFS = 'ipfs://bafybeienjpnc3dcaeqyxkt3eodjfpemparjn655d6u2isxlc5qugm3rj24/';
const ADDRESS_MARKETPLACE = '0x';

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