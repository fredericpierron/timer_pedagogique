import React, { useState } from 'react';
import { useScheduleStore } from '../store/schedule';

export const ScheduleInput = () => {
  const storeText = useScheduleStore(state => state.text);
  const setFromText = useScheduleStore(state => state.setFromText);
  const [text, setText] = useState(storeText);

  return (
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <h2 className="text-xl font-semibold">Saisie de l'emploi du temps</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full mt-2 p-2 border rounded h-28"
      />
      <button
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => setFromText(text)}
      >Enregistrer</button>
    </div>
  );
};