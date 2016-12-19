/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const petsPath = path.join(__dirname, 'pets.json');

const server = http.createServer((req, res) => {
  const petRegExp = /^\/pets\/(.*)$/;

  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    });
  }
  else if (req.method === 'GET' && petRegExp.test(req.url)) {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      const pets = JSON.parse(data);
      const matches = req.url.match(petRegExp);
      const index = Number.parseInt(matches[1]);

      if (Number.isNaN(index) || index < 0 || index >= pets.length) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      const petJSON = JSON.stringify(pets[index]);

      res.setHeader('Content-Type', 'application/json');
      res.end(petJSON);
    });
  }
  else if (req.method === 'POST' && req.url === '/pets') {
    let bodyJSON = '';

    req.on('data', (chunk) => {
      bodyJSON += chunk.toString();
    });

    req.on('end', () => {
      fs.readFile(petsPath, 'utf8', (readErr, data) => {
        if (readErr) {
          console.error(readErr.stack);

          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal Server Error');

          return;
        }

        const body = JSON.parse(bodyJSON);
        const age = Number.parseInt(body.age);
        const kind = body.kind;
        const name = body.name;

        if (Number.isNaN(age) || !kind || !name) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Bad Request');

          return;
        }

        const pets = JSON.parse(data);

        const pet = {
          age,
          kind,
          name
        };

        pets.push(pet);

        const petJSON = JSON.stringify(pet);
        const petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, (writeErr) => {
          if (writeErr) {
            console.error(writeErr.stack);

            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error');

            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(petJSON);
        });
      });
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
