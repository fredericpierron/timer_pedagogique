// Fichier : utils/time.ts
import { Slot } from '../store/schedule';

export function getCurrentSlot(slots: Slot[]): Slot | null {
  const now = new Date();
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const today = dayNames[now.getDay()];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  console.log('>> JOUR :', today, 'Heure actuelle (min) :', currentTime);

  for (const slot of slots) {
    if (slot.day !== today) continue;
    const [sh, sm] = slot.start.split(':').map(Number);
    const [eh, em] = slot.end.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    console.log(`-- Vérifie : ${slot.type} ${slot.start}-${slot.end} => ${start}-${end}`);

    if (currentTime >= start && currentTime < end) {
      console.log('✔️ Trouvé :', slot);
      return slot;
    }
  }

  console.log('❌ Aucune plage active');
  return null;
}