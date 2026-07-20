const fs = require('fs');
let file = 'artifacts/3d-game/src/scenes/NeighborhoodScene.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/HOUSE_COLORS = \['#E2E8F0', '#64748B', '#A0522D', '#8B5A2B'\]/g, "HOUSE_COLORS = ['#F8FAFC', '#B0C4DE', '#F5F5DC', '#B22222']");
content = content.replace(/ROOF_COLORS = \['#1E3A8A', '#0F766E', '#D4AF37', '#1E3A8A'\]/g, "ROOF_COLORS = ['#333333', '#4A3C31', '#2F4F4F', '#3A3A3A']");

// Also there's some #0F766E and #1E3A8A left in NeighborhoodScene for accents that might be weird:
content = content.replace(/color="#0F766E" roughness=\{0.6\}/g, 'color="#8B5A2B" roughness={0.6}'); // Wood trim/door?
content = content.replace(/color="#0F766E" roughness=\{0.9\}/g, 'color="#8B5A2B" roughness={0.9}'); 
content = content.replace(/color="#1E3A8A" metalness=\{0.6\} roughness=\{0.1\}/g, 'color="#7fb2d9" metalness={0.6} roughness={0.1}');

fs.writeFileSync(file, content);
console.log('Fixed NeighborhoodScene');
