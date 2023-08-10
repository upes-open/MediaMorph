document.addEventListener("DOMContentLoaded", function () {
    const settingsForm = document.getElementById("settingsForm");
    const defaultPlaybackSpeedInput = document.getElementById("defaultPlaybackSpeed");
    const defaultVolumeLevelInput = document.getElementById("defaultVolumeLevel");

    // Save settings when the form is submitted
    settingsForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const defaultPlaybackSpeed = defaultPlaybackSpeedInput.value;
        const defaultVolumeLevel = defaultVolumeLevelInput.value;
        console.log(`defaultPlaybackSpeed: ${defaultPlaybackSpeed}, defaultVolumeLevel: ${defaultVolumeLevel / 100}`)
        // Send message to background script with updated settings
        chrome.storage.local.set({
            volLevel: defaultVolumeLevel / 100,
            playbackSpeed: defaultPlaybackSpeed,
        }).then(() => {
            console.log('Settings saved')
        });
    });
});
