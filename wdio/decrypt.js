const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


const filePath = path.join(__dirname, 'config', `secrets.json`);
const algorithm = 'aes-256-cbc';
const password = process.env.ENCRYPTION_KEY;
const key = crypto.scryptSync(password, 'salt', 32);

if (!password) {
  throw new Error("ENCRYPTION_KEY is missing.");
}
const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
if (fileContent.iv || fileContent.content) {
  const { iv, content } = fileContent;

  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  const secrets = JSON.parse(decrypted);
  fs.writeFileSync(filePath, JSON.stringify(secrets, null, 2));
}