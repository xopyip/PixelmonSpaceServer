import mongoose from "mongoose";

interface IPokeStats extends mongoose.Document {
    HP: number,
    Attack: number,
    Defence: number,
    Speed: number,
    SpecialAttack: number,
    SpecialDefence: number
}

const PokeStatsSchema = new mongoose.Schema({
    HP: Number,
    Attack: Number,
    Defence: Number,
    Speed: Number,
    SpecialAttack: Number,
    SpecialDefence: Number
});
const PokeStatsModel = mongoose.model<IPokeStats>('PokeStats', PokeStatsSchema);

export {
    IPokeStats,
    PokeStatsSchema,
    PokeStatsModel
};
