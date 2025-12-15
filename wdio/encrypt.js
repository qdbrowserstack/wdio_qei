const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'config', `secrets.json`);
const algorithm = 'aes-256-cbc';
const password = process.env.ENCRYPTION_KEY;

if (!password) {
  throw new Error("ENCRYPTION_KEY is missing.");
}

const iv = crypto.randomBytes(16);
const key = crypto.scryptSync(password, 'salt', 32);

const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (!fileContent.iv && !fileContent.content) {
  const jsonData = JSON.stringify(fileContent);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(jsonData, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const output = {
    iv: iv.toString('hex'),
    content: encrypted
  };

  fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
}
console.log('Secrets encrypted and saved.');