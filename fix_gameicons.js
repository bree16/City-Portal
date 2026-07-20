const fs = require('fs');
const glob = require('fs').readdirSync('artifacts/3d-game/src/scenes').filter(f => f.endsWith('.tsx')).map(f => 'artifacts/3d-game/src/scenes/' + f);

glob.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<GameIcon (.*?) color="#D2B48C"/g, '<GameIcon $1 color="#D4AF37"');
    content = content.replace(/<GameIcon (.*?) color="#5F9EA0"/g, '<GameIcon $1 color="#0F766E"');
    content = content.replace(/<GameIcon (.*?) color="#4682B4"/g, '<GameIcon $1 color="#1E3A8A"');
    fs.writeFileSync(file, content);
});
console.log('Fixed GameIcons');
