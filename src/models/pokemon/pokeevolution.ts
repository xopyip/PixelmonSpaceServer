import mongoose from "mongoose";

interface IPokeEvolution extends mongoose.Document {
    level: Number,
    "to.name": String,
    conditions: Map<String, any>[],
    moves: String[],
    evoType: String
}

const PokeEvolutionScheme = new mongoose.Schema({
    level: Number,
    "to.name": String,
    conditions: [Map],
    moves: [String],
    evoType: String
});
const PokeEvolutionModel = mongoose.model<IPokeEvolution>('PokeEvolution', PokeEvolutionScheme);

export {
    IPokeEvolution,
    PokeEvolutionScheme,
    PokeEvolutionModel
};
