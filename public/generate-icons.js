// Run: node public/generate-icons.js
// Generates simple SVG-based placeholder icons
const fs = require('fs');
const path = require('path');

const svgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#2D6A4F"/>
  <text x="50%" y="54%" font-size="${Math.round(size * 0.55)}" text-anchor="middle" dominant-baseline="middle" font-family="serif">🌿</text>
</svg>`;

// Write SVG files (browsers can use SVG as icons too)
fs.writeFileSync(path.join(__dirname, 'icon-192.svg'), svgIcon(192));
fs.writeFileSync(path.join(__dirname, 'icon-512.svg'), svgIcon(512));
console.log('Icons generated: icon-192.svg, icon-512.svg');
console.log('For PNG icons, convert these SVGs using an online tool or imagemagick.');
