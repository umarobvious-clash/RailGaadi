import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useTrainSearch } from '../../hooks/useTrainSearch';
import { SearchResults } from './SearchResults';
import type { Train } from '../../types';

interface SearchInputProps {
  onSelect: (train: Train) => void;
  placeholder?: string;
  className?: string;
  variant?: 'hero' | 'compact';
}

export function SearchInput({
  onSelect,
  placeholder = 'Search train number or name...',
  className = '',
  variant = 'hero',
}: SearchInputProps) {
  const { query, setQuery, results, isLoading, isError } = useTrainSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Click-outside closes the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global shortcut ⌘K / Ctrl+K to focus hero search input
  useEffect(() => {
    if (variant !== 'hero') return;

    function handleGlobalKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsOpen(true);
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [variant]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      const q = query.trim();
      if (results.length > 0) {
        setIsOpen(false);
        setQuery('');
        onSelect(results[0]);
      } else if (/^\d{3,5}$/.test(q)) {
        setIsOpen(false);
        setQuery('');
        onSelect({
          id: q,
          number: q,
          name: `Express ${q}`,
          origin: { id: 'ORG', name: 'Origin Station' },
          destination: { id: 'DST', name: 'Destination Station' },
        });
      }
    }
  };

  const isHero = variant === 'hero';

  // Container styles
  const containerBase =
    'bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] transition-all duration-[var(--duration-base)] hover:border-[var(--border-strong)]';
  const containerRadius = isHero
    ? 'rounded-[var(--radius-panel)]'
    : 'rounded-[var(--radius-control)]';
  const containerFocus = isFocused
    ? 'ring-2 ring-[var(--accent)] border-[var(--accent)] shadow-[var(--shadow-panel)]'
    : '';

  // Input height
  const inputHeight = isHero ? 'h-14 sm:h-16' : 'h-10';

  // Icon sizes
  const iconSize = isHero ? 18 : 15;
  const iconLeft = isHero ? 'left-4 sm:left-5' : 'left-3';
  const inputPaddingLeft = isHero ? 'pl-11 sm:pl-13' : 'pl-9';
  const inputPaddingRight = isHero ? 'pr-20 sm:pr-24' : 'pr-8';
  const inputTextSize = isHero ? 'text-base sm:text-lg' : 'text-sm';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search box */}
      <div className={`relative flex items-center ${containerBase} ${containerRadius} ${containerFocus}`}>
        {/* Search icon */}
        <span className={`absolute ${iconLeft} text-[var(--text-tertiary)] pointer-events-none`} aria-hidden="true">
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen && query.length >= 2}
          aria-controls="search-results-dropdown"
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          className={`
            w-full ${inputHeight} ${inputPaddingLeft} ${inputPaddingRight}
            bg-transparent outline-none
            ${inputTextSize} font-[var(--font-sans)]
            text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
          `}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />

        {/* Right side: keyboard shortcut (hero only) or clear button */}
        <div className="absolute right-3.5 sm:right-4 flex items-center gap-2">
          {/* Clear button — shown when query is non-empty */}
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--surface-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* ⌘K shortcut pill — hero variant only, hidden once user starts typing */}
          {isHero && !query && (
            <kbd
              aria-label="Keyboard shortcut: Command K"
              className="hidden sm:inline-block bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-tertiary)] text-[11px] font-mono px-2 py-1 rounded-md select-none pointer-events-none"
            >
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div
          id="search-results-dropdown"
          role="listbox"
          className="
            absolute top-[calc(100%+8px)] left-0 w-full
            max-h-80 overflow-y-auto
            bg-[var(--surface)] border border-[var(--border)]
            rounded-[var(--radius-card)] shadow-[var(--shadow-modal)]
            z-50 animate-slide-down
          "
        >
          <SearchResults
            results={results}
            isLoading={isLoading}
            isError={isError}
            query={query}
            onSelect={(train) => {
              setIsOpen(false);
              setQuery('');
              onSelect(train);
            }}
          />
        </div>
      )}
    </div>
  );
}
