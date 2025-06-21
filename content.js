(() => {
  console.log('[Shorts Auto Next] Content script loaded (Fixed)');

  let video = null;
  let lastTime = 0;
  let loopDetected = false;
  let timeUpdateHandler = null;

  let autoNextEnabled = true;

  chrome.storage.sync.get({ autoNextEnabled: true }, (result) => {
    autoNextEnabled = result.autoNextEnabled;
    console.log(`[Shorts Auto Next] Feature is initially ${autoNextEnabled ? 'ON' : 'OFF'}`);
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.autoNextEnabled) {
      autoNextEnabled = changes.autoNextEnabled.newValue;
      console.log(`[Shorts Auto Next] Feature is now ${autoNextEnabled ? 'ON' : 'OFF'}`);
    }
  });

  const sendDownArrowKey = () => {
    console.log('[Shorts Auto Next] Sending Down Arrow key event');

    const eventOptions = {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      which: 40,
      bubbles: true,
      cancelable: true,
    };

    window.focus();

    const target = document.querySelector('#shorts-player') || document.activeElement || document.body;
    ['keydown', 'keyup'].forEach(type => {
      target.dispatchEvent(new KeyboardEvent(type, eventOptions));
    });
    console.log(`[Shorts Auto Next] Dispatched key events`);
  };

  const attachListener = (vid) => {
    if (timeUpdateHandler && video) {
      video.removeEventListener('timeupdate', timeUpdateHandler);
    }

    video = vid;
    lastTime = 0;
    loopDetected = false;

    timeUpdateHandler = () => {
      if (!autoNextEnabled || !video.duration) return;

      try {
        if (!loopDetected && lastTime > 0.9 * video.duration && video.currentTime < 0.2) {
          loopDetected = true;
          console.log(`[Shorts Auto Next] Loop detected at time ${video.currentTime}`);
          sendDownArrowKey();
        } else if (video.currentTime > lastTime) {
          loopDetected = false;
        }
        lastTime = video.currentTime;
      } catch (e) {
        console.warn('[Shorts Auto Next] Error in timeupdate handler, likely due to video removal.', e.message);
      }
    };

    video.addEventListener('timeupdate', timeUpdateHandler);
    console.log('[Shorts Auto Next] timeupdate listener attached');
  };

  const checkAndAttach = () => {
    const vid = document.querySelector('ytd-reel-video-renderer[is-active] video');
    if (!vid) {
      return;
    }

    if (vid !== video) {
      attachListener(vid);
    }
  };

  let debounceTimeout;
  const debouncedCheck = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(checkAndAttach, 100);
  };
  
  const observer = new MutationObserver(debouncedCheck);

  // Start everything.
  checkAndAttach();
  observer.observe(document.body, { childList: true, subtree: true });
  console.log('[Shorts Auto Next] Observer started');
})();