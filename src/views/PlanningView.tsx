import React, { useEffect, useState } from 'react';
import { useScheduleStore } from '../store/schedule';
import { getCurrentSlot } from '../utils/time';

export const PlanningView = () => {
  const slots = useScheduleStore(state => state.slots);
  const [currentSlot, setCurrentSlot] = useState(() => getCurrentSlot(slots));
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string | null>(null); // Temps écoulé depuis le début de la période
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      const slot = getCurrentSlot(slots);
      setCurrentSlot(slot);

      if (slot) {
        const now = new Date();
        const [sh, sm] = slot.start.split(':').map(Number); // Heure et minute de début de la période
        const [eh, em] = slot.end.split(':').map(Number); // Heure et minute de fin de la période

        // Création d'un objet Date pour le début du créneau
        const startTime = new Date();
        startTime.setHours(sh, sm, 0, 0); // Définir l'heure de début du créneau
        const endTime = new Date();
        endTime.setHours(eh, em, 0, 0); // Définir l'heure de fin du créneau

        // Calcul du temps écoulé
        const elapsedMillis = now.getTime() - startTime.getTime();
        const elapsedMinutes = Math.floor(elapsedMillis / 60000); // Temps écoulé en minutes
        const elapsedSeconds = Math.floor((elapsedMillis / 1000) % 60); // Temps écoulé en secondes

        // Calcul du temps restant
        const remainingMillis = endTime.getTime() - now.getTime();
        const remainingMinutes = Math.floor(remainingMillis / 60000); // Convertir en minutes
        const remainingSec = Math.floor((remainingMillis / 1000) % 60); // Reste en secondes

        // Pourcentage du temps écoulé
        const totalMinutes = (endTime.getTime() - startTime.getTime()) / 60000; // Durée totale de la période en minutes
        const pct = (elapsedMinutes / totalMinutes) * 100;
        const clamped = Math.min(100, Math.max(0, pct));
        setProgress(clamped);

        // Mise à jour des valeurs de temps écoulé et restant
        setElapsedTime(`${elapsedMinutes} min ${elapsedSeconds.toString().padStart(2, '0')} s`);
        setRemainingTime(`${remainingMinutes} min ${remainingSec.toString().padStart(2, '0')} s`);

        // Mise à jour du camembert
        const canvas = document.getElementById('pieCanvas') as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.width;
            const r = canvas.width / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fond bleu du camembert
            ctx.beginPath();
            ctx.moveTo(r, r);
            ctx.arc(r, r, r, 0, 2 * Math.PI);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();

            // Portion rouge (temps écoulé)
            const totalSeconds = totalMinutes * 60; // Total en secondes
            const elapsedSecondsCalc = elapsedMinutes * 60; // Temps écoulé en secondes
            const angle = (elapsedSecondsCalc / totalSeconds) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(r, r);
            ctx.arc(r, r, r, -Math.PI / 2, -Math.PI / 2 + angle, false);
            ctx.fillStyle = '#dc2626';
            ctx.fill();

            // Aiguilles de l'horloge
            const clockRadius = r * 0.5;
            const cx = r;
            const cy = r;
            const drawHand = (angle: number, lengthRatio: number, width: number, color: string) => {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(
                cx + clockRadius * lengthRatio * Math.cos(angle - Math.PI / 2),
                cy + clockRadius * lengthRatio * Math.sin(angle - Math.PI / 2)
              );
              ctx.strokeStyle = color;
              ctx.lineWidth = width;
              ctx.lineCap = 'round';
              ctx.stroke();
              ctx.restore();
            };

            // Aiguille des heures
            const h = now.getHours() % 12 + now.getMinutes() / 60;
            const m = now.getMinutes();
            const s = now.getSeconds();
            drawHand((h / 12) * 2 * Math.PI, 0.5, 4, '#000'); // heure noire
            drawHand((m / 60) * 2 * Math.PI, 0.7, 2, '#fff'); // minute blanche
            drawHand((s / 60) * 2 * Math.PI, 0.9, 1, '#ff0'); // seconde jaune
          }
        }
      } else {
        setProgress(0);
        setRemainingTime(null);
        setElapsedTime(null);
      }
    };

    update(); // Initialisation au lancement
    const interval = setInterval(update, 1000); // Mise à jour chaque seconde
    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [slots]);

  return (
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <h2 className="text-xl font-semibold">Emploi du temps (jour)</h2>
      {currentSlot ? (
        <>
          <div className="mt-2 text-gray-800">
            <strong>{currentSlot.type}</strong> — {currentSlot.start} à {currentSlot.end}
          </div>

          {/* Barre de progression */}
          <div className="mt-2">
            <pre className="font-mono text-sm bg-gray-100 p-2 rounded">
              {(() => {
                const total = 50; // largeur de la barre
                const filled = Math.round((progress / 100) * total);
                const empty = total - filled;
                return 'x'.repeat(filled) + '-'.repeat(empty);
              })()}

            </pre>
            <canvas
              id="pieCanvas"
              className="mt-2 mx-auto"
              style={{ width: '40vw', maxWidth: '400px', height: 'auto' }}
            ></canvas>
          </div>

          {/* Affichage du temps */}
          <div className="mt-2 text-xs text-red-600">Progress brut = {progress.toFixed(2)}%</div>
          <div className="mt-2 text-sm text-gray-700">Temps écoulé : {elapsedTime}</div>
          <div className="mt-1 text-sm text-gray-700">Temps restant : {remainingTime}</div>

        </>
      ) : (
        <div className="mt-2 text-gray-600">Aucune plage active</div>
      )}
    </div>
  );
};
