import {Request, Response} from "express";
const express = require('express');
const router = express.Router();


router.get('/', (req: Request, res: Response) => res.send('PixelmonWiki'));


module.exports = router;
