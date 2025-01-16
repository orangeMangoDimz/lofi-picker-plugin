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
        {
           name: "next-music",
            action: () => handleNextMusic(),
        },
        {
            name: "prev-music",
            action: () => handlePrevMuisc(),
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

async function _handleInitMusic(command) {
    let { action, data } = lastMessage;

    const result = await new Promise((resolve) => {
        chrome.storage.local.get(["buttonState", "musicState"], resolve);
    });

    let { buttonState, musicState: oldMuiscState } = result;
    const hasExistingState =
        buttonState && Object.keys(oldMuiscState || {}).length > 0;

    const newMusicState = createMusicState()
    if (hasExistingState) {
        action = buttonState === "play" ? "pause" : "play";
        newMusicState.setMusicState(oldMuiscState, oldMuiscState.positionIndex);
    } else {
        action = "play";
        const randomMusicState  = newMusicState.getRandomMusicState(videoList);
        newMusicState.setMusicState(randomMusicState, randomMusicState.positionIndex);
    }

    if (command === "next") {
        action = "play";
        data = newMusicState.getNextMusicState(videoList);
    } else if (command === "prev") {
        action = "play";
        data = newMusicState.getPrevMusicState(videoList);
    } else {
        data = newMusicState.getMusicState();
    }

    return { action, data };
}

async function handleToogleMusic() {
    try {
        const  { action, data } =  await _handleInitMusic("toogle")
        console.info("toogle music", action, data);
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

async function handleNextMusic() {
    try {
        const { action, data } = await _handleInitMusic("next")
        console.info("next music", action, data);
        chrome.runtime.sendMessage({
            action: action,
            data: data,
        });

        await chrome.storage.local.set({
            buttonState: action,
            musicState: data,
        });
    } catch (error) {
        throw new Error("Error getting next music", error);
    }
}

async function handlePrevMuisc() {
    try {
        const { action, data } = await _handleInitMusic("prev")
        console.info("prev music", action, data);
        chrome.runtime.sendMessage({
            action: action,
            data: data,
        });

        await chrome.storage.local.set({
            buttonState: action,
            musicState: data,
        });
    } catch (error) {
        throw new Error("Error getting prev music", error);
    }
}
