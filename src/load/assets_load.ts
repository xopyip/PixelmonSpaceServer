import {StreamZip} from "@drorgl/node-stream-zip";
import fs from "fs";

const extractSprites = async (zip: StreamZip) => {
    fs.mkdirSync('storage');
    fs.mkdirSync('storage/sprites');
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