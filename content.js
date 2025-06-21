(() => {
  console.log('[Shorts Auto Next] Content script loaded');

  let video = null;
  let lastTime = 0;
  let loopDetected = false;
  let timeUpdateHandler = null;

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

    ['keydown', 'keypress', 'keyup'].forEach(type => {
      const event = new KeyboardEvent(type, eventOptions);
      document.activeElement.dispatchEvent(event);
      console.log(`[Shorts Auto Next] Dispatched ${type} event`);
    });
  };

  // Attach loop detection listener to video
  const attachListener = (vid) => {
    if (timeUpdateHandler && video) {
      video.removeEventListener('timeupdate', timeUpdateHandler);
      console.log('[Shorts Auto Next] Removed previous timeupdate listener');
    }

    video = vid;
    lastTime = 0;
    loopDetected = false;

    timeUpdateHandler = () => {
      chrome.storage.sync.get(['autoNextEnabled'], ({ autoNextEnabled }) => {
        if (!autoNextEnabled) return;

        if (!loopDetected && lastTime > 0.9 * video.duration && video.currentTime < 0.2) {
          loopDetected = true;
          console.log(`[Shorts Auto Next] Loop detected at time ${video.currentTime}`);
          sendDownArrowKey();
        } else if (video.currentTime > lastTime) {
          loopDetected = false;
        }
        lastTime = video.currentTime;
      });
    };

    video.addEventListener('timeupdate', timeUpdateHandler);
    console.log('[Shorts Auto Next] timeupdate listener attached');
  };

  // Find video element and attach listener if needed
  const checkAndAttach = () => {
    const vid = document.querySelector('video');
    if (!vid) {
      console.log('[Shorts Auto Next] No video element found, retrying in 1s...');
      setTimeout(checkAndAttach, 1000);
      return;
    }

    if (vid !== video) {
      attachListener(vid);
    }
  };

  // Observe DOM changes to detect SPA navigation or video changes
  const observer = new MutationObserver(() => {
    checkAndAttach();
  });

  // Start everything after window load
  window.addEventListener('load', () => {
    checkAndAttach();
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[Shorts Auto Next] MutationObserver started');
  });

  // Also immediately try in case load already fired
  checkAndAttach();
  observer.observe(document.body, { childList: true, subtree: true });
  console.log('[Shorts Auto Next] Initial MutationObserver started');
})();
