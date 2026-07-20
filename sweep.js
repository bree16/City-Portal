const fs = require('fs');
const path = require('path');

const colorMap = {
  '#0D2B5E': '#09070a',
  '#0A8F7E': '#00f0ff',
  '#D4A843': '#ffea00',
  '#14B8A1': '#00f0ff',
  '#E5BC55': '#ffea00',
  '#C29532': '#ffea00',
  '#17CBB2': '#00f0ff',
  'rgba(212,168,67,': 'rgba(255,234,0,',
  'rgba(212, 168, 67,': 'rgba(255, 234, 0,',
  'rgba(10,143,126,': 'rgba(0,240,255,',
  'rgba(10, 143, 126,': 'rgba(0, 240, 255,',
  'rgba(13,43,94,': 'rgba(9,7,10,',
  'rgba(13, 43, 94,': 'rgba(9, 7, 10,',
  'rgba(23,42,84,': 'rgba(17,14,21,',
  'rgba(10,22,48,': 'rgba(9,7,10,',
  'rgba(2,8,24,': 'rgba(9,7,10,',
  'rgba(2, 8, 24,': 'rgba(9, 7, 10,',
  'rgba(5, 15, 40,': 'rgba(17, 14, 21,',
  'rgba(5,15,40,': 'rgba(17,14,21,'
};

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceUIColors(code) {
  const lines = code.split('\n');
  const newLines = lines.map(line => {
    // Determine if this is a UI line.
    // UI lines typically contain 'style=' or 'background:' or 'color:' or 'border:' inside JSX.
    // But NOT if it's a 3D prop like <meshStandardMaterial color="#..." />
    
    // We should skip lines that define 3D objects or materials
    if (
      line.includes('<mesh') || 
      line.includes('<pointLight') ||
      line.includes('<WallArt') || 
      line.includes('skinTone') || 
      line.includes('shirtColor') || 
      line.includes('pantsColor') || 
      line.includes('hairColor') ||
      line.includes('accentColor') ||
      line.includes('color={') && !line.includes('style=') ||
      line.includes('emissive') ||
      line.includes('metalness') ||
      line.includes('BOOK_COLORS')
    ) {
      return line;
    }
    
    // Only replace if it looks like a CSS string/object or UI element
    const isUI = line.includes('style=') || 
                 line.includes('background') || 
                 line.includes('color:') || 
                 line.includes('border') || 
                 line.includes('boxShadow') ||
                 line.includes('rgba(');

    if (!isUI) return line;

    let newLine = line;
    for (const [oldColor, newColor] of Object.entries(colorMap)) {
      newLine = newLine.split(oldColor).join(newColor);
    }
    
    // Also replace Inter, sans-serif if it's still around
    newLine = newLine.split('Inter, sans-serif').join('var(--display-font)');
    newLine = newLine.split('Inter,sans-serif').join('var(--display-font)');
    
    // Convert any remaining border-radius: Xpx to 0
    newLine = newLine.replace(/borderRadius:\s*\d+/g, 'borderRadius: 0');
    newLine = newLine.replace(/borderRadius:\s*['"]\d+px['"]/g, 'borderRadius: 0');
    newLine = newLine.replace(/borderRadius:\s*['"]50%['"]/g, "borderRadius: '50%'"); // keep circle
    newLine = newLine.replace(/borderRadius:\s*999/g, "borderRadius: 0"); // pill shape? user requested blocky aesthetic
    return newLine;
  });
  
  return newLines.join('\n');
}

walk('artifacts/3d-game/src/components', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const code = fs.readFileSync(filePath, 'utf8');
    const newCode = replaceUIColors(code);
    if (code !== newCode) {
      fs.writeFileSync(filePath, newCode, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

walk('artifacts/3d-game/src/scenes', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const code = fs.readFileSync(filePath, 'utf8');
    const newCode = replaceUIColors(code);
    if (code !== newCode) {
      fs.writeFileSync(filePath, newCode, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
