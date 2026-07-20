const fs = require('fs');
let file = 'artifacts/3d-game/src/components/decor/DecorKit.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/color = '#0F766E'/g, "color = '#8FBC8F'"); // WallArt default
content = content.replace(/color="#D4AF37" roughness/g, 'color="#BDB76B" roughness'); // Art accent
content = content.replace(/color="#1E3A8A" roughness={0.9}/g, 'color="#CD853F" roughness={0.9}'); // Art accent
content = content.replace(/color="#D4AF37" \/>/g, 'color="#B8860B" />'); // Lamp switch etc
content = content.replace(/color = '#1E3A8A', border = '#D4AF37'/g, "color = '#A0522D', border = '#CD853F'"); // Rug default
content = content.replace(/BOOK_COLORS = \['#1E3A8A', '#0D9488', '#D4AF37', '#10B981', '#38BDF8', '#8B4513', '#5F9EA0'\]/g, "BOOK_COLORS = ['#8B0000', '#2F4F4F', '#B8860B', '#556B2F', '#4682B4', '#8B4513', '#5F9EA0']");

fs.writeFileSync(file, content);
console.log('Fixed DecorKit');
