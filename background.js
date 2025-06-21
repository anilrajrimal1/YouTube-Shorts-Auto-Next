const STATE = {
  enabled: true,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(STATE);
  console.log('[Shorts Auto-Skip] Extension installed and initial state set.');
  updateIconBadge();
});

chrome.runtime.onStartup.addListener(() => {
  updateIconBadge();
});

async function updateIconBadge() {
  const { enabled } = await chrome.storage.sync.get('enabled');

  const badgeText = enabled ? 'ON' : 'OFF';
  const badgeColor = enabled ? '#4CAF50' : '#F44336';

  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && 'enabled' in changes) {
    console.log('[Shorts Auto-Skip] State changed, updating badge.');
    updateIconBadge();
  }
});