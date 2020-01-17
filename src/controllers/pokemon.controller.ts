import {Request, Response} from "express";
import {PokemonModel} from "../models/pokemon/pokemon";
import fs from "fs";

class PokemonController {
    public static async list(req: Request, res: Response) {
        let find = PokemonModel.find({});
        find.select("-_id id pixelmonName stats types");
        find.sort("id");
        res.json(await find.exec());
    }

    public static async getByName(req: Request, res: Response) {
        let find = PokemonModel.find({pixelmonName: req.params.name});
        res.json((await find.exec())[0] || {error: "Not found"});
    }

    public static async getByID(req: Request, res: Response) {
        let find = PokemonModel.find({id: req.params.id});
        res.json((await find.exec())[0] || {error: "Not found"});
    }

    private static findFile(start: String, ends: String[]): string | undefined {
        for (let end in ends) {
            if (fs.existsSync(start + end)) {
                return end;
            }
        }
        return undefined;
    }

    public static async getSprite(req: Request, res: Response) {
        let start = './storage/sprites/';
        // find id.png or id-normal.png file
        let fName: string | undefined = PokemonController.findFile(start, [
            `${req.params.id}`.padStart(3, "0") + '.png',
            `${req.params.id}`.padStart(3, "0") + '-normal.png'
        ]);
        // if not found lets find first matching file
        if (fName == undefined) {
            let files: string[] = await new Promise<string[]>((resolve, reject) => {
                fs.readdir(start, (err, files) => {
                    resolve(files);
                });
            });
            files.forEach(file => {
                if (fName != null && file.startsWith(`${req.params.id}`.padStart(3, "0"))) {
                    fName = file;
                }
            })
        }

        if (fName == undefined) {
            res.json({error: "Not found"});
            return;
        }
        res.set({'Content-Type': 'image/png'});
        res.sendFile(fName, {root: './storage/sprites/'});

    }
}

export default PokemonController;