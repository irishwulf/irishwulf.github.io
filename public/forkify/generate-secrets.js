require('dotenv').config();
const fs = require('fs');
const path = require('path');

const secretsContent = `export const API_KEY = '${process.env.FORKIFY_API_KEY}';`;
fs.writeFileSync(
  path.join(__dirname, 'src', 'js', 'secrets.js'),
  secretsContent
);
