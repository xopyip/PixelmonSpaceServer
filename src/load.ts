import {StreamZip} from "@drorgl/node-stream-zip";
import {PokemonModel} from "./models/pokemon/pokemon";

function load(fileName: string){
    const zip = new StreamZip({
        file: fileName,
        storeEntries: true
    });
    zip.on('error', (err : Error) => {
        console.log(err);
    });
    zip.on('ready', async () => {
        await PokemonModel.find((err, res) => {
            console.log(`Removing ${res.length} pokemons`);
        });
        await PokemonModel.deleteMany({}, err => {});
        for (const entry of Object.values(zip.entries())) {
            if (entry.name.indexOf("assets/pixelmon/stats") != 0 || entry.isDirectory) {
                continue;
            }

            const data = zip.entryDataSync(entry.name);
            let j = JSON.parse(data.toString().replace(": 00", ": 0"));
            j.id = entry.name.substr(entry.name.lastIndexOf("/") + 1).substr(0, 3);
            let poke = new PokemonModel(j);
            for(let i = 0; i<poke.evolutions.length; i++){
                let to = j.evolutions[i].to;
                if(typeof to === 'object'){
                    poke.evolutions[i].name = to.name;
                    poke.evolutions[i].form = to.form;
                }else{
                    poke.evolutions[i].name = to;
                    poke.evolutions[i].form = 0;
                }
            }
            poke.save().then(() => {
                console.log(poke.pixelmonName + " saved");
            });
        }
        zip.close();
    });
}

export default load;