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
