// Fichier : utils/parser.ts
import { Slot } from '../store/schedule';

export function parseScheduleText(input: string): Slot[] {
  const lines = input.split('\n');
  const slots: Slot[] = [];

  for (const line of lines) {
    const firstColon = line.indexOf(':');
    if (firstColon === -1) continue;
    const dayPart = line.slice(0, firstColon).trim();
    const rest = line.slice(firstColon + 1);
    const items = rest.split(';');

    for (const item of items) {
      const trimmed = item.trim();
      console.log('🔍 Analyse élément :', trimmed);

      const parts = trimmed.split(/\s+/);
      if (parts.length !== 2) {
        console.warn('❌ Format invalide (pas 2 blocs) :', trimmed);
        continue;
      }

      const type = parts[0];
      const times = parts[1].split('-');
      if (times.length !== 2) {
        console.warn('❌ Format invalide (pas une plage horaire) :', trimmed);
        continue;
      }

      let [start, end] = times.map(t => t.padStart(5, '0'));

      const slot: Slot = { day: dayPart, type, start, end };
      slots.push(slot);
      console.log('✅ Slot ajouté :', slot);
    }
  }

  console.log('📦 Résultat final :', slots);
  return slots;
}