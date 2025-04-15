import React, { useState, useEffect } from 'react';

export const ActiveTimer = () => {
  const [duration, setDuration] = useState(600);
  const [remaining, setRemaining] = useState(600);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(interval);
          alert('Minuteur terminé');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => {
    setRemaining(duration);
    setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow mt-4">
      <h2 className="text-xl font-semibold">Minuteur</h2>
      <div className="mt-2 text-gray-800 text-3xl">
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
      </div>
      <div className="mt-4 space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setIsRunning(true)}>Démarrer</button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setIsRunning(false)}>Pause</button>
        <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={reset}>Réinitialiser</button>
      </div>
    </div>
  );
};
