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
else {
  console.error(`Usage: ${node} ${file} read`);
  process.exit(1);
}
