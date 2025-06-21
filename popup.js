const toggle = document.getElementById("toggleAutoNext");
const statusText = document.getElementById("statusText");

const updateStatusText = (enabled) => {
  statusText.textContent = enabled ? "Feature is ON" : "Feature is OFF";
  statusText.style.color = enabled ? "#1db954" : "#bbb";
};

// Load saved setting from storage and update UI
chrome.storage.sync.get(["autoNextEnabled"], ({ autoNextEnabled }) => {
  // Default to enabled (true)
  const enabled = autoNextEnabled === undefined ? true : autoNextEnabled;
  toggle.checked = enabled;
  updateStatusText(enabled);
});

// On toggle change, save setting and update UI
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ autoNextEnabled: enabled });
  updateStatusText(enabled);
});
