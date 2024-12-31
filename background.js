import { videoList } from "./videoList.js";
import { createMusicState } from "./musicState.js";

let lastMessage = {
    action: "",
    data: {}
};

console.log("videoList: ", videoList)

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

chrome.runtime.onMessage.addListener((message) => {
    const { action, data } = message;
    console.log(action, data);
    if (action === "next") {
        // update music for player
        const currMusicState = createMusicState()
        currMusicState.setMusicState(data, data.positionIndex);

        const nextMusicState = currMusicState.getNextMusicState(videoList);
        currMusicState.setMusicState(
            nextMusicState,
            nextMusicState.positionIndex,
        );
        chrome.runtime.sendMessage({
            action: "play",
            data: currMusicState.getMusicState(),
        });

        // set last music info for popup.js
        lastMessage = {
            action: "next",
            data: currMusicState.getMusicState(),
        }
    }
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        port.postMessage(lastMessage)
    }
});
