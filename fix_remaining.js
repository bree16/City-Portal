const fs = require('fs');

function replaceFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  replacements.forEach(([regex, rep]) => {
    content = content.replace(regex, rep);
  });
  fs.writeFileSync(path, content);
}

// ApartmentScene
replaceFile('artifacts/3d-game/src/scenes/ApartmentScene.tsx', [
  [/color=\{i === 0 \? '#1E3A8A' : i === 1 \? '#D4AF37' : '#0F766E'\}/g, "color={i === 0 ? '#4682B4' : i === 1 ? '#8B5A2B' : '#556B2F'}"]
]);

// ClosingScene
replaceFile('artifacts/3d-game/src/scenes/ClosingScene.tsx', [
  [/color=\{\['#1E3A8A', '#0F766E', '#D4AF37', '#047857', '#D4AF37', '#38BDF8'\]\[i\]\}/g, "color={['#8B0000', '#2F4F4F', '#B8860B', '#556B2F', '#A0522D', '#4682B4'][i]}"]
]);

// CounselorOfficeScene
replaceFile('artifacts/3d-game/src/scenes/CounselorOfficeScene.tsx', [
  [/border="#0F766E"/g, 'border="#2F4F4F"'],
  [/leafColor="#0F766E" potColor="#D4AF37"/g, 'leafColor="#2E8B57" potColor="#8B5A2B"'],
  [/shadeColor="#D4AF37" lightColor="#D4AF37"/g, 'shadeColor="#F5F5DC" lightColor="#FFF0D4"']
]);

// HomeInteriorScene
replaceFile('artifacts/3d-game/src/scenes/HomeInteriorScene.tsx', [
  [/color=\{homeId === 1 \? '#0F766E' : homeId === 3 \? '#D4AF37' : '#1E3A8A'\}/g, "color={homeId === 1 ? '#4682B4' : homeId === 3 ? '#8B5A2B' : '#708090'}"],
  [/leafColor="#0F766E"/g, 'leafColor="#2E8B57"'],
  [/potColor="#D4AF37" leafColor="#1E3A8A"/g, 'potColor="#D2B48C" leafColor="#228B22"']
]);

// HomeLifeScene
replaceFile('artifacts/3d-game/src/scenes/HomeLifeScene.tsx', [
  [/border="#1E3A8A"/g, 'border="#2F4F4F"'],
  [/shadeColor="#D4AF37" lightColor="#D4AF37"/g, 'shadeColor="#F5F5DC" lightColor="#FFF0D4"']
]);

console.log('Fixed remaining scene colors');
