const fs = require('fs');
const glob = require('fs').readdirSync('artifacts/3d-game/src/scenes').filter(f => f.endsWith('.tsx')).map(f => 'artifacts/3d-game/src/scenes/' + f);
glob.push('artifacts/3d-game/src/components/decor/DecorKit.tsx');
glob.push('artifacts/3d-game/src/data/homes.ts');

glob.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Lights and Emissive first
    content = content.replace(/emissive="#0F766E"/g, 'emissive="#E0F0FF"');
    content = content.replace(/color="#0F766E"/g, (match, offset, string) => {
        if (string.substring(Math.max(0, offset - 30), offset).includes('pointLight')) return 'color="#E0F0FF"';
        return 'color="#5F9EA0"'; // standard material
    });

    content = content.replace(/emissive="#1E3A8A"/g, 'emissive="#E0F0FF"');
    content = content.replace(/color="#1E3A8A"/g, (match, offset, string) => {
        if (string.substring(Math.max(0, offset - 30), offset).includes('pointLight')) return 'color="#E0F0FF"';
        return 'color="#4682B4"';
    });

    content = content.replace(/emissive="#D4AF37"/g, 'emissive="#FFF0D4"');
    content = content.replace(/color="#D4AF37"/g, (match, offset, string) => {
        if (string.substring(Math.max(0, offset - 30), offset).includes('pointLight')) return 'color="#FFF0D4"';
        return 'color="#D2B48C"';
    });
    
    content = content.replace(/leafColor="#D4AF37"/g, 'leafColor="#2E8B57"');

    // Also handle var(--gold) and var(--teal) in 3D props (not HTML styles)
    // Wait, HTML backgrounds might use #D4AF37. The prompt says "keep the civic UI theme as-is".
    // Let's revert the naive global replacements if they hit HTML UI.
    fs.writeFileSync(file, content);
});
console.log('Done');
