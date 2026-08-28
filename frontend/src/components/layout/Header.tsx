import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { IconButton } from '../ui/IconButton';
import { ShareJourneyModal } from '../journey/ShareJourneyModal';
import { SearchInput } from '../../features/search/SearchInput';
import { useUIStore } from '../../stores/uiStore';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isJourney = location.pathname.startsWith('/journey/');
  const trainId = isJourney ? location.pathname.split('/journey/')[1] : '';
  const [shareOpen, setShareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const favourites = useUIStore((s) => s.favourites);

  // Close search popover on route change
  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  const handleGlobalSearchClick = () => {
    if (isJourney) {
      setSearchOpen(true);
    } else {
      // On homepage, scroll smoothly to hero search input and focus it
      const heroInput = document.querySelector<HTMLInputElement>('input[role="combobox"]');
      if (heroInput) {
        heroInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        heroInput.focus();
      }
    }
  };

  return (
    <header className="sticky top-0 z-[var(--z-header)] h-16 w-full bg-[var(--surface-elevated)]/95 backdrop-blur-md border-b border-[var(--border)] select-none shrink-0 transition-shadow flex justify-center">
      <div className="w-full max-w-[1200px] h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Back Navigation */}
        <div className="flex items-center gap-3 shrink-0">
          {isJourney && (
            <Link
              to="/"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors mr-1"
              aria-label="Back to home"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
          )}

          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[var(--text-primary)] hover:opacity-90 transition-opacity"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] text-base font-bold shadow-xs">
              🚆
            </span>
            <span className="font-extrabold tracking-tight text-[1.125rem]">RailGaadi</span>
          </Link>
        </div>

        {/* Right: Navigation & Actions */}
        <div className="flex items-center gap-3">
          {isJourney ? (
            <>
              {searchOpen ? (
                <div className="fixed inset-x-4 top-3 z-50 md:static md:w-80 animate-slide-down">
                  <SearchInput
                    variant="compact"
                    onSelect={(train) => {
                      setSearchOpen(false);
                      navigate(`/journey/${train.id}`);
                    }}
                  />
                </div>
              ) : (
                <IconButton
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  }
                  aria-label="Search trains"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchOpen(true)}
                />
              )}

              <IconButton
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                }
                aria-label="Share journey"
                variant="secondary"
                size="sm"
                onClick={() => setShareOpen(true)}
              />
            </>
          ) : (
            <>
              {/* Quick Search Shortcut button */}
              <button
                type="button"
                onClick={handleGlobalSearchClick}
                className="hidden sm:flex items-center gap-2.5 h-9 px-3.5 bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-secondary)] transition-all cursor-pointer shadow-xs"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-tertiary)]">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span>Search train or route</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-tertiary)]">
                  ⌘K
                </kbd>
              </button>

              {favourites.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface-subtle)] border border-[var(--border)] rounded-full shadow-xs">
                  <span className="text-yellow-500">★</span>
                  <span>{favourites.length} saved</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {trainId && (
        <ShareJourneyModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          trainId={trainId}
          trainName="Live Train"
        />
      )}
    </header>
  );
}
