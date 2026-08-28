import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';

const JourneyPage = lazy(() => import('./pages/JourneyPage'));
const SharedJourneyPage = lazy(() => import('./pages/SharedJourneyPage'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route 
          path="journey/:trainId" 
          element={
            <Suspense fallback={<div className="p-8 text-[var(--text-secondary)]">Loading journey...</div>}>
              <JourneyPage />
            </Suspense>
          } 
        />
        <Route 
          path="share/:shareId" 
          element={
            <Suspense fallback={<div className="p-8 text-[var(--text-secondary)]">Loading shared journey...</div>}>
              <SharedJourneyPage />
            </Suspense>
          } 
        />
        <Route path="*" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">404 - Not Found</h1></div>} />
      </Route>
    </Routes>
  );
}
