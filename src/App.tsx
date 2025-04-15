import React from 'react';
import { PlanningView } from './views/PlanningView';
import { ActiveTimer } from './components/ActiveTimer';
import { ScheduleInput } from './components/ScheduleInput';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Timer pédagogique</h1>
      <ScheduleInput />
      <PlanningView />
      <ActiveTimer />
    </div>
  );
}

export default App;
