const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (let i = 0; i < replacements.length; i++) {
    const r = replacements[i];
    content = content.replace(r.search, r.replace);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// CharacterCreator.tsx
replaceInFile('artifacts/3d-game/src/components/characters/CharacterCreator.tsx', [
  { search: /1\.5px solid #D4A843/g, replace: '1.5px solid #ffea00' },
  { search: /2px solid #D4A843/g, replace: '2px solid #ffea00' },
  { search: /accentColor: '#D4A843'/g, replace: "accentColor: '#ffea00'" },
]);

// NPCCharacter.tsx
replaceInFile('artifacts/3d-game/src/components/characters/NPCCharacter.tsx', [
  { search: /1\.5px solid #D4A843/g, replace: '1.5px solid #ffea00' }
]);

// GameHUD.tsx
replaceInFile('artifacts/3d-game/src/components/GameHUD.tsx', [
  { search: /fill="#D4A843"/g, replace: 'fill="#ffea00"' },
  { search: /stroke="#D4A843"/g, replace: 'stroke="#ffea00"' },
  { search: /accentColor: '#D4A843'/g, replace: "accentColor: '#ffea00'" },
  { search: /accentColor: '#0A8F7E'/g, replace: "accentColor: '#00f0ff'" },
]);

// GamePage.tsx
replaceInFile('artifacts/3d-game/src/pages/GamePage.tsx', [
  { search: /rgba\(13,43,94,0\.92\)/g, replace: 'rgba(17,14,21,0.92)' },
  { search: /background: '#0D2B5E'/g, replace: "background: '#09070a'" },
  { search: /color: '#D4A843'/g, replace: "color: '#ffea00'" },
]);

// ClosingScene.tsx
replaceInFile('artifacts/3d-game/src/scenes/ClosingScene.tsx', [
  { search: /colors: \['#D4A843', '#0A8F7E', '#0D2B5E'/g, replace: "colors: ['#ffea00', '#00f0ff', '#09070a'" },
  { search: /colors: \['#D4A843'/g, replace: "colors: ['#ffea00'" },
  { search: /colors: \['#0A8F7E'/g, replace: "colors: ['#00f0ff'" },
]);

// NegotiationScene.tsx
replaceInFile('artifacts/3d-game/src/scenes/NegotiationScene.tsx', [
  { search: /accentColor: '#D4A843'/g, replace: "accentColor: '#ffea00'" },
  { search: /accentColor: '#0A8F7E'/g, replace: "accentColor: '#00f0ff'" },
]);
