import { maintenances, workerConfig } from '@/uptime.config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CompactedMonitorStateWrapper, getFromStore } from '@/worker/src/store'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { env } = getCloudflareContext()
    const compactedState = new CompactedMonitorStateWrapper(
      await getFromStore(env as any, 'state')
    )

    if (compactedState.data.lastUpdate === 0) {
      res.status(500).json({ error: 'No data available' })
      return
    }

    let monitors: any = {}

    for (let monitor of workerConfig.monitors) {
      const lastIncident = compactedState.getIncident(
        monitor.id,
        compactedState.incidentLen(monitor.id) - 1
      )

      const isUp = lastIncident?.end !== null
      const latency = compactedState.getLastLatency(monitor.id)
      monitors[monitor.id] = {
        up: isUp,
        latency: latency.ping,
        location: latency.loc,
        message: isUp ? 'OK' : lastIncident?.error[lastIncident.error.length - 1],
      }
    }

    let ret = {
      up: compactedState.data.overallUp,
      down: compactedState.data.overallDown,
      updatedAt: compactedState.data.lastUpdate,
      monitors,
      maintenances,
    }

    res.status(200).json(ret)
  } catch (err: any) {
    console.error('Error in data API:', err)
    res.status(500).json({ error: 'Internal Server Error', message: err.message })
  }
}
