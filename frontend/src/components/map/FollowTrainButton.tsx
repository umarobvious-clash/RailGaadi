import { Button } from '../ui/Button';

interface FollowTrainButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function FollowTrainButton({ onClick, visible }: FollowTrainButtonProps) {
  if (!visible) return null;

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[var(--z-map-controls)] animate-in fade-in slide-in-from-top-4">
      <Button
        variant="primary"
        size="sm"
        onClick={onClick}
        className="shadow-[var(--shadow-panel)] backdrop-blur-md"
      >
        <span className="mr-1.5">◎</span> Re-center on train
      </Button>
    </div>
  );
}
