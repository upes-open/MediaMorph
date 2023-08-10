// stores the volume control function for the video found in the current tab
let volumeControlFn = createVolumeControlFunction()
loadSettings();

// listens for the message from the background script
chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "update_vol") {
            volumeControlFn(request.value)
        }

        if (request.message === "speed_up_video" && typeof request.value === 'number') {
            toggleSpeed(1, request.value);
        }

        if (request.message === "speed_down_video" && typeof request.value === 'number') {
            toggleSpeed(-1, request.value);
        }

        if (request.message === "pip") {
            enablePictureInPicture();
        }

        if (request.message === "update_speed") {
            const speed = request.value;
            changeSpeed(speed);
        }
    }
);

// loads the settings from the chrome storage
function loadSettings() {
    chrome.storage.local.get(['volLevel'], function (result) {
        const volume = result.volLevel;
        if (volume >= 0 && volume <= 2) {
            chrome.runtime.sendMessage({
                message: 'change_vol',
                value: volume
            });
        }
    });

    chrome.storage.local.get(['playbackSpeed'], function (result) {
        const speed = result.playbackSpeed;
        if (speed && speed > 0 && speed <= 5) {
            chrome.runtime.sendMessage({
                message: 'change_speed',
                value: speed
            });
        }
    });
}

// creates the volume control function using web audio api
function createVolumeControlFunction() {
    const videoElement = document.querySelector("video")
    if (!videoElement) {
        return undefined
    }
    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaElementSource(videoElement)
    const node = audioCtx.createGain()

    node.gain.value = 1
    source.connect(node)
    node.connect(audioCtx.destination)
    return (multiplier) => {
        node.gain.value = multiplier
    }
}

// controls the video speed
function toggleSpeed(c, speed) {
    const videoElement = document.querySelector("video");
    if (videoElement !== null) {
        if (c === 1) speed += 0.1;
        else speed -= 0.1

        videoElement.playbackRate = speed;
    }
}

// enables picture in picture
function enablePictureInPicture() {
    const videoElement = document.querySelector("video");
    if (videoElement !== null) {
        videoElement.requestPictureInPicture();
    }
}

function changeSpeed(speed) {
    const videoElement = document.querySelector("video");
    if (videoElement !== null) {
        videoElement.playbackRate = speed;
    }
}