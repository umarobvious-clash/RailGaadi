import type { JourneyStatus } from '../types';

export function formatDelay(delayMinutes?: number): string {
  if (!delayMinutes || delayMinutes === 0) return 'On Time';
  if (delayMinutes < 0) return `${Math.abs(delayMinutes)} min early`;
  if (delayMinutes < 60) return `+${delayMinutes} min delay`;
  const hours = Math.floor(delayMinutes / 60);
  const mins = delayMinutes % 60;
  return `+${hours}h ${mins > 0 ? `${mins}m` : ''} delay`;
}

export function getStatusBadgeVariant(status: JourneyStatus, delayMinutes?: number): 'default' | 'success' | 'warning' | 'danger' {
  if (status === 'ON_TIME' || (delayMinutes !== undefined && delayMinutes <= 5)) return 'success';
  if (status === 'DELAYED' || (delayMinutes !== undefined && delayMinutes > 5 && delayMinutes <= 30)) return 'warning';
  if (delayMinutes !== undefined && delayMinutes > 30) return 'danger';
  return 'default';
}

export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || distanceKm === null) return '-- km';
  return `${Math.round(distanceKm)} km`;
}

export function isDataStale(updatedAt?: string, thresholdSeconds = 300): boolean {
  if (!updatedAt) return true;
  const diff = (Date.now() - new Date(updatedAt).getTime()) / 1000;
  return diff > thresholdSeconds;
}

export function formatRelativeTime(updatedAt?: string): string {
  if (!updatedAt) return 'Unknown';
  const seconds = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}
