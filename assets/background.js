
chrome.runtime.onMessage.addListener((request) => {
    console.log('Received message:', request);

    if (request.message === 'pass_to_background' && typeof request.value === 'number') {
        const multiplier = request.value;
        console.log('Sending message to content.js:', multiplier);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                console.log('Found active tab:', activeTab);
                chrome.tabs.sendMessage(activeTab.id, {
                    message: 'pass_to_content',
                    value: multiplier
                })
                    .then(response => console.log('Response from content.js:', response))
                    .catch(error => console.error('Error sending message to content.js:', error));
            } else {
                console.error('No active tab found.');
            }
        });
    }
});
