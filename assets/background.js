// recieves message from popup.js
chrome.runtime.onMessage.addListener((request) => {

    if (request.message === 'pass_to_background' && typeof request.value === 'number') {
        const multiplier = request.value;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, {
                    message: 'pass_to_content',
                    value: multiplier
                })
                    .then(console.log('Sent to content.js:'))
                    .catch(error => console.error('Error sending message to content.js:', error));
            } else {
                console.error('No active tab found.');
            }
        });
    }

    if (request.message === 'speed_up_video' && typeof request.value === 'number') {
        const speed = request.value;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, {
                    message: 'speed_up_video',
                    value: speed
                })
                    .then(console.log('Sent to content.js:'))
                    .catch(error => console.error('Error sending message to content.js:', error));
            } else {
                console.error('No active tab found.');
            }
        });
    }

    if (request.message === 'speed_down_video' && typeof request.value === 'number') {
        const speed = request.value;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, {
                    message: 'speed_down_video',
                    value: speed
                })
                    .then(console.log('Sent to content.js:'))
                    .catch(error => console.error('Error sending message to content.js:', error));
            } else {
                console.error('No active tab found.');
            }
        });
    }
});

// listens for the skip message from the popup script
chrome.commands.onCommand.addListener(function (command) {
    const tabQueryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(tabQueryOptions, function (tabs) {
        const tab = tabs[0];
        if (!tab) return;
        if (command === "skip_forward") {
            skipVideoBySeconds(tab.id, 5);
        } else if (command === "skip_backward") {
            skipVideoBySeconds(tab.id, -5);
        }
    });
});

// skips the video by the specified number of seconds
function skipVideoBySeconds(tabId, seconds) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function (seconds) {
            const videoElement = document.querySelector("video");
            if (videoElement) {
                videoElement.currentTime += seconds;
            }
        },
        args: [seconds],
    });
}