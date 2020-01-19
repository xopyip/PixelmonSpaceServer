import mongoose from "mongoose";

interface IPokeEvolution extends mongoose.Document {
    level: Number,
    name: String,
    form: Number,
    conditions: Map<String, any>[],
    moves: String[],
    evoType: String,
    from: String,
    fromID: Number,
    toID: Number
}

const PokeEvolutionScheme = new mongoose.Schema({
    level: Number,
    name: String,
    form: Number,
    conditions: [Map],
    moves: [String],
    evoType: String,
    from: String,
    fromID: Number,
    toID: Number
});
const PokeEvolutionModel = mongoose.model<IPokeEvolution>('PokeEvolution', PokeEvolutionScheme);

export {
    IPokeEvolution,
    PokeEvolutionScheme,
    PokeEvolutionModel
};
