async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    // make it play in the backgorund
    await chrome.offscreen.createDocument({
        url: "player.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Playing music in background",
    });
}

createOffscreen();
