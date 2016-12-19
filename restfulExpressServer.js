/* eslint-disable no-console */
/* eslint-disable newline-before-return */

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

app.get('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      next(err);
      return;
    }

    const pets = JSON.parse(data);

    res.send(pets);
  });
});

app.get('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      next(err);
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

app.post('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      next(readErr);
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
        next(writeErr);
        return;
      }

      res.send(pet);
    });
  });
});

app.patch('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      next(readErr);
      return;
    }

    const pets = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id) || id < 0 || id >= pets.length) {
      res.sendStatus(404);

      return;
    }

    const age = Number.parseInt(req.body.age);
    const kind = req.body.kind;
    const name = req.body.name;

    if (Number.isNaN(age) && !kind && !name) {
      res.sendStatus(400);

      return;
    }

    if (!Number.isNaN(age) || kind || name) {
      pets[id].age = age || pets[id].age;
      pets[id].kind = kind || pets[id].kind;
      pets[id].name = name || pets[id].name;
    }

    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        next(writeErr);
        return;
      }

      res.send(pets[id]);
    });
  });
});

app.delete('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      next(readErr);
      return;
    }

    const pets = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id) || id < 0 || id >= pets.length) {
      res.sendStatus(404);

      return;
    }

    const pet = pets.splice(id, 1)[0];
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        next(writeErr);
        return;
      }

      res.send(pet);
    });
  });
});

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
