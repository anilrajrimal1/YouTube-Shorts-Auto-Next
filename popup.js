document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('statusText');

  // Load the saved state
  chrome.storage.sync.get({ enabled: true }, (result) => {
    toggleSwitch.checked = result.enabled;
    updateStatusText(result.enabled);
  });

  // Handle toggle change
  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ enabled: isEnabled });
    updateStatusText(isEnabled);
  });

  function updateStatusText(isEnabled) {
    statusText.textContent = isEnabled ? 'Auto-Skip is ON' : 'Auto-Skip is OFF';
  }
});