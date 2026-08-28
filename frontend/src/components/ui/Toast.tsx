import { clsx } from 'clsx';

export interface ToastProps {
  message: string;
  variant?: 'default' | 'success' | 'error';
  visible: boolean;
  onClose?: () => void;
}

export function Toast({ message, variant = 'default', visible, onClose }: ToastProps) {
  if (!visible) return null;

  const variants = {
    default: 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--border)]',
    success: 'bg-[var(--success)] text-white border-transparent',
    error: 'bg-[var(--danger)] text-white border-transparent',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[var(--z-toast)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={clsx('flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] border shadow-[var(--shadow-panel)] text-sm font-medium', variants[variant])}>
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
