import { Badge } from '../ui/Badge';
import { formatDelay, getStatusBadgeVariant } from '../../utils/journey';
import type { JourneyStatus } from '../../types';

interface DelayBadgeProps {
  status: JourneyStatus;
  delayMinutes?: number;
  className?: string;
}

export function DelayBadge({ status, delayMinutes, className }: DelayBadgeProps) {
  const variant = getStatusBadgeVariant(status, delayMinutes);
  const text = formatDelay(delayMinutes);

  return (
    <Badge variant={variant} className={className}>
      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse bg-current" />
      {text}
    </Badge>
  );
}
