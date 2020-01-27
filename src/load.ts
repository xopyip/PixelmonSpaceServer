import {StreamZip} from "@drorgl/node-stream-zip";
import fse from "fs-extra";
import {loadMinecraft} from "./load/mminecraft_load";

function load(fileName: string) {
    const zip = new StreamZip({
        file: fileName,
        storeEntries: true
    });
    zip.on('error', (err: Error) => {
        console.log(err);
    });
    zip.on('ready', async () => {
        fse.removeSync('./storage');
        fse.mkdirSync('./storage');

        //await loadMoves(zip);
        //await loadPokemons(zip);
        //await updateEvolutions();
        //await extractSprites(zip);
        //await loadDrops(zip);
        await loadMinecraft();
        console.log('Done!');
        zip.close();
    });
}

export default load;
