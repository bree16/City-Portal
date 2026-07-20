const fs = require('fs');
const glob = require('fs').readdirSync('artifacts/3d-game/src/scenes').filter(f => f.endsWith('.tsx')).map(f => 'artifacts/3d-game/src/scenes/' + f);

glob.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix text colors in UI elements that got changed to white/cream (#F8FAFC) instead of dark text
    content = content.replace(/color: '#F8FAFC'/g, "color: '#0F172A'");
    content = content.replace(/color: '#E2E8F0'/g, "color: '#334155'");
    
    // Fix borders that got changed to #F8FAFC
    content = content.replace(/border: '2px solid #F8FAFC'/g, "border: '2px solid #1E3A8A'");
    content = content.replace(/border: '1px solid #F8FAFC'/g, "border: '1px solid #1E3A8A'");
    
    // Fix button backgrounds that were neon and are now maybe bad combos
    
    fs.writeFileSync(file, content);
});
console.log('Fixed UI text colors');
