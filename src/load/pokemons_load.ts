import {StreamZip} from "@drorgl/node-stream-zip";
import {PokemonModel} from "../models/pokemon/pokemon";
import {getMove} from "./moves_load";
import {IPokeEvolution} from "../models/pokemon/pokeevolution";

const loadPokemons = async (zip: StreamZip) => {
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
            poke.levelUpMoves.set(lvl, m.map((name: string) => getMove(name)));
        }

        poke.eggMoves = j.eggMoves === undefined ? [] : j.eggMoves.map((name: string) => getMove(name));
        poke.tmMoves = j.tmMoves === undefined ? [] : j.tmMoves.map((name: string) => getMove(name));
        poke.tutorMoves = j.tutorMoves === undefined ? [] : j.tutorMoves.map((name: string) => getMove(name));

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
};

const updateEvolutions = async () => {
    let pokemons = await PokemonModel.find({}).sort("id").exec();

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
};

export {
    loadPokemons, updateEvolutions
}