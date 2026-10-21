const fs = require('node:fs');
const path = require('node:path');

for (const directory of ['merv-results', 'merv-report']) {
  fs.mkdirSync(path.resolve(__dirname, '..', directory), { recursive: true });
}
