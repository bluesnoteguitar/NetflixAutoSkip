document.addEventListener('DOMContentLoaded', () => {
    const introToggle = document.getElementById('skip-intro-toggle');
    const nextToggle = document.getElementById('next-episode-toggle');
    const statusText = document.getElementById('status-text');

    // Load initial states
    chrome.storage.local.get(['skipIntroEnabled', 'nextEpisodeEnabled'], (result) => {
        const introVal = result.skipIntroEnabled !== false;
        const nextVal = result.nextEpisodeEnabled !== false;
        
        introToggle.checked = introVal;
        nextToggle.checked = nextVal;
        updateStatus();
    });

    // Handle toggle changes
    introToggle.addEventListener('change', () => {
        chrome.storage.local.set({ skipIntroEnabled: introToggle.checked }, updateStatus);
    });

    nextToggle.addEventListener('change', () => {
        chrome.storage.local.set({ nextEpisodeEnabled: nextToggle.checked }, updateStatus);
    });

    function updateStatus() {
        const anyOn = introToggle.checked || nextToggle.checked;
        statusText.textContent = anyOn ? '目前狀態：功能運作中' : '目前狀態：已完全關閉';
        statusText.style.color = anyOn ? '#E50914' : '#B3B3B3';
    }
});
