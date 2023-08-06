let speed = 1;

// initializes the popup window and sends the volume value to the background script
document.addEventListener("DOMContentLoaded", async function () {

    const speedDown = document.querySelector(".speed-down");
    const speedUp = document.querySelector(".speed-up");
    const speedVal = document.querySelector(".speed-value");
    const volumeDisplay = document.querySelector(".current-val");
    const volumeSlider = document.querySelector(".slider");
    const pipButton = document.querySelector(".pip-button");
    const settingsButton = document.querySelector(".settings-button");

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
        }
        speedVal.textContent = `Speed: ${speed.toFixed(1)}x`;
    });

    // Speed down functionality
    speedDown.addEventListener("click", function () {
        if (speed >= 0) {
            chrome.runtime.sendMessage({
                message: 'speed_down_video',
                value: speed
            });
            speed -= 0.1;
        }
        speedVal.textContent = `Speed: ${speed.toFixed(1)}x`;
    });

    //pip functionality
    pipButton.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, {
                    message: 'pip',
                })
                    .then(console.log('Sent to content.js:'))
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
        const speed = result.playbackSpeed;
        if (speed && speed > 0 && speed <= 5) {
            speedVal.textContent = `Speed: ${speed}x`;
        }
    });
}