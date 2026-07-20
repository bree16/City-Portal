const fs = require('fs');
let content = fs.readFileSync('artifacts/3d-game/src/pages/GamePage.tsx', 'utf8');

// Set root background to sky blue instead of dark
content = content.replace(/background: '#09070a'/g, "background: '#87CEEB'");
// Update fog colors for sky/daytime
content = content.replace(/fogColor: '#D4E8F8'/g, "fogColor: '#87CEEB'");
content = content.replace(/fogColor: '#D0E8FF'/g, "fogColor: '#87CEEB'");

fs.writeFileSync('artifacts/3d-game/src/pages/GamePage.tsx', content);
console.log('Fixed GamePage');
