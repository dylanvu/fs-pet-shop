/* eslint-disable no-console */
/* eslint-disable newline-before-return */
/* eslint-disable newline-after-var */

'use strict';

const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(bodyParser.json());

const pets = require('./routes/pets.js');
app.use(pets);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
