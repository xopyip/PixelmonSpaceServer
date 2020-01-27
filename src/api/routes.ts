import {Request, Response} from "express";
import PokemonController from "../controllers/pokemon.controller";
import ItemsController from "../controllers/item.controller";

const express = require('express');
const router = express.Router();


router.get('/', (req: Request, res: Response) => res.send('PixelmonWiki'));
router.get('/pokemon', PokemonController.list);
router.get('/pokemon/sprite/:id', PokemonController.getSprite);
router.get('/pokemon/:id(\\d+)', PokemonController.getByID);
router.get('/pokemon/:name', PokemonController.getByName);
router.get('/item', ItemsController.list);
router.get('/item/:name', ItemsController.find);


export default router;
