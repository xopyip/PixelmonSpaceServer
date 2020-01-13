import mongoose from "mongoose";

interface IPokeAggression extends mongoose.Document {
    timid: Number,
    passive: Number,
    aggressive: Number
}

const PokeAggressionScheme = new mongoose.Schema({
    timid: Number,
    passive: Number,
    aggressive: Number
});
const PokeAggressionModel = mongoose.model<IPokeAggression>('PokeAggression', PokeAggressionScheme);

export {
    IPokeAggression,
    PokeAggressionScheme,
    PokeAggressionModel
};
