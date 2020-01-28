import {StreamZip} from "@drorgl/node-stream-zip";
import fs from "fs";
import {DropItemModel} from "../models/drops/item";
import {readTexture} from "./mminecraft_load";

const extractSprites = async (zip: StreamZip) => {
    fs.mkdirSync('storage/sprites');
    await new Promise((resolve, reject) => {
        zip.extract('assets/pixelmon/textures/sprites/pokemon/', './storage/sprites', err => {
            console.log(err ? 'Extract sprites error' : 'Sprites extracted');
            resolve();
        })
    });
};

const PixelmonMappings: { [key: string]: string } = {
    "pc": "pc_block",
};

const PixelmonTranslations: { [key: string]: string } = {
    "pc": "PC",
};

const loadPixelmonItems = async (zip: StreamZip) => {
    const names: { [key: string]: string } = {};
    const namePattern = /item\.(.*)\.name/;
    fs.mkdirSync('./storage/items', {recursive: true});
    for (let line of zip.entryDataSync("assets/pixelmon/lang/en_US.lang").toString().split("\n")) {
        if (namePattern.test(line)) {
            let match = namePattern.exec(line);
            if (match === null) {
                continue;
            }
            names[match[1]] = line.split("=")[1];
        }
    }
    let items = await DropItemModel.find({item: /pixelmon(.*)/}).exec();
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let nn = names[item.item.substr("pixelmon:".length)];
        let final_name = item.item.substr("pixelmon:".length).replace("_ore", "");
        if (PixelmonMappings[final_name] !== undefined) {
            final_name = PixelmonMappings[final_name];
        }
        if (PixelmonTranslations[final_name] !== undefined) {
            nn = PixelmonTranslations[final_name];
        }
        let texture = readTexture(zip, "assets/pixelmon/models/", `item/${final_name}.json`);
        if (texture === undefined) {
            console.log("[!] Texture for " + final_name + " not found.");
            continue;
        }
        let itemTexture = `${texture}.png` || "";
        itemTexture = itemTexture.substring(itemTexture.lastIndexOf("/") + 1);
        itemTexture = "pixelmon_" + itemTexture;
        if (texture.indexOf(":") != -1) {
            texture = texture.split(":")[1];
        }
        texture = texture.toLowerCase();

        await new Promise((resolve, reject) => {
            zip.extractFile(zip.entry(`assets/pixelmon/textures/${texture}.png`), `./storage/items/${itemTexture}.png`, err => {
                if (err) console.log(`Extract item error ${err}`);
                resolve();
            });
        });
        if (nn === undefined) {
            console.log("[!] Translation for " + item.item.substr("pixelmon:".length) + " not found.");
            continue;
        }
        await DropItemModel.update({_id: item._id}, {texture: itemTexture, translations: [nn]});
    }
};

export {
    extractSprites,
    loadPixelmonItems
}