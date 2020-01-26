import mongoose from "mongoose";

enum DropType {
    MAIN, OPT, RARE
}

interface PokemonDropSource {
    pokemon: string,
    type: DropType,
    min: number,
    max: number
}

interface IDropItem extends mongoose.Document {
    item: String,
    opponents: PokemonDropSource[]
    chests: string[]
    bosses: string[]
}

const DropItemScheme = new mongoose.Schema({
    item: String,
    opponents: [Object],
    chests: [String],
    bosses: [String]
});
const DropItemModel = mongoose.model<IDropItem>('DropItem', DropItemScheme);

export {
    DropItemModel,
    DropItemScheme,
    IDropItem,
    PokemonDropSource,
    DropType
};
