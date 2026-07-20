const fs = require('fs');
let file = 'artifacts/3d-game/src/scenes/CityMapScene.tsx';
let content = fs.readFileSync(file, 'utf8');

// The accent band has:
// <mesh position={[0, h + 0.1, 0]} castShadow>
//   <boxGeometry args={[w + 0.2, 0.25, d + 0.2]} />
// Replace it so position is h + 0.126 (0.125 + 0.001 epsilon)

content = content.replace(/\{\/\* Accent band at top \*\/\}\s*<mesh position=\{\[0, h \+ 0\.1, 0\]\} castShadow>/g, 
`{/* Accent band at top */}
      <mesh position={[0, h + 0.126, 0]} castShadow>`);

fs.writeFileSync(file, content);
console.log('Fixed CityMap roofs');
