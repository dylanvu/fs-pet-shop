/* eslint-disable no-console */

'use strict';

// Import modules
const fs = require('fs');
const path = require('path');

// pointer to pets data
const petsPath = path.join(__dirname, 'pets.json');

// assign command-line args
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const pets = JSON.parse(data);
    const index = Number.parseInt(process.argv[3]);

    if (Number.isNaN(index)) {
      console.log(pets);
      process.exit(0);
    }

    if (index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    console.log(pets[index]);
  });
}
else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }

    const age = Number.parseInt(process.argv[3]);
    const kind = process.argv[4];
    const name = process.argv[5];

    if (Number.isNaN(age) || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    const pets = JSON.parse(data);
    const pet = {
      age,
      kind,
      name
    };

    pets.push(pet);

    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      console.log(pet);
    });
  });
}
else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }

    const pets = JSON.parse(data);
    const index = Number.parseInt(process.argv[3]);

    if (Number.isNaN(index) || index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    const age = Number.parseInt(process.argv[4]);
    const kind = process.argv[5];
    const name = process.argv[6];

    if (Number.isNaN(age) || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    pets[index].age = age;
    pets[index].kind = kind;
    pets[index].name = name;

    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      console.log(pets[index]);
    });
  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }

    const pets = JSON.parse(data);
    const index = Number.parseInt(process.argv[3]);

    if (Number.isNaN(index) || index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    const pet = pets.splice(index, 1)[0];
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      console.log(pet);
    });
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
