import { cache } from '../cache/cache';
import { RailRadarClient } from '../providers/railradar/RailRadarClient';
import crypto from 'crypto';

const railradar = new RailRadarClient();

export async function createShareLink(trainId: string): Promise<{ shareId: string; url: string }> {
  const shareId = 'sh_' + crypto.randomBytes(6).toString('hex');
  await cache.set('share:' + shareId, { trainId, createdAt: new Date().toISOString() }, 172800);

  return {
    shareId,
    url: '/share/' + shareId
  };
}

export async function getSharedJourney(shareId: string) {
  const shareData = await cache.get<{ trainId: string; createdAt: string }>('share:' + shareId);
  if (!shareData) {
    return null;
  }

  const live = await railradar.getLiveStatus(shareData.trainId);
  const route = await railradar.getRoute(shareData.trainId);

  return {
    shareId,
    sharedAt: shareData.createdAt,
    journey: live,
    route,
  };
}
