const fs = require('fs');
let file = 'artifacts/3d-game/src/scenes/NeighborhoodScene.tsx';
let content = fs.readFileSync(file, 'utf8');

// Grass - previously #F8FAFC
content = content.replace(/\{\/\* Grass — PBR \*\/\}\s*<mesh[^\n]*\n[^\n]*\n\s*<meshStandardMaterial color="#F8FAFC" roughness=\{0.95\} metalness=\{0\} \/>/g,
  `{/* Grass — PBR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 22]} />
        <meshStandardMaterial color="#5aa04a" roughness={0.95} metalness={0} />`);

// Sidewalk - keep #E2E8F0 or use #A0A0A0
content = content.replace(/\{\/\* Sidewalk \*\/\}\s*<mesh[^\n]*\n[^\n]*\n\s*<meshStandardMaterial color="#E2E8F0" roughness=\{0.85\} \/>/g,
  `{/* Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.5]} receiveShadow>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color="#A0A0A0" roughness={0.85} />`);

// Road - previously #8B5A2B
content = content.replace(/\{\/\* Road \*\/\}\s*<mesh[^\n]*\n[^\n]*\n\s*<meshStandardMaterial color="#8B5A2B" roughness=\{0.9\} \/>/g,
  `{/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 7]} receiveShadow>
        <planeGeometry args={[60, 5]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />`);

// Road lines
content = content.replace(/<meshStandardMaterial color="#8B5A2B" roughness=\{0.6\} emissive="#a8cfe8" emissiveIntensity=\{0.1\} \/>/g,
  `<meshStandardMaterial color="#F8C000" roughness={0.6} />`);

// Grass patches
content = content.replace(/color=\{i % 2 \? '#A0522D' : '#64748B'\} roughness=\{1\}/g,
  "color={i % 2 ? '#4a8f3c' : '#3e7a32'} roughness={1}");

fs.writeFileSync(file, content);
console.log('Fixed Neighborhood Grass/Road');
