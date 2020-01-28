import {Request, Response} from "express";
import {DropItemModel} from "../models/drops/item";

class ItemsController {
    public static async list(req: Request, res: Response) {
        let find = DropItemModel.find({});
        find.select("-_id item translations texture");
        res.json(await find.exec());
    }

    public static async find(req: Request, res: Response) {
        let find = DropItemModel.find({translations: {$in: [new RegExp(`.*${req.params.name}.*`, 'i')]}});
        res.json((await find.exec()) || {error: "Not found"});
    }
}

export default ItemsController;