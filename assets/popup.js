document.addEventListener("DOMContentLoaded", function () {
    
    const volumeSlider = document.querySelector(".slider");
    const volumeDisplay = document.querySelector(".current-val");

    function setVolume(volume) {
        const mappedVolume = volume / 200;
        volumeDisplay.textContent = volume.toFixed(0);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    function: setVideoVolume,
                    args: [mappedVolume],
                },
                function () {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    }
                }
            );
        });
    }

    function setVideoVolume(volume) {
        const video = document.querySelector("video");
        if (video) {
            video.volume = volume;
        }
    }

    volumeSlider.addEventListener("input", function () {
        const volumeValue = parseInt(this.value);
        setVolume(volumeValue);
    });
    
});