import os
import glob

replacements = {
    # Dark neon backgrounds to warm neutrals
    "'#09070a'": "'#F8FAFC'", # ceiling/walls
    '"#09070a"': '"#F8FAFC"',
    "'#110e15'": "'#E2E8F0'", # side walls
    '"#110e15"': '"#E2E8F0"',
    "'#1a0a2a'": "'#8B5A2B'", # hardwood
    '"#1a0a2a"': '"#8B5A2B"',
    "'#2b0a3d'": "'#64748B'", # furniture/slate
    '"#2b0a3d"': '"#64748B"',
    "'#1a0521'": "'#A0522D'", # wood/darker furniture
    '"#1a0521"': '"#A0522D"',
    
    # Neon accents to civic colors
    "'#ff007f'": "'#1E3A8A'", # magenta -> navy
    '"#ff007f"': '"#1E3A8A"',
    "'#ffea00'": "'#D4AF37'", # yellow -> gold
    '"#ffea00"': '"#D4AF37"',
    "'#00f0ff'": "'#0F766E'", # cyan -> teal
    '"#00f0ff"': '"#0F766E"',
    "'#7b00ff'": "'#047857'", # purple -> emerald
    '"#7b00ff"': '"#047857"',

    "'var(--magenta)'": "'#1E3A8A'",
    '"var(--magenta)"': '"#1E3A8A"',
    "'var(--teal)'": "'#0F766E'",
    '"var(--teal)"': '"#0F766E"',
    "'var(--gold)'": "'#D4AF37'",
    '"var(--gold)"': '"#D4AF37"',
    
    # other specific neon colors
    "'#0A8F7E'": "'#0F766E'",
    '"#0A8F7E"': '"#0F766E"',
    "'#4A90C4'": "'#38BDF8'",
    '"#4A90C4"': '"#38BDF8"',
    "'#00ffff'": "'#38BDF8'",
    '"#00ffff"': '"#38BDF8"',
    "'#ff7b00'": "'#D4AF37'",
    '"#ff7b00"': '"#D4AF37"',
    "'rgba(0,240,255'": "'rgba(15,118,110'",
    '"rgba(0,240,255"': '"rgba(15,118,110"',
}

files = glob.glob('artifacts/3d-game/src/scenes/*.tsx')
for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Replaced colors in scenes.")
