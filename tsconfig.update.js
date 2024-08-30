const fs = require('fs');

const isSingleModule = fs.existsSync('./src/index.ts');
const isMultiModule = !isSingleModule;

const tsConfigJson = require('./tsconfig.json');

if (isSingleModule) {
  tsConfigJson.files = [
    fs.existsSync("./src/index.ts") && "./src/index.ts",
  ]
    .filter(Boolean);
}

if (isMultiModule) {
  const getModuleNames =
    root =>
      fs.readdirSync(root, {withFileTypes: true})
        .filter(item => item.isDirectory())
        .map(item => item.name)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

  const moduleNames = getModuleNames('./src');

  tsConfigJson.files =
    moduleNames
      .map(moduleName => {
        const indexFilename = `./src/${moduleName}/index.ts`;
        if (fs.existsSync(indexFilename)) return indexFilename;
        if (fs.existsSync(indexFilename + 'x')) return indexFilename + 'x';
        return null;
      })
      .filter(Boolean);
}

fs.writeFileSync('./tsconfig.json', JSON.stringify(tsConfigJson, null, 2));
