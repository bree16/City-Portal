const fs = require('fs');
let file = 'artifacts/3d-game/src/data/buildings.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/color: '#8B4513',[\s\n]+accentColor: '#1E3A8A'/g, "color: '#8B4513', accentColor: '#2F4F4F'"); // Apartment
content = content.replace(/color: '#A0522D',[\s\n]+accentColor: '#D4AF37'/g, "color: '#A0522D', accentColor: '#2E8B57'"); // Coffee
content = content.replace(/color: '#F5F5DC',[\s\n]+accentColor: '#0F766E'/g, "color: '#F5F5DC', accentColor: '#708090'"); // Counselor
content = content.replace(/color: '#228B22',[\s\n]+accentColor: '#D4AF37'/g, "color: '#4A8F3C', accentColor: '#8B5A2B'"); // Park
content = content.replace(/color: '#E2E8F0',[\s\n]+accentColor: '#1E3A8A'/g, "color: '#E2E8F0', accentColor: '#4682B4'"); // Real Estate
content = content.replace(/color: '#64748B',[\s\n]+accentColor: '#D4AF37'/g, "color: '#708090', accentColor: '#F8FAFC'"); // Negotiation
content = content.replace(/color: '#0A2540',[\s\n]+accentColor: '#0F766E'/g, "color: '#B22222', accentColor: '#708090'"); // Bank
content = content.replace(/color: '#F8FAFC',[\s\n]+accentColor: '#1E3A8A'/g, "color: '#F8FAFC', accentColor: '#2F4F4F'"); // Closing

fs.writeFileSync(file, content);
console.log('Fixed buildings');
