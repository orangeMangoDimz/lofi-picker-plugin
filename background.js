async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    // make it play in the backgorund
    await chrome.offscreen.createDocument({
        url: "player.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Playing music in background",
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (message) => {
    await createOffscreen();
    if (message.action === "play" || message.action === "pause") {
        chrome.runtime.sendMessage(message);
    }
});
