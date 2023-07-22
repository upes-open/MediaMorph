// stores the volume control function for the video found in the current tab
let volumeControlFn

// listens for the message from the background script
chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "pass_to_content" && typeof request.value === 'number') {
            volumeControlFn = volumeControlFn || createVolumeControlFunction()
            volumeControlFn(request.value)
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