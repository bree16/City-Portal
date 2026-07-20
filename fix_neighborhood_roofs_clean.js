const fs = require('fs');
let file = 'artifacts/3d-game/src/scenes/NeighborhoodScene.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the roof block
content = content.replace(/\{\/\* Roof \*\/\}(.|\n)*?\{\/\* Front door \*\/\}/g, 
`{/* Roof */}
            <mesh position={[0, 3.601, 0]} castShadow>
              {/* Scale a cone rotated 45deg to create a rectangular pyramid that overhangs 5.5 x 4.5 by 1.1x */}
              <group scale={[6.05 / 5.656, 1, 4.95 / 5.656]}>
                <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
                  <coneGeometry args={[4.0, 2.0, 4]} />
                  <meshStandardMaterial color={ROOF_COLORS[idx]} roughness={0.8} />
                </mesh>
              </group>
            </mesh>
            {/* Front door */}`);

content = content.replace(/\{\/\* Chimney \*\/\}(.|\n)*?\{\/\* Tree \*\/\}/g,
`{/* Chimney */}
            <mesh position={[1.8, 3.8, -0.5]} castShadow>
              <boxGeometry args={[0.45, 2.4, 0.45]} />
              <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
            </mesh>
            {/* Tree */}`);

fs.writeFileSync(file, content);
console.log('Cleaned Neighborhood roofs');
