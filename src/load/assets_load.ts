import {StreamZip} from "@drorgl/node-stream-zip";

const extractSprites = async (zip: StreamZip) => {
    await new Promise((resolve, reject) => {
        zip.extract('assets/pixelmon/textures/sprites/pokemon/', './storage/sprites', err => {
            console.log(err ? 'Extract sprites error' : 'Sprites extracted');
            resolve();
        })
    });
};

export {
    extractSprites
}