// initializes the popup window and sends the volume value to the background script
document.addEventListener("DOMContentLoaded", function () {
    const volumeSlider = document.querySelector(".slider");
    const volumeDisplay = document.querySelector(".current-val");
    
    //listens for the slider to be moved and sends the value to the background script
    volumeSlider.addEventListener("input", function () {
        const volumeValue = parseInt(this.value);
        const multiplier = volumeValue / 100;

        volumeDisplay.textContent = volumeValue;
        chrome.runtime.sendMessage({
            message: 'pass_to_background',
            value: multiplier
        });
    });
});