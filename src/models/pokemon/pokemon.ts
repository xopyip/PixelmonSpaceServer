import mongoose from "mongoose";
import {IPokeStats,PokeStatsSchema} from "./pokestats";
import {IPokeAggression, PokeAggressionScheme} from "./pokeaggression";
import {IPokeEvolution, PokeEvolutionScheme} from "./pokeevolution";


interface IPokemon extends mongoose.Document {
    id: Number,
    pixelmonName: String,
    pokemon: String,
    stats: IPokeStats,
    catchRate: Number,
    malePercent: Number,
    spawnLevel: Number,
    spawnLevelRange: Number,
    baseExp: Number,
    baseFriendship: Number,
    types: String[],
    height: Number,
    width: Number,
    length: Number,
    isRideable: Boolean,
    canFly: Boolean,
    canSurf: Boolean,
    preEvolutions: String[],
    experienceGroup: String,
    aggression: IPokeAggression,
    spawnLocations: String[],
    evYields: Map<String, Number>,
    weight: Number,
    evolutions: IPokeEvolution[],
    abilities: String[],
    eggGroups: String[],
    eggCycles: Number,
    levelUpMoves: Map<String, String[]>,
    tmMoves: String[],
    tutorMoves: String[],
    eggMoves: String[],
    forms: Map<String, IPokemon>,
    form: Number
}

const PokemonScheme = new mongoose.Schema({
    id: Number,
    pixelmonName: String,
    pokemon: String,
    stats: PokeStatsSchema,
    catchRate: Number,
    malePercent: Number,
    spawnLevel: Number,
    spawnLevelRange: Number,
    baseExp: Number,
    baseFriendship: Number,
    types: [String],
    height: Number,
    width: Number,
    length: Number,
    isRideable: Boolean,
    canFly: Boolean,
    canSurf: Boolean,
    preEvolutions: [String],
    experienceGroup: String,
    aggression: PokeAggressionScheme,
    spawnLocations: [String],
    evYields: Map,
    weight: Number,
    evolutions: [PokeEvolutionScheme],
    abilities: [String],
    eggGroups: [String],
    eggCycles: Number,
    levelUpMoves: Map,
    tmMoves: [String],
    tutorMoves: [String],
    eggMoves: [String],
    forms: Map,
    form: Number
});
const PokemonModel = mongoose.model<IPokemon>('Pokemon', PokemonScheme);

export {
    IPokemon,
    PokemonScheme,
    PokemonModel
};
