import { IconButton } from '../ui/IconButton';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetBearing: () => void;
  onToggleFullscreen: () => void;
  onToggleFollow: () => void;
  isFollowing: boolean;
  className?: string;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onToggleFullscreen,
  onToggleFollow,
  isFollowing,
  className = '',
}: MapControlsProps) {
  return (
    <div className={`flex flex-col gap-1.5 bg-[var(--surface-elevated)]/90 backdrop-blur-md p-1.5 rounded-[var(--radius-panel)] border border-[var(--border)] shadow-[var(--shadow-panel)] z-[var(--z-map-controls)] ${className}`}>
      <IconButton
        icon={<span>◎</span>}
        aria-label={isFollowing ? 'Following train' : 'Center on train'}
        variant={isFollowing ? 'primary' : 'ghost'}
        size="md"
        onClick={onToggleFollow}
      />
      <div className="h-px bg-[var(--border)] my-0.5" />
      <IconButton
        icon={<span className="font-bold">+</span>}
        aria-label="Zoom in"
        variant="ghost"
        size="md"
        onClick={onZoomIn}
      />
      <IconButton
        icon={<span className="font-bold">−</span>}
        aria-label="Zoom out"
        variant="ghost"
        size="md"
        onClick={onZoomOut}
      />
      <div className="h-px bg-[var(--border)] my-0.5" />
      <IconButton
        icon={<span>⟳</span>}
        aria-label="Reset bearing"
        variant="ghost"
        size="md"
        onClick={onResetBearing}
      />
      <IconButton
        icon={<span>⛶</span>}
        aria-label="Toggle fullscreen"
        variant="ghost"
        size="md"
        onClick={onToggleFullscreen}
      />
    </div>
  );
}
