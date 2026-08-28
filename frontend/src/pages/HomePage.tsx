import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { SearchInput } from '../features/search/SearchInput';
import type { Train } from '../types';

// ─── Feature pills ─────────────────────────────────────────────────────────────

const FEATURE_PILLS = [
  { icon: '⚡', label: 'Live GPS location' },
  { icon: '🗺', label: 'Interactive dark map' },
  { icon: '🌤', label: 'Route weather' },
  { icon: '📊', label: 'Journey analytics' },
] as const;

// ─── Discovery feature cards ──────────────────────────────────────────────────

const DISCOVERY_CARDS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
    title: 'Live Location',
    badge: '15s Sync',
    desc: 'Watch your train move across India with real-time GPS coordinates, speed, and track curvature.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Journey Intelligence',
    badge: 'Delay & ETA',
    desc: 'Track delays, schedule deviations, dynamic ETAs, and station arrival milestones with precision.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
    title: 'Travel Companion',
    badge: 'Environment',
    desc: 'Explore route weather, mountain elevation profiles, rivers, and geographic landmarks live along your journey.',
  },
] as const;

// ─── Section Header ────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-end justify-between mb-4 w-full">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-xs font-semibold text-[var(--accent)] hover:underline transition-all cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── Train Card Component ──────────────────────────────────────────────────────

function TrainCard({
  train,
  onClick,
  onRemove,
  isFavorite = false,
}: {
  train: Train;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group relative flex items-center justify-between p-4 sm:p-5 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-[var(--radius-card)] shadow-xs hover:shadow-[var(--shadow-card)] transition-all duration-150 cursor-pointer text-left select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
            isFavorite
              ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
              : 'bg-[var(--surface-subtle)] text-[var(--accent)] border border-[var(--border)]'
          }`}
        >
          {isFavorite ? '★' : '🚆'}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-dim)]">
              {train.number}
            </span>
            <span className="font-bold text-sm text-[var(--text-primary)] truncate">
              {train.name}
            </span>
          </div>

          <div className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1.5 truncate">
            <span className="truncate">{train.origin?.name || 'Origin'}</span>
            <span className="text-[var(--text-tertiary)] font-bold">→</span>
            <span className="truncate">{train.destination?.name || 'Destination'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>

        <button
          type="button"
          aria-label={`Remove ${train.name}`}
          onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:bg-[var(--danger-subtle)] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Map Preview Card ──────────────────────────────────────────────────────────

function MapPreviewCard({ onSampleClick }: { onSampleClick: (trainId: string) => void }) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden w-full h-72 sm:h-84 md:h-96 bg-[var(--map-bg)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-panel)] group">
        
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Railway route SVG illustration */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 720 360"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Main Route Glow */}
          <path
            d="M 40 310 C 160 270, 240 160, 380 170 S 560 90, 680 50"
            stroke="rgba(23,105,255,0.2)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Main Completed Route (Blue) */}
          <path
            d="M 40 310 C 160 270, 240 160, 380 170 S 440 140, 480 120"
            stroke="#1769ff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Main Remaining Route (Dashed) */}
          <path
            d="M 480 120 C 520 100, 560 90, 680 50"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
          {/* Secondary branch line */}
          <path
            d="M 380 170 C 420 210, 490 260, 580 290"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />

          {/* Station Markers */}
          {[
            { cx: 40, cy: 310, isPassed: true },
            { cx: 200, cy: 225, isPassed: true },
            { cx: 380, cy: 170, isPassed: true },
            { cx: 480, cy: 120, isCurrent: true },
            { cx: 580, cy: 82, isPassed: false },
            { cx: 680, cy: 50, isPassed: false },
          ].map((st, i) => (
            <g key={i}>
              <circle
                cx={st.cx}
                cy={st.cy}
                r={st.isCurrent ? 7 : 4}
                fill={st.isCurrent ? '#1769ff' : st.isPassed ? '#10b981' : '#6b7280'}
                stroke="#191929"
                strokeWidth="2"
              />
              {st.isCurrent && (
                <circle
                  cx={st.cx}
                  cy={st.cy}
                  r="14"
                  fill="rgba(23,105,255,0.25)"
                  className="animate-ping"
                />
              )}
            </g>
          ))}
        </svg>

        {/* Top-left: Interactive preview badge */}
        <div className="absolute top-4 sm:top-5 left-4 sm:left-5 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-black/40 backdrop-blur-md text-white/90 border border-white/10 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Map Experience
          </span>
        </div>

        {/* Top-right: Fast interactive launch button */}
        <div className="absolute top-4 sm:top-5 right-4 sm:right-5">
          <button
            type="button"
            onClick={() => onSampleClick('12301')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-full shadow-md transition-all cursor-pointer hover:scale-105"
          >
            <span>Track Sample Train</span>
            <span>→</span>
          </button>
        </div>

        {/* Bottom Floating Info Overlay Card */}
        <div className="absolute bottom-4 sm:bottom-5 inset-x-4 sm:inset-x-5 flex items-center justify-between p-3.5 sm:p-4 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-[var(--radius-card)] shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 border border-[var(--accent)]/40 flex items-center justify-center text-lg shrink-0">
              🚆
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white truncate">12301 Howrah Rajdhani Express</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 shrink-0">
                  On Time
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5 truncate">
                Next: Pt. DD Upadhyaya Junction (DDU) • ETA 18:45
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSampleClick('12301')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-white transition-colors shrink-0 ml-3 cursor-pointer"
          >
            <span>Open live view</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main HomePage Component ──────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  const {
    recentSearches,
    removeRecentSearch,
    clearRecentSearches,
    addRecentSearch,
    favourites,
    removeFavourite,
  } = useUIStore();

  const handleSelectTrain = (train: Train) => {
    addRecentSearch(train);
    navigate(`/journey/${train.id}`);
  };

  const handleSampleClick = (trainId: string) => {
    navigate(`/journey/${trainId}`);
  };

  return (
    <div className="w-full min-h-full bg-[var(--background)] flex justify-center">
      {/* ── Global Centered Content Container (max-w-[1200px] aligned) ───────── */}
      <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 flex flex-col items-center gap-12 sm:gap-16 md:gap-18">

        {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
        <section className="w-full flex flex-col items-center text-center">
          {/* Eyebrow status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-xs mb-5">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Live Train Tracking
            </span>
          </div>

          {/* Headline */}
          <h1 className="w-full max-w-[780px] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08]">
            Track your train <br className="hidden sm:inline" />
            <span className="text-[var(--accent)]">in real time.</span>
          </h1>

          {/* Subtitle */}
          <p className="w-full max-w-[580px] text-sm sm:text-base md:text-lg text-[var(--text-secondary)] mt-4 sm:mt-5 leading-relaxed">
            Know exactly where your train is, when it arrives, and what you’re passing through.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-[640px] sm:max-w-[680px] mt-7 sm:mt-8">
            <SearchInput variant="hero" onSelect={handleSelectTrain} />
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5 sm:mt-6 max-w-[680px]">
            {FEATURE_PILLS.map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full shadow-xs"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
        </section>

        {/* ── RECENT SEARCHES (if available) ────────────────────────────────── */}
        {recentSearches.length > 0 && (
          <section className="w-full">
            <SectionHeader
              title="Recent Searches"
              subtitle="Quickly resume tracking recent journeys"
              action={{ label: 'Clear all', onClick: clearRecentSearches }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentSearches.map((train) => (
                <TrainCard
                  key={train.id}
                  train={train}
                  onClick={() => handleSelectTrain(train)}
                  onRemove={(e) => {
                    e.stopPropagation();
                    removeRecentSearch(train.id);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── FAVOURITES (if available) ─────────────────────────────────────── */}
        {favourites.length > 0 && (
          <section className="w-full">
            <SectionHeader
              title="Favourite Trains"
              subtitle="Pinned trains for one-click access"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favourites.map((train) => (
                <TrainCard
                  key={train.id}
                  train={train}
                  isFavorite
                  onClick={() => navigate(`/journey/${train.id}`)}
                  onRemove={(e) => {
                    e.stopPropagation();
                    removeFavourite(train.id);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── 3-COLUMN FEATURE DISCOVERY CARDS ──────────────────────────────── */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {DISCOVERY_CARDS.map(({ icon, title, badge, desc }) => (
              <div
                key={title}
                className="h-full flex flex-col justify-between p-6 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-xs hover:shadow-[var(--shadow-card)] hover:border-[var(--border-strong)] transition-all duration-150"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-dim)] flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--text-tertiary)] bg-[var(--surface-subtle)] border border-[var(--border)] px-2.5 py-0.5 rounded-full">
                      {badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MAP PREVIEW SECTION ───────────────────────────────────────────── */}
        <section className="w-full">
          <div className="text-center mb-5 sm:mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Interactive Map Experience
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-1">
              Immersive satellite and rail-track visualization
            </p>
          </div>
          <MapPreviewCard onSampleClick={handleSampleClick} />
        </section>

      </div>
    </div>
  );
}
