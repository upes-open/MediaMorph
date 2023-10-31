let speed = 1;

// Initialize the popup window and send the volume value to the background script
document.addEventListener("DOMContentLoaded", async function () {
    const speedDown = document.querySelector(".speed-down");
    const speedUp = document.querySelector(".speed-up");
    const speedVal = document.querySelector(".speed-value");
    const volumeDisplay = document.querySelector(".current-val");
    const volumeSlider = document.querySelector(".slider");
    const pipButton = document.querySelector(".pip-button");
    const settingsButton = document.querySelector(".settings-button");
    const saveVideoButton = document.querySelector(".save-video-button"); // Add a button for saving the video

    // Update the settings values
    updateSettingValues(volumeDisplay, volumeSlider, speedVal);

    // Send the volume value to the background script
    volumeSlider.addEventListener("input", function () {
        const volumeValue = parseInt(this.value);
        const multiplier = volumeValue / 100;

        volumeDisplay.textContent = volumeValue;
        chrome.runtime.sendMessage({
            message: 'change_vol',
            value: multiplier
        });
    });

    // Speed up functionality
    speedUp.addEventListener("click", function () {
        if (speed <= 5) {
            chrome.runtime.sendMessage({
                message: 'speed_up_video',
                value: speed
            });
            speed += 0.1;
            speedVal.textContent = `Speed: ${speed.toFixed(1)}x`;
        }
    });

    // Speed down functionality
    speedDown.addEventListener("click", function () {
        if (speed >= 0.1) {
            chrome.runtime.sendMessage({
                message: 'speed_down_video',
                value: speed
            });
            speed -= 0.1;
            speedVal.textContent = `Speed: ${speed.toFixed(1)}x`;
        }
    });

    // PIP functionality
    pipButton.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, {
                    message: 'pip',
                })
                    .then(() => console.log('Sent to content.js'))
                    .catch(error => console.error('Error sending message to content.js:', error));
            } else {
                console.error('No active tab found.');
            }
        });
    });

    // Open the settings page when the settings button is clicked
    settingsButton.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    // Save Video functionality
    saveVideoButton.addEventListener("click", function () {
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: function () {
                const videoElement = document.querySelector("video");
                if (videoElement) {
                    const videoInfo = {
                        url: window.location.href, // Assuming you are on a YouTube page
                        time: videoElement.currentTime
                    };
                    return videoInfo;
                }
                return null;
            }
        }, (result) => {
            if (result && result[0]) {
                const videoInfo = result[0];
                chrome.storage.local.set({ 'savedVideo': videoInfo }, function () {
                    console.log('Video saved:', videoInfo);
                });
            } else {
                console.error('No video found on the current page.');
            }
        });
    });
});

function updateSettingValues(volumeDisplay, volumeSlider, speedVal) {
    chrome.storage.local.get(['volLevel'], function (result) {
        const volume = result.volLevel;
        if (volume >= 0 && volume <= 2) {
            volumeDisplay.textContent = Math.round(volume * 100);
            volumeSlider.value = volume * 100;
        }
    });

    chrome.storage.local.get(['playbackSpeed'], function (result) {
        const speedSetting = result.playbackSpeed;
        if (speedSetting && speedSetting >= 0.1 && speedSetting <= 5) {
            speed = speedSetting;
            speedVal.textContent = `Speed: ${speedSetting.toFixed(1)}x`;
        }
    });
}
