const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Create dist folder if not exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Write a minimal index.html
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Aich Check - PNG</title>
</head>
<body>
  <h1>Welcome to Aich Check - PNG</h1>
  <p>Site under construction. Stay tuned!</p>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);

console.log('Build completed: dist/index.html created.');
