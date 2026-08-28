import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { createShareLink } from '../../services/train.api';

interface ShareJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainId: string;
  trainName: string;
}

export function ShareJourneyModal({ isOpen, onClose, trainId, trainName }: ShareJourneyModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    try {
      setLoading(true);
      const res = await createShareLink(trainId);
      const fullUrl = `${window.location.origin}${res.url}`;
      setShareUrl(fullUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (isOpen && !shareUrl) {
      generateLink();
    }
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: `Track ${trainName} on RailGaadi`,
          text: `Live tracking for ${trainName}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Live Journey">
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-secondary)]">
          Anyone with this link can track <strong>{trainName}</strong> in real-time.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={loading ? 'Generating link...' : shareUrl}
            className="flex-1 px-3 py-2 text-xs font-mono bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-control)] text-[var(--text-primary)] outline-none select-all"
          />
          <Button size="sm" onClick={handleCopy} disabled={!shareUrl || loading}>
            {copied ? 'Copied! ✓' : 'Copy'}
          </Button>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button variant="secondary" className="w-full" onClick={handleNativeShare} disabled={!shareUrl}>
            📱 Share via Apps
          </Button>
        )}
      </div>
    </Modal>
  );
}
