document.addEventListener("DOMContentLoaded", function () {
    const volumeSlider = document.querySelector(".slider");
    const volumeDisplay = document.querySelector(".current-val");

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