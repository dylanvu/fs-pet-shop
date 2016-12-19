/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

app.use(morgan('dev'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);

      return;
    }

    const pets = JSON.parse(data);

    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);

      return;
    }

    const pets = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id) || id < 0 || id >= pets.length) {
      res.sendStatus(404);

      return;
    }

    res.send(pets[id]);
  });
});

app.post('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      console.error(readErr.stack);
      res.sendStatus(500);

      return;
    }

    const age = Number.parseInt(req.body.age);
    const kind = req.body.kind;
    const name = req.body.name;

    if (Number.isNaN(age) || !kind || !name) {
      res.sendStatus(400);

      return;
    }

    const pet = {
      age,
      kind,
      name
    };
    const pets = JSON.parse(data);

    pets.push(pet);

    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        res.sendStatus(500);

        return;
      }

      res.send(pet);
    });
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
