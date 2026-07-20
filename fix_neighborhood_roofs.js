const fs = require('fs');
let file = 'artifacts/3d-game/src/scenes/NeighborhoodScene.tsx';
let content = fs.readFileSync(file, 'utf8');

// The house body is: <boxGeometry args={[5.5, 2.6, 4.5]} />
// Position is: <mesh position={[0, 1.3, 0]} castShadow>
// Wall top is 2.6.

// Roof
content = content.replace(/\{\/\* Roof \*\/\}\s*<mesh position=\{\[0, 3\.0, 0\]\} castShadow rotation=\{\[0, Math\.PI \/ 4, 0\]\}>\s*<coneGeometry args=\{\[4\.0, 2\.0, 4\]\} \/>/g, 
`{/* Roof */}
            <mesh position={[0, 3.6, 0]} castShadow>
              {/* Scale a cone rotated 45deg to create a rectangular pyramid that overhangs 5.5 x 4.5 by 1.1x */}
              <group scale={[6.05 / 5.656, 1, 4.95 / 5.656]}>
                <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
                  <coneGeometry args={[4.0, 2.0, 4]} />
                  <meshStandardMaterial color={ROOF_COLORS[idx]} roughness={0.8} />
                </mesh>
              </group>
            </mesh>
            {/* Hide original roof material line since we moved it inside group */}
            <mesh visible={false}>`);

content = content.replace(/\{\/\* Chimney \*\/\}\s*<mesh position=\{\[1\.8, 3\.0, -0\.5\]\} castShadow>\s*<boxGeometry args=\{\[0\.45, 1\.2, 0\.45\]\} \/>/g,
`{/* Chimney */}
            <mesh position={[1.8, 3.8, -0.5]} castShadow>
              <boxGeometry args={[0.45, 2.4, 0.45]} />`);

fs.writeFileSync(file, content);
console.log('Fixed Neighborhood roofs');
