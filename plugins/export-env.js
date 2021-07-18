const path = require('path');
const fs = require('fs');

module.exports = class ExportEnvPlugin {
  constructor(opts) {
    this.filename = opts.filename;
  }

  apply() {
    let fileContent = Object.keys(process.env)
      .filter(k => k.startsWith('NEXT_PUBLIC_'))
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

    const fullOutputPath = path.join(outputDir, this.filename);

    //Write to env variable to the file to be used.
    fs.writeFileSync(fullOutputPath, fileContent);
  }
};
