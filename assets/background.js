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
