let speed = 1;

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

    const speedDown = document.querySelector(".speed-down");
    const speedUp = document.querySelector(".speed-up");
    const speedVal = document.querySelector(".speed-value");

    speedUp.addEventListener("click", function () {
        if (speed <= 5){
            chrome.runtime.sendMessage({
                message: 'speed_up_video',
                value: speed
            });
            speed+=0.1;
        }
        speedVal.textContent = `Speed: ${speed.toFixed(1)}x`;
    });

    speedDown.addEventListener("click", function () {
        if (speed >= 0){
            chrome.runtime.sendMessage({
                message: 'speed_down_video',
                value: speed
            });
            speed-=0.1;
        }
        speedVal.textContent = `Speed: ${speed.toFixed(1)}x`;
    });
});