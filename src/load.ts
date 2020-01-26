import {StreamZip} from "@drorgl/node-stream-zip";
import fse from "fs-extra";
import {loadMoves} from "./load/moves_load";
import {loadPokemons, updateEvolutions} from "./load/pokemons_load";
import {extractSprites} from "./load/assets_load";
import {loadDrops} from "./load/drops_load";

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

        await loadMoves(zip);
        await loadPokemons(zip);
        await updateEvolutions();
        await extractSprites(zip);
        await loadDrops(zip);
        console.log('Done!');
        zip.close();
    });
}

export default load;
