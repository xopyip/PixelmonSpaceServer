import {Request, Response} from "express";
import {PokemonModel} from "../models/pokemon/pokemon";

class PokemonController{
    public static async list(req: Request, res: Response){
        let find = PokemonModel.find({});
        find.select("-_id id pixelmonName stats types");
        find.sort("id");
        res.json(await find.exec());
    }
    public static async getByName(req: Request, res: Response){
        let find = PokemonModel.find({pixelmonName: req.params.name});
        res.json((await find.exec())[0] || {error: "Not found"});
    }
    public static async getByID(req: Request, res: Response) {
        let find = PokemonModel.find({id: req.params.id});
        res.json((await find.exec())[0] || {error: "Not found"});
    }
}

export default PokemonController;