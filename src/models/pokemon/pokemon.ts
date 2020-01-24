import mongoose from "mongoose";
import {IPokeStats, PokeStatsSchema} from "./pokestats";
import {IPokeAggression, PokeAggressionScheme} from "./pokeaggression";
import {IPokeEvolution, PokeEvolutionScheme} from "./pokeevolution";
import {IPokeMove, PokeMoveScheme} from "./pokemove";


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
    nextEvolutions: IPokeEvolution[],
    prevEvolutions: IPokeEvolution[],
    abilities: String[],
    eggGroups: String[],
    eggCycles: Number,
    levelUpMoves: Map<String, IPokeMove[]>,
    tmMoves: IPokeMove[],
    tutorMoves: IPokeMove[],
    eggMoves: IPokeMove[],
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
    nextEvolutions: [PokeEvolutionScheme],
    prevEvolutions: [PokeEvolutionScheme],
    abilities: [String],
    eggGroups: [String],
    eggCycles: Number,
    levelUpMoves: Map,
    tmMoves: [PokeMoveScheme],
    tutorMoves: [PokeMoveScheme],
    eggMoves: [PokeMoveScheme],
    forms: Map,
    form: Number
});
const PokemonModel = mongoose.model<IPokemon>('Pokemon', PokemonScheme);

export {
    IPokemon,
    PokemonScheme,
    PokemonModel
};
