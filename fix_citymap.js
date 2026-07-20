const fs = require('fs');
let file = 'artifacts/3d-game/src/scenes/CityMapScene.tsx';
let content = fs.readFileSync(file, 'utf8');

// Trees foliage
content = content.replace(/color="#00a8b5"/g, 'color="#4A8F3C"');
content = content.replace(/color="#0F766E"/g, 'color="#3A7A3A"');

// Bench
content = content.replace(/color="#1E3A8A".*?roughness={0.7}.*?\/\/\s*seat\?/g, 'color="#8B5A2B" roughness={0.7}'); // need careful replace
// Actually let's just do it directly.
content = content.replace(/color="#64748B" roughness={0.7} \/>/g, 'color="#2F4F4F" roughness={0.7} />'); // bench frame
content = content.replace(/color="#1E3A8A" roughness={0.7} \/>/g, 'color="#8B5A2B" roughness={0.7} />'); // bench slats

// Water/fountain maybe? No fountain here.

// ParkedCars
content = content.replace(/color="#1E3A8A" rotation/g, 'color="#B22222" rotation');
content = content.replace(/color="#1E3A8A" \/>/g, 'color="#B22222" />');
content = content.replace(/color="#0F766E" \/>/g, 'color="#C0C0C0" />');
content = content.replace(/color="#D4AF37" rotation/g, 'color="#2F4F4F" rotation');
content = content.replace(/color="#E2E8F0" rotation/g, 'color="#4682B4" rotation');

fs.writeFileSync(file, content);

let decor = 'artifacts/3d-game/src/components/decor/DecorKit.tsx';
let decorContent = fs.readFileSync(decor, 'utf8');
// House frame in DecorKit? No, it has potted plants etc.
fs.writeFileSync(decor, decorContent);

console.log('Fixed CityMap');
