import type { NextApiRequest, NextApiResponse } from 'next'
import { CompactedMonitorStateWrapper, getFromStore } from '@/worker/src/store'
import { getCloudflareContext } from '@opennextjs/cloudflare'

type BadgePayload = {
  schemaVersion: 1
  label: string
  message: string
  color: string
  isError?: boolean
}

function errorBadge(label: string, message: string): BadgePayload {
  return {
    schemaVersion: 1,
    label,
    message,
    color: 'lightgrey',
    isError: true,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')

  try {
    const { env } = getCloudflareContext()
    const monitorId = req.query.id as string
    const label = (req.query.label as string) ?? monitorId ?? 'UptimeFlare'

    const upMsg = (req.query.up as string) ?? 'UP'
    const downMsg = (req.query.down as string) ?? 'DOWN'
    const colorUp = (req.query.colorUp as string) ?? 'brightgreen'
    const colorDown = (req.query.colorDown as string) ?? 'red'

    if (!monitorId) {
      res.status(400).json(errorBadge(label, 'no-monitor'))
      return
    }

    const compactedState = new CompactedMonitorStateWrapper(
      await getFromStore(env as any, 'state')
    )

    const lastIncident = compactedState.getIncident(
      monitorId,
      compactedState.incidentLen(monitorId) - 1
    )
    const isUp = lastIncident?.end !== null

    const badge: BadgePayload = {
      schemaVersion: 1,
      label,
      message: isUp ? upMsg : downMsg,
      color: isUp ? colorUp : colorDown,
    }

    res.status(200).json(badge)
  } catch (err: any) {
    console.error('Error rendering badge API:', err)
    res.status(500).json(errorBadge('status', 'error'))
  }
}
