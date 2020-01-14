import {Request, Response} from "express";
import PokemonController from "../controllers/pokemon.controller";
const express = require('express');
const router = express.Router();


router.get('/', (req: Request, res: Response) => res.send('PixelmonWiki'));
router.get('/pokemon', PokemonController.list);
router.get('/pokemon/:id(\\d+)', PokemonController.getByID);
router.get('/pokemon/:name', PokemonController.getByName);


export default router;
