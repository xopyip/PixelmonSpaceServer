import {Request, Response} from "express";
import {PokemonModel} from "../models/pokemon/pokemon";
import fs from "fs";

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
    public static async getSprite(req: Request, res: Response) {
        let fPath = 'storage/sprites/' + `${req.params.id}`.padStart(3, "0") + '.png';
        if(fs.existsSync('./' + fPath)) {
            res.set({'Content-Type': 'image/png'});
            res.sendFile(fPath, { root: '.' });
        }else{
            res.json({error: "Not found"});
        }
    }
}

export default PokemonController;