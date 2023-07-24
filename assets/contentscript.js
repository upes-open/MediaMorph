let autoScrollInterval;

function skipVideoBySeconds(seconds) {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.currentTime += seconds;
    }
}

function toggleAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    } else {
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, window.innerHeight);
        }, 3000); // Adjust the auto-scroll interval as needed (in milliseconds).
    }
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "skip_forward") {
        skipVideoBySeconds(5);
    } else if (request.message === "skip_backward") {
        skipVideoBySeconds(-5);
    } else if (request.message === "toggle_auto_scroll") {
        toggleAutoScroll();
    }
});

// Optional: Listen for hotkey events (Ctrl+Right, Ctrl+Left, Ctrl+Shift+S) and forward to the content script.
chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: function (command) {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: command }));
                },
                args: [command],
            });
        }
    });
});