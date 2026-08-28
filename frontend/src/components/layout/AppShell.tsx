import { useLocation, Outlet } from 'react-router-dom';
import { Header } from './Header';

export function AppShell() {
  const location = useLocation();
  const isJourney = location.pathname.startsWith('/journey/') || location.pathname.startsWith('/share/');

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--background)] overflow-hidden">
      <Header />
      <main className={`flex-1 relative ${isJourney ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain'}`}>
        <Outlet />
      </main>
    </div>
  );
}
