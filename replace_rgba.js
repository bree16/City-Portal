const fs = require('fs');

const replacements = {
    // rgb/rgba strings
    "255,234,0": "212,175,55", // gold
    "255,0,127": "30,58,138", // navy
    "0,240,255": "15,118,110", // teal
    "123,0,255": "4,120,87", // emerald
};

const files = fs.readdirSync('artifacts/3d-game/src/scenes').filter(f => f.endsWith('.tsx')).map(f => 'artifacts/3d-game/src/scenes/' + f);
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    for (const [oldStr, newStr] of Object.entries(replacements)) {
        content = content.split(oldStr).join(newStr);
    }
    fs.writeFileSync(file, content);
});
console.log('Done replacing rgba!');
