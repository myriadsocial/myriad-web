const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

let fileContent = Object.keys(process.env)
  .filter(k => k.startsWith('NEXT'))
  .reduce((accum, currKey) => {
    const val = process.env[currKey];
    accum += `const ${currKey} = '${val}'\n`;
    return accum;
  }, '');

const outputDir = 'public';

//if syncing doesn't exist, make it.
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const fullOutputPath = path.join(outputDir, 'sw-env.js');

//Write to env variable to the file to be used.
fs.writeFileSync(fullOutputPath, fileContent);
