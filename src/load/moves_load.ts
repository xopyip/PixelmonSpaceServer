import {IPokeMove, PokeMoveModel} from "../models/pokemon/pokemove";
import {StreamZip} from "@drorgl/node-stream-zip";

type MovesMap = Record<string, IPokeMove>;
let moves: MovesMap = {};
const loadMoves = async (zip: StreamZip) => {
    await PokeMoveModel.find((err, res) => console.log(`Removed ${res.length} moves`));
    await PokeMoveModel.deleteMany({});
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
        await moves[name].save();
    }
    await PokeMoveModel.find((err, res) => console.log(`Loaded ${res.length} moves`));
};

function getMove(name: string): IPokeMove {
    return moves[name];
}

export {
    loadMoves, getMove
}