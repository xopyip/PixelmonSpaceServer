import {IncomingMessage} from "http";
import {StreamZip} from "@drorgl/node-stream-zip";
import {DropItemModel} from "../models/drops/item";

const fs = require('fs');
const fse = require('fs-extra');
const VanillaMappings: { [key: string]: string } = require("./item_mapping.json");

const http = require("http"),
    https = require("https");

function getContent(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        (url.startsWith("https") ? https : http).get(url, (response: IncomingMessage) => {
            let content = '';
            response.on("data", (data) => {
                content += data;
            });
            response.on("end", () => {
                resolve(content);
            });
        }).on("error", (error: Error) => {
            reject(error);
        });
    });
}

function getAssetURL(hash: string) {
    return `http://resources.download.minecraft.net/${hash.substr(0, 2)}/${hash}`
}

function downloadFile(url: string, path: string): Promise<null> {
    const file = fs.createWriteStream(path);
    return new Promise<null>((resolve, reject) => {
        https.get(url, function (response: IncomingMessage) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                resolve();
            });
        });
    });
}

function readTexture(zip: StreamZip, dir: string, path: string): string | undefined {

    let model = JSON.parse(zip.entryDataSync(dir + path).toString());
    if (model.textures !== undefined) {
        return model.textures.layer0 || model.textures.texture || model.textures.front || model.textures.side || model.textures.all;
    }
    if (model.parent !== undefined) {
        return readTexture(zip, dir, model.parent + ".json");
    }
    return undefined;
}

async function loadMinecraft(): Promise<null> {
    fs.mkdirSync("./storage/items");
    let content = await getContent("https://launchermeta.mojang.com/mc/game/version_manifest.json");
    let versions: { id: string, type: string, url: string }[] = JSON.parse(content).versions;
    let versionURL = null;
    for (let version of versions) {
        if (version.type === "release") {
            versionURL = version.url;
            break;
        }
    }
    if (versionURL === null) {
        return new Promise((resolve, reject) => resolve());
    }
    let version = JSON.parse(await getContent(versionURL));
    let clientURL = version.downloads.client.url;
    let assetIndex = JSON.parse(await getContent(version.assetIndex.url));
    let langPL = JSON.parse(await getContent(getAssetURL(assetIndex.objects["minecraft/lang/pl_pl.json"].hash)));
    let langEN = JSON.parse(await getContent(getAssetURL(assetIndex.objects["minecraft/lang/en_gb.json"].hash)));


    await downloadFile(clientURL, "./client.jar");

    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: "./client.jar",
            storeEntries: true
        });
        zip.on('error', (err: Error) => {
            console.log(err);
        });
        zip.on('ready', async () => {
            await console.log(zip.entryDataSync("assets/minecraft/models/item/player_head.json").toString());
            let items = await DropItemModel.find({item: /minecraft(.*)/}).exec();
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let final_name = item.item.substr("minecraft:".length);
                if (VanillaMappings[final_name] !== undefined) {
                    final_name = VanillaMappings[final_name];
                }

                let translations = [];
                translations.push(langPL[`item.minecraft.${final_name}`] || langPL[`block.minecraft.${final_name}`]);
                translations.push(langEN[`item.minecraft.${final_name}`] || langEN[`block.minecraft.${final_name}`]);

                let path = `assets/minecraft/models/item/${final_name}.json`;
                if (zip.entry(path) === undefined) {
                    throw new Error(`Not found ${final_name} in minecraft client jar, missing mapping!`);
                }
                let texture = readTexture(zip, "assets/minecraft/models/", `item/${final_name}.json`);
                if (texture === undefined) {
                    console.log("[!] Texture for " + final_name + " not found.");
                    continue
                }
                let itemTexture = `${texture}.png` || "";
                itemTexture = itemTexture.substring(itemTexture.lastIndexOf("/"));

                await new Promise((resolve, reject) => {
                    zip.extractFile(zip.entry(`assets/minecraft/textures/${texture}.png`), `./storage/items/${itemTexture}.png`, err => {
                        if (err) console.log(`Extract item error ${err}`);
                        resolve();
                    });
                });
                await DropItemModel.update({_id: item._id}, {texture: itemTexture, translations: translations});
            }
            zip.close();
            fse.unlinkSync("./client.jar");
            resolve();
        });
    })
}

export {
    loadMinecraft
}