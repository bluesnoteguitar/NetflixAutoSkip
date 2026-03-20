(function() {
    let skipIntroEnabled = true;
    let nextEpisodeEnabled = true;

    // Load initial state
    chrome.storage.local.get(['skipIntroEnabled', 'nextEpisodeEnabled'], (result) => {
        skipIntroEnabled = result.skipIntroEnabled !== false;
        nextEpisodeEnabled = result.nextEpisodeEnabled !== false;
        console.log('Netflix Auto-Skip: Intro=', skipIntroEnabled, 'Next=', nextEpisodeEnabled);
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            if (changes.skipIntroEnabled) skipIntroEnabled = changes.skipIntroEnabled.newValue;
            if (changes.nextEpisodeEnabled) nextEpisodeEnabled = changes.nextEpisodeEnabled.newValue;
        }
    });

    const SELECTORS_INTRO = [
        '[data-uia="player-skip-intro"]',
        '.watch-video--skip-content-button'
    ];

    const SELECTORS_NEXT = [
        '[data-uia="next-episode-button"]',
        '.watch-video--next-episode-button',
        '.player-postplay-still-hover-container'
    ];

    const TEXTS_INTRO = ['Skip Intro', 'Skip Credits', '跳過片頭', '跳過片尾'];
    const TEXTS_NEXT = ['Next Episode', '下一集'];

    function checkIntro() {
        if (!skipIntroEnabled) return false;
        
        // Selector check
        for (const s of SELECTORS_INTRO) {
            const btn = document.querySelector(s);
            if (btn && isVisible(btn)) {
                btn.click();
                return true;
            }
        }
        // Text check
        const buttons = document.querySelectorAll('button, span, div[role="button"]');
        for (const btn of buttons) {
            const text = btn.textContent.trim();
            if (TEXTS_INTRO.some(t => text.includes(t)) && isVisible(btn)) {
                btn.click();
                return true;
            }
        }
        return false;
    }

    function checkNext() {
        if (!nextEpisodeEnabled) return false;

        // Selector check
        for (const s of SELECTORS_NEXT) {
            const btn = document.querySelector(s);
            if (btn && isVisible(btn)) {
                btn.click();
                return true;
            }
        }
        // Text check
        const buttons = document.querySelectorAll('button, span, div[role="button"]');
        for (const btn of buttons) {
            const text = btn.textContent.trim();
            if (TEXTS_NEXT.some(t => text.includes(t)) && isVisible(btn)) {
                btn.click();
                return true;
            }
        }
        return false;
    }

    function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
    }

    const observer = new MutationObserver(() => {
        checkIntro();
        checkNext();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(() => {
        checkIntro();
        checkNext();
    }, 1000);

    console.log('Netflix Auto-Skip: Monitoring active...');
})();
