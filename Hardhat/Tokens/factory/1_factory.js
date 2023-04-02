const fs = require('fs');
const Canvas = require('canvas');

const NBRTOKEN = 10
const IMG_DIR = '../img/';
const JSON_DIR = '../json/';
const IMG_EXTENSION = '.png';
const SERIAL_NUMBER_LENGTH = 12;

// Random Tag generator
function generateTag() {
    const chars = 'abcdefghijklmnopABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tag = '';
    for (let i = 0; i < SERIAL_NUMBER_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        tag += chars[randomIndex];
    }
    return tag;
}

// Integration Tag onto background
async function drawtagOnImage(imagePath, tag, index) {
    const img = await Canvas.loadImage(imagePath);
    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // IMAGE
    ctx.drawImage(img, 0, 0);

    // TAG
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.fillText(`[${index.toString().padStart(8, '0')}]`, canvas.width * 0.95, canvas.height * 0.95);

    // INDEX
    /* ctx.font = '60px bold Arial';
    const fontHeight = parseInt(ctx.font);
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(`#${index}`, canvas.width /2, (canvas.height - fontHeight) / 2 + fontHeight);
    */

    return canvas;
}

// Fonction pour enregistrer une image et son numéro de série dans un fichier JSON
function saveImageAndJson(imageData, tag, index) {
    const imageFileName = `${index}${IMG_EXTENSION}`;
    const jsonFileName = `${JSON_DIR}${index}.json`;
    fs.writeFileSync(`${IMG_DIR}${imageFileName}`, imageData);
    const jsonData =
    {
        description: `Member Token of TheSource https://the-sources.vercel.app/`,
        image: `#TAGCIDPINATA${imageFileName}`,
        external_url: `#TAGCIDIPFS${imageFileName}`,
        name: 'MemberToken TheSource',
        seller_fee_basis_points: 250,
        fee_recipient: "#TAGMARKETPLACE",
        attributes: [
            {
                trait_type: 'tag',
                value: tag,
            }
        ]
    };
    fs.writeFileSync(jsonFileName, JSON.stringify(jsonData));
}

// Fonction pour générer des images et leurs fichiers JSON associés
async function generateImages(numImages) {

    for (let DIR of [IMG_DIR, JSON_DIR]) {
        try {
            if (fs.existsSync(DIR)) fs.rmSync(DIR, { recursive: true });
            fs.mkdirSync(DIR);
        } catch (err) {
            console.log(err)
        }
    }

    for (let i = 1; i <= numImages; i++) {
        const tag = generateTag();
        const canvas = await drawtagOnImage('./background.png', tag, i)
        const imageData = canvas.toBuffer();
        saveImageAndJson(imageData, tag, i);
    }
}

// Appel de la fonction pour générer 10 images
generateImages(NBRTOKEN);