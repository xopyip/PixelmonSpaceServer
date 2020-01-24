import {StreamZip} from "@drorgl/node-stream-zip";
import {PokemonModel} from "./models/pokemon/pokemon";
import fs from "fs";
import fse from "fs-extra";
import {IPokeEvolution} from "./models/pokemon/pokeevolution";
import {IPokeMove, PokeMoveModel} from "./models/pokemon/pokemove";

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
        type MovesMap = Record<string, IPokeMove>;
        let moves: MovesMap = {};
        for (const entry of Object.values(zip.entries())) {
            if (entry.name.indexOf("assets/pixelmon/moves") != 0 || entry.isDirectory) {
                continue;
            }
            const data = zip.entryDataSync(entry.name);
            let j = JSON.parse(data.toString().replace(": 00", ": 0").replace(/(\d+):\s{/, "\"$1\":{"));
            let idx: number = j.attackIndex;
            let name: string = j.attackName;
            let type: string = j.attackType;
            let cat: string = j.attackCategory;
            moves[name] = new PokeMoveModel({
                attackIndex: idx,
                attackName: name,
                attackType: type,
                attackCategory: cat
            });
            moves[name].save();
        }
        for (const entry of Object.values(zip.entries())) {
            if (entry.name.indexOf("assets/pixelmon/stats") != 0 || entry.isDirectory) {
                continue;
            }

            const data = zip.entryDataSync(entry.name);
            let j = JSON.parse(data.toString().replace(": 00", ": 0"));
            j.id = entry.name.substr(entry.name.lastIndexOf("/") + 1).substr(0, 3);
            let poke = new PokemonModel(j);
            poke.levelUpMoves.clear();
            let lvlMoves: { [key: string]: string[] } = j.levelUpMoves;
            for (let lvl of Object.keys(lvlMoves)) {
                let m = lvlMoves[lvl];
                poke.levelUpMoves.set(lvl, m.map((name: string) => moves[name]));
            }
            poke.eggMoves = j.eggMoves === undefined ? [] : j.eggMoves.map((name: string) => moves[name]);
            poke.tmMoves = j.tmMoves === undefined ? [] : j.tmMoves.map((name: string) => moves[name]);
            poke.tutorMoves = j.tutorMoves === undefined ? [] : j.tutorMoves.map((name: string) => moves[name]);
            for (let i = 0; i < poke.evolutions.length; i++) {
                let to = j.evolutions[i].to;
                if (typeof to === 'object') {
                    poke.evolutions[i].name = to.name;
                    poke.evolutions[i].form = to.form;
                } else {
                    poke.evolutions[i].name = to;
                    poke.evolutions[i].form = 0;
                }
            }

            await poke.save();
            console.log(poke.pixelmonName + " saved");
        }

        let pokemons = await PokemonModel.find({}).sort("id").exec();
        console.log("loaded " + pokemons.length);
        for (let pokemon of pokemons) {
            let prev: IPokeEvolution[] = [];
            let next: IPokeEvolution[] = [];
            pokemon.preEvolutions.forEach((evo) => {
                let findPrevEvoPokemon = pokemons.find((p) => p.pixelmonName == evo);
                if (findPrevEvoPokemon == null) return;
                if (findPrevEvoPokemon.evolutions.length > 0) {
                    prev.push(Object.assign(findPrevEvoPokemon.evolutions[0], {
                        from: evo,
                        toID: pokemons.find(p => p.pixelmonName == findPrevEvoPokemon?.evolutions[0].name)?.id,
                        fromID: findPrevEvoPokemon.id
                    }));
                }
            });
            let evo: IPokeEvolution[] = pokemon.evolutions;
            evo.forEach(evo => {
                evo.fromID = pokemon.id;
                let find = pokemons.find((p) => p.pixelmonName == evo.name);
                if (find == null) return;
                evo.toID = find.id;
                evo.from = pokemon.pixelmonName;
            });
            let foundNames: String[] = [];
            pokemon.evolutions.forEach((evo) => {
                if (foundNames.indexOf(evo.name) != -1) {
                    return;
                }
                let find = pokemons.find((p) => p.pixelmonName == evo.name);
                foundNames.push(evo.name);
                if (find == null) return;
                if (find.evolutions.length > 0) {
                    next.push(Object.assign(find.evolutions[0], {
                        from: evo.name,
                        toID: pokemons.find(p => p.pixelmonName == find?.evolutions[0].name)?.id,
                        fromID: evo.toID
                    }));
                }
            });
            await PokemonModel.update({_id: pokemon._id}, {
                prevEvolutions: prev,
                nextEvolutions: next,
                evolutions: evo
            });
            console.log(pokemon.pixelmonName + " updated");
        }

        await new Promise((resolve, reject) => {
            zip.extract('assets/pixelmon/textures/sprites/pokemon/', './storage/sprites', err => {
                console.log(err ? 'Extract sprites error' : 'Sprites extracted');
                resolve();
            })
        });
        console.log('Done!');
        zip.close();
    });
}

export default load;
