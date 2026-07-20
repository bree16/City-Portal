const fs = require('fs');
let file = 'artifacts/3d-game/src/components/title/TitleScene.tsx';
let content = fs.readFileSync(file, 'utf8');

// The TitleScene building box is: <boxGeometry args={[b.footprint[0] * 0.6, height, b.footprint[0] * 0.6]} />
// Position is [0, height/2, 0].
// Roof was: <mesh position={[0, height + 0.1, 0]}> with boxGeometry args [.. * 0.62, 0.2, .. * 0.62]
// If roof thickness is 0.2, and we want it perfectly ON TOP of wall height `height`,
// its position should be height + 0.1. Wait, that IS perfectly on top!
// Let's verify: wall top is height. Roof center is height + 0.1. Roof bottom is (height + 0.1) - 0.2 / 2 = height.
// Actually, TitleScene is already perfect! 
// Let's check CityMapScene!
