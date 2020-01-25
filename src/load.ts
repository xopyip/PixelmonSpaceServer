import {StreamZip} from "@drorgl/node-stream-zip";
import {PokemonModel} from "./models/pokemon/pokemon";
import fs from "fs";
import fse from "fs-extra";
import {loadMoves} from "./load/moves_load";
import {loadPokemons, updateEvolutions} from "./load/pokemons_load";
import {extractSprites} from "./load/assets_load";

function load(fileName: string) {
    const zip = new StreamZip({
        file: fileName,
        storeEntries: true
    });
    zip.on('error', (err: Error) => {
        console.log(err);
    });
    zip.on('ready', async () => {
        fse.removeSync('storage');
        fs.mkdirSync('storage');
        fs.mkdirSync('storage/sprites');

        await PokemonModel.find((err, res) => {
            console.log(`Removing ${res.length} pokemons`);
        });
        await PokemonModel.deleteMany({}, err => {
        });
        loadMoves(zip);
        await loadPokemons(zip);
        await updateEvolutions();
        await extractSprites(zip);
        console.log('Done!');
        zip.close();
    });
}

export default load;
