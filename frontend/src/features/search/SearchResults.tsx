import { Skeleton } from '../../components/ui/Skeleton';
import type { Train } from '../../types';

interface SearchResultsProps {
  results: Train[];
  isLoading: boolean;
  isError: boolean;
  query: string;
  onSelect: (train: Train) => void;
}

// ── Sub-component ────────────────────────────────────────────────────────────

interface SearchResultRowProps {
  train: Train;
  onClick: () => void;
}

function SearchResultRow({ train, onClick }: SearchResultRowProps) {
  return (
    <li
      role="option"
      aria-selected={false}
      onClick={onClick}
      className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0"
    >
      {/* Train number badge */}
      <span className="font-mono bg-[var(--accent-subtle)] text-[var(--accent)] text-[11px] px-1.5 py-0.5 rounded shrink-0">
        {train.number}
      </span>

      {/* Name + route */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--text-primary)] truncate leading-snug">
          {train.name}
        </p>
        <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
          {train.origin.name}
          <span className="mx-1 text-[var(--text-tertiary)]">→</span>
          {train.destination.name}
        </p>
      </div>

      {/* Chevron */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[var(--text-tertiary)] shrink-0"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </li>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function SearchResults({ results, isLoading, isError, query, onSelect }: SearchResultsProps) {
  // Loading state — 3 skeleton rows
  if (isLoading) {
    return (
      <div className="p-3 space-y-2" aria-label="Loading results" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 rounded-[var(--radius-control)]" />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center gap-2 px-4 py-5 text-[var(--danger)] text-sm" role="alert">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Could not load results. Please try again.</span>
      </div>
    );
  }

  // Empty state — only shown when user has typed a real query
  if (results.length === 0 && query.length >= 2) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--text-tertiary)]"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <p className="text-sm text-[var(--text-secondary)]">
          No trains found for{' '}
          <span className="font-medium text-[var(--text-primary)]">&ldquo;{query}&rdquo;</span>
        </p>
      </div>
    );
  }

  // Results list
  return (
    <ul role="listbox" aria-label="Train search results">
      {results.map((train) => (
        <SearchResultRow
          key={train.id}
          train={train}
          onClick={() => onSelect(train)}
        />
      ))}
    </ul>
  );
}
