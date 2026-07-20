const fs = require('fs');
const glob = require('fs').readdirSync('artifacts/3d-game/src/scenes').filter(f => f.endsWith('.tsx')).map(f => 'artifacts/3d-game/src/scenes/' + f);
glob.push('artifacts/3d-game/src/components/decor/DecorKit.tsx');
glob.push('artifacts/3d-game/src/components/GroundPlane.tsx');

glob.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // General replacements for all files
    // Road / Asphalt
    content = content.replace(/color="#0f2420"/g, 'color="#5aa04a"'); // Grass in CityMap
    content = content.replace(/color="#F8FAFC" roughness={0.8}/g, 'color="#333333" roughness={0.8}'); // Road in CityMap
    content = content.replace(/color="#A0522D" roughness={0.85}/g, 'color="#A0A0A0" roughness={0.85}'); // Sidewalks in CityMap
    content = content.replace(/color="#1E3A8A" roughness={0.9} transparent opacity={0.7}/g, 'color="#F8FAFC" roughness={0.9} transparent opacity={0.7}'); // Crosswalks

    // Grass patches
    content = content.replace(/color=\{i % 2 \? '#162e29' : '#0c1a17'\}/g, "color={i % 2 ? '#4a8f3c' : '#3e7a32'}");
    // Bushes
    content = content.replace(/color=\{i % 2 \? '#3A7A3A' : '#4A8C4A'\}/g, "color={i % 2 ? '#228B22' : '#2E8B57'}");
    content = content.replace(/color=\{i % 2 \? '#4A8C4A' : '#3A7A3A'\}/g, "color={i % 2 ? '#2E8B57' : '#228B22'}");
    // Bush colors in NeighborhoodScene
    content = content.replace(/color=\{i % 2 \? '#1E3A8A' : '#0F766E'\}/g, "color={i % 2 ? '#228B22' : '#2E8B57'}");
    content = content.replace(/color=\{idx % 2 \? '#1E3A8A' : '#D4AF37'\}/g, "color={idx % 2 ? '#228B22' : '#2E8B57'}");
    content = content.replace(/color=\{idx % 2 \? '#D4AF37' : '#1E3A8A'\}/g, "color={idx % 2 ? '#2E8B57' : '#228B22'}");
    
    // Windows / glass
    content = content.replace(/color="#0F766E" metalness={0.85} roughness={0.1}/g, 'color="#7fb2d9" metalness={0.85} roughness={0.1}');
    content = content.replace(/color="#1E3A8A" metalness={0.6} roughness={0.3}/g, 'color="#7fb2d9" metalness={0.6} roughness={0.1}');
    content = content.replace(/color="#1E3A8A" roughness={0.4} metalness={0.3}/g, 'color="#7fb2d9" roughness={0.4} metalness={0.3}'); // glass in DecorKit maybe?
    content = content.replace(/emissive="#0F766E" emissiveIntensity={0.3}/g, 'emissive="#a8cfe8" emissiveIntensity={0.1}');
    content = content.replace(/emissive="#0F766E" emissiveIntensity={0.5}/g, 'emissive="#a8cfe8" emissiveIntensity={0.1}');

    fs.writeFileSync(file, content);
});

// Update GroundPlane
let gp = fs.readFileSync('artifacts/3d-game/src/components/GroundPlane.tsx', 'utf8');
gp = gp.replace(/color="#D4AF37"/g, 'color="#FFFFFF"');
gp = gp.replace(/color="#38BDF8"/g, 'color="#FFFFFF"');
fs.writeFileSync('artifacts/3d-game/src/components/GroundPlane.tsx', gp);

// Adjust GamePage lights to natural daylight
let gp2 = fs.readFileSync('artifacts/3d-game/src/pages/GamePage.tsx', 'utf8');
gp2 = gp2.replace(/keyColor: '#FFF8E1'/g, "keyColor: '#FFFBF0'"); // Sun color
gp2 = gp2.replace(/fillColor: '#C8E8FF'/g, "fillColor: '#E0F0FF'"); // Sky fill
fs.writeFileSync('artifacts/3d-game/src/pages/GamePage.tsx', gp2);

console.log('Fixed world basic colors');
