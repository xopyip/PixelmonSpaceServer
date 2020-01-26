import {StreamZip} from "@drorgl/node-stream-zip";
import {DropItemModel, DropType, IDropItem} from "../models/drops/item";

const loadDrops = async (zip: StreamZip) => {
    await DropItemModel.find({}, (err, res) => console.log(`removing ${res.length} items`));
    await DropItemModel.deleteMany({});


    type DropRecord = Record<string, IDropItem>;
    let drops: DropRecord = {};

    const getDrop = (item: string) => {
        if (drops[item] === undefined) {
            drops[item] = new DropItemModel({
                item: item,
                opponents: [],
                chests: [],
                bosses: []
            });
        }
        return drops[item];
    };


    let pokeDropsEntry = zip.entry("assets/pixelmon/drops/pokedrops.json");
    let data = zip.entryDataSync(pokeDropsEntry);
    const pokeDrops: { [key: string]: string | number }[] = JSON.parse(data.toString());

    for (let pokeDrop of pokeDrops) {
        getDrop(pokeDrop.maindropdata as string).opponents.push({
            max: pokeDrop.maindropmax as number,
            min: pokeDrop.maindropmin as number,
            pokemon: pokeDrop.pokemon as string,
            type: DropType.MAIN
        });
        getDrop(pokeDrop.raredropdata as string).opponents.push({
            max: pokeDrop.raredropmax as number,
            min: pokeDrop.raredropmin as number,
            pokemon: pokeDrop.pokemon as string,
            type: DropType.RARE
        });
        const optRegex = /optdrop(\d+)data/;
        Object.keys(pokeDrop).filter(key => optRegex.test(key)).forEach(key => {
            let res = key.match(optRegex);
            if (res === null) {
                return;
            }
            let number = res[1];
            getDrop(pokeDrop[key] as string).opponents.push({
                max: pokeDrop[`optdrop${number}max`] as number,
                min: pokeDrop[`optdrop${number}min`] as number,
                pokemon: pokeDrop.pokemon as string,
                type: DropType.OPT
            });
        })
    }

    let bossDropsEntry = zip.entry("assets/pixelmon/drops/bossdrops.json");
    data = zip.entryDataSync(bossDropsEntry);
    const bossDrops: { [key: string]: string[] } = JSON.parse(data.toString());

    for (let bossType of Object.keys(bossDrops)) {
        for (let drop of bossDrops[bossType]) {
            getDrop(drop).bosses.push(bossType);
        }
    }

    let chestDropsEntry = zip.entry("assets/pixelmon/drops/pokechestdrops.json");
    data = zip.entryDataSync(chestDropsEntry);
    const chestDrops: { [key: string]: string[] } = JSON.parse(data.toString());

    for (let chestType of Object.keys(chestDrops)) {
        for (let drop of chestDrops[chestType]) {
            getDrop(drop).bosses.push(chestType);
        }
    }

    for (const d of Object.values(drops)) {
        await d.save();
    }
    await DropItemModel.find({}, (err, res) => console.log(`saved ${res.length} items`));
};

export {
    loadDrops
}