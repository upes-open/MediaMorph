// recieves message from popup.js
chrome.runtime.onMessage.addListener((request) => {
    // change volume
    if (request.message === 'change_vol') {
        const multiplier = request.value;
        sendMessageToContentScript({message: 'update_vol', value: multiplier})
    }
    
    // change speed up
    if (request.message === 'speed_up_video' && typeof request.value === 'number') {
        const speed = request.value;
        sendMessageToContentScript({message: 'speed_up_video', value: speed})
    }

    // change speed down
    if (request.message === 'speed_down_video' && typeof request.value === 'number') {
        const speed = request.value;
        sendMessageToContentScript({message: 'speed_down_video', value: speed})
    }

    //change speed
    if (request.message === 'change_speed') {
        const speed = request.value;
        sendMessageToContentScript({message: 'update_speed', value: speed})
    }
});

// listens for shortcut commands of skipping shorts forward and backward
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

function sendMessageToContentScript(message, value) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, message, value)
                .then(console.log('Message sent to content.js:', message))
                .catch((error) => console.error('Error sending message to content.js:', error));
        } else {
            console.error('No active tab found.');
        }
    });
}

// func that skips the shorts by the specified number of seconds
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