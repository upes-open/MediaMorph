// stores the volume control function for the video found in the current tab
let volumeControlFn

// listens for the message from the background script
chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "pass_to_content" && typeof request.value === 'number') {
            volumeControlFn = volumeControlFn || createVolumeControlFunction()
            volumeControlFn(request.value)
        }
        if (request.message === "speed_up_video" && typeof request.value === 'number') {
            toggleSpeed(1, request.value);
        }
        if (request.message === "speed_down_video" && typeof request.value === 'number') {
            toggleSpeed(-1, request.value);
        }
    }
);

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

function toggleSpeed(c, speed) {
    const videoElement = document.querySelector("video");
    if (videoElement !== null) {
        if (c === 1) speed += 0.1;
        else speed -= 0.1

        videoElement.playbackRate = speed;
    }
}