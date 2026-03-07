const pageConfig = {
  // Title for your status page
  title: "Helltop Network Status",
  
  // Links shown at the header of your status page
  links: [
    { link: 'https://helltop.net', label: 'Main Site' },
    { link: 'mailto:admin@helltop.net', label: 'Contact', highlight: true },
  ],
}

const workerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  
  // Enable incident creation and notifications
  // You can set up Apprise / Discord / Telegram Webhooks here later
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // Placeholder for future webhook notifications (e.g., Discord)
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // Placeholder for ongoing incident alerts
    },
  },

  // Define all your Helltop monitors here
  monitors: [
    {
      id: 'monitor_auth',
      name: 'Auth Server',
      method: 'GET',
      target: 'https://auth.helltop.net',
      tooltip: 'SSO & Authentication',
      statusPageLink: 'https://auth.helltop.net',
      timeout: 10000,
    },
    {
      id: 'monitor_cloud',
      name: 'Cloud Storage',
      method: 'GET',
      target: 'https://cloud.helltop.net',
      tooltip: 'File Sync & Share (Seafile/Nextcloud)',
      statusPageLink: 'https://cloud.helltop.net',
      timeout: 10000,
    },
    {
      id: 'monitor_git',
      name: 'Git Repository',
      method: 'GET',
      target: 'https://git.helltop.net',
      tooltip: 'Source Code Management',
      statusPageLink: 'https://git.helltop.net',
      timeout: 10000,
    },
    {
      id: 'monitor_vault',
      name: 'Password Vault',
      method: 'GET',
      target: 'https://vault.helltop.net',
      tooltip: 'Bitwarden / Vaultwarden',
      statusPageLink: 'https://vault.helltop.net',
      timeout: 10000,
    },
    {
      id: 'monitor_immich',
      name: 'Immich Photos',
      method: 'GET',
      target: 'https://immich.helltop.net',
      tooltip: 'Photo & Video Backup',
      statusPageLink: 'https://immich.helltop.net',
      timeout: 10000,
    },
    {
      id: 'monitor_jellyfin',
      name: 'Jellyfin Media',
      method: 'GET',
      target: 'https://jellyfin.helltop.net/health', // /health is a good lightweight endpoint for Jellyfin
      tooltip: 'Media Server',
      statusPageLink: 'https://jellyfin.helltop.net',
      timeout: 10000,
    },
    {
      id: 'monitor_ldap',
      name: 'LDAP Directory',
      method: 'GET',
      target: 'https://ldap.helltop.net',
      tooltip: 'User Directory Services',
      statusPageLink: 'https://ldap.helltop.net',
      timeout: 10000,
    },
    {
      id: 'monitor_seerr',
      name: 'Overseerr',
      method: 'GET',
      target: 'https://seerr.helltop.net',
      tooltip: 'Media Requests',
      statusPageLink: 'https://seerr.helltop.net',
      timeout: 10000,
    },
  ],
}

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig }
