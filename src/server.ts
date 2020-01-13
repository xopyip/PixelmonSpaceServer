import cors from "cors";
import bodyParser from 'body-parser';
import express from "express";
import compress from "compression";
import routes from "./api/routes";


const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect('mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB,
    {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());

app.use(cors());

app.use('/', routes);

export default app;
