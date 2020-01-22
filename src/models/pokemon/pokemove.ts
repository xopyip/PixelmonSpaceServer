import mongoose from "mongoose";

interface IPokeMove extends mongoose.Document {
    attackIndex: number,
    attackName: string,
    attackType: string,
    attackCategory: string
}

const PokeMoveScheme = new mongoose.Schema({
    attackIndex: Number,
    attackName: String,
    attackType: String,
    attackCategory: String
});
const PokeMoveModel = mongoose.model<IPokeMove>('PokeMove', PokeMoveScheme);

export {
    IPokeMove,
    PokeMoveScheme,
    PokeMoveModel
};
