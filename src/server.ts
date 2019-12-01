const express = require("express");
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const routes = require('./api/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());

app.use(cors());

app.use('/', routes);

export default app;
