document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('statusText');
  const STORAGE_KEY = 'autoNextEnabled';

  chrome.storage.sync.get({ [STORAGE_KEY]: true }, (result) => {
    const enabled = result[STORAGE_KEY];
    toggleSwitch.checked = enabled;
    updateStatusText(enabled);
    updateBadge(enabled);
  });

  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ [STORAGE_KEY]: isEnabled }, () => {
      updateStatusText(isEnabled);
      updateBadge(isEnabled);
    });
  });

  function updateStatusText(isEnabled) {
    statusText.textContent = isEnabled ? 'Auto-Skip is ON' : 'Auto-Skip is OFF';
  }

  function updateBadge(isEnabled) {
    chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: isEnabled ? '#4CAF50' : '#F44336' });
  }
});
