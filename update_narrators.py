#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('js/content/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check current state
if "narrator: 'Un miembro de Akatsuki fue detectado" in content:
    print("Akatsuki mission already has narrator")
else:
    print("Akatsuki mission needs narrator")
    # Find and replace Akatsuki mission line
    old_akatsuki = "{ name: '☠️ Célula Akatsuki: \"El Ritual\"', rank: 'S', description: 'Un miembro de Akatsuki prepara un ritual. Interrúmpelo o la aldea sangrará.', enemies:"
    new_akatsuki = "{ name: '☠️ Célula Akatsuki: \"El Ritual\"', rank: 'S', description: 'Un miembro de Akatsuki prepara un ritual. Interrúmpelo o la aldea sangrará.', narrator: 'Un miembro de Akatsuki fue detectado preparando un ritual de chakra masivo. El Hokage cree que es para extraer algo importante o causar ruina. No tenemos tiempo de esperar refuerzos. Debes interrumpir el ritual antes de que alcance completitud. Cuando irrumpes en la cámara ritual, la presencia es sofocante...', enemies:"
    if old_akatsuki in content:
        content = content.replace(old_akatsuki, new_akatsuki)
        print("✓ Akatsuki mission updated")
    else:
        print("✗ Could not find exact match for Akatsuki mission")

if "narrator: 'Un traidor dentro de Konoha ha estado vendiendo" in content:
    print("ANBU mission already has narrator")
else:
    print("ANBU mission needs narrator")
    # Find and replace ANBU mission line
    old_anbu = "{ name: '🌑 Operación \"Silencio ANBU\"', rank: 'S', description: 'Un traidor filtra secretos. Infiltra su red y bórrala sin testigos.', enemies:"
    new_anbu = "{ name: '🌑 Operación \"Silencio ANBU\"', rank: 'S', description: 'Un traidor filtra secretos. Infiltra su red y bórrala sin testigos.', narrator: 'Un traidor dentro de Konoha ha estado vendiendo secretos. El Hokage cree que está dentro del ANBU. Envía ninjas élite para infiltrar y borrar la red completamente sin alertar a civiles. Es trabajo sucio. Cuando entras en el escondite del traidor, descubres que es una red más grande y más profunda de lo esperado...', enemies:"
    if old_anbu in content:
        content = content.replace(old_anbu, new_anbu)
        print("✓ ANBU mission updated")
    else:
        print("✗ Could not find exact match for ANBU mission")

with open('js/content/data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nFile update complete!")
