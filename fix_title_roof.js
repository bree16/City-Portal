const fs = require('fs');
let file = 'artifacts/3d-game/src/components/title/TitleScene.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<mesh position=\{\[0, height \+ 0\.1, 0\]\}>/g, '<mesh position={[0, height + 0.101, 0]}>');

fs.writeFileSync(file, content);
console.log('Fixed TitleScene roofs');
