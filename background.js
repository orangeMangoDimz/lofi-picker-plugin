import { videoList } from "./videoList.js";
import { createMusicState } from "./musicState.js";

let lastMessage = {
    action: "",
    data: {},
};

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
        const currMusicState = createMusicState();
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
        };
    }
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        port.postMessage(lastMessage);
    }
});

chrome.commands.onCommand.addListener(async (receivedCommand) => {
    const COMMANDS = [
        {
            name: "toogle-muisc",
            action: () => handleToogleMusic(),
        },
    ];

    for (let command of COMMANDS) {
        if (command.name === receivedCommand) {
            try {
                await command.action();
            } catch (error) {
                console.error(error);
            } finally {
                break;
            }
        }
    }
});

async function handleToogleMusic() {
    try {
        let { action, data } = lastMessage;

        const result = await new Promise((resolve) => {
            chrome.storage.local.get(["buttonState", "musicState"], resolve);
        });

        let { buttonState, musicState } = result;
        const hasExistingState =
            buttonState && Object.keys(musicState || {}).length > 0;

        if (hasExistingState) {
            action = buttonState === "play" ? "pause" : "play";
            data = musicState;
        } else {
            action = "play";
            data = createMusicState().getRandomMusicState(videoList);
        }

        chrome.runtime.sendMessage({
            action: action,
            data: data,
        });

        await chrome.storage.local.set({
            buttonState: action,
            musicState: data,
        });
    } catch (error) {
        throw new Error("Error toggling music", error);
    }
}
