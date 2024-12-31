import { videoList } from "./videoList.js";
import { createMusicState } from "./musicState.js";
import { createDocument } from "./domElement.js";

const listOfActions = [
    {
        name: "play",
        action: (domElement, musicState) => {
            const playBtn = domElement.getPlayBtn();
            const pauseBtn = domElement.getPauseBtn();
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            playBtn.style.display = "none";
            pauseBtn.style.display = "block";
            const state = {
                buttonState: "play",
                musicState: musicState,
            };
            saveButtonState(state);
        },
    },
    {
        name: "pause",
        action: (domElement, musicState) => {
            const playBtn = domElement.getPlayBtn();
            const pauseBtn = domElement.getPauseBtn();
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            playBtn.style.display = "block";
            pauseBtn.style.display = "none";
            const state = {
                buttonState: "pause",
                musicState: musicState,
            };
            saveButtonState(state);
        },
    },
    {
        name: "prev",
        action: (domElement, musicState) => {
            const songTitle = domElement.getSongTitle();
            const songArtist = domElement.getSongArtist();
            songTitle.textContent = musicState.title;
            songArtist.textContent = musicState.videoOwnerChannelTitle;
            const state = {
                buttonState: "play",
                domElement: domElement,
                musicState: musicState,
            };
            handleButtonState(state);
        },
    },
    {
        name: "next",
        action: (domElement, musicState) => {
            const songTitle = domElement.getSongTitle();
            const songArtist = domElement.getSongArtist();
            songTitle.textContent = musicState.title;
            songArtist.textContent = musicState.videoOwnerChannelTitle;
            const state = {
                buttonState: "play",
                domElement: domElement,
                musicState: musicState,
            };
            handleButtonState(state);
        },
    },
];

function handleMusicLayout(domElement, musicState) {
    const { title, videoOwnerChannelTitle } = musicState;
    domElement.getSongTitle().textContent = title;
    domElement.getSongArtist().textContent = videoOwnerChannelTitle;
}

function handleButtonState(action) {
    const { buttonState, domElement, musicState } = action;
    for (const item of listOfActions) {
        if (item.name === buttonState) {
            item.action(domElement, musicState);
            break;
        }
    }
}

function init() {
    const currMusicState = createMusicState();
    const domElement = createDocument();

    chrome.storage.local.get(["buttonState", "musicState"], (result) => {
        const { buttonState, musicState } = result;
        const availableState = buttonState || "pause";

        const randomIndexMusic = Math.floor(Math.random() * videoList.length);
        const availableMusicState = musicState || videoList[randomIndexMusic];

        currMusicState.setMusicState(availableMusicState, randomIndexMusic);
        handleMusicLayout(domElement, availableMusicState);
        const sendState = {
            domElement: domElement,
            buttonState: availableState,
            musicState: availableMusicState,
        };
        handleButtonState(sendState);
    });

    domElement.getPrevBtn().addEventListener("click", () => {
        const prevMusicState = currMusicState.getPrevMusicState(videoList);
        currMusicState.setMusicState(
            prevMusicState,
            prevMusicState.positionIndex,
        );
        chrome.runtime.sendMessage({
            action: "play",
            data: currMusicState.getMusicState(),
        });
        const sendState = {
            domElement: domElement,
            buttonState: "prev",
            musicState: currMusicState.getMusicState(),
        };
        handleButtonState(sendState);
    });

    domElement.getPlayBtn().addEventListener("click", () => {
        chrome.runtime.sendMessage({
            action: "play",
            data: currMusicState.getMusicState(),
        });
        const sendState = {
            domElement: domElement,
            buttonState: "play",
            musicState: currMusicState.getMusicState(),
        };
        handleButtonState(sendState);
    });

    domElement.getPauseBtn().addEventListener("click", () => {
        chrome.runtime.sendMessage({
            action: "pause",
            data: currMusicState.getMusicState(),
        });
        const sendState = {
            domElement: domElement,
            buttonState: "pause",
            musicState: currMusicState.getMusicState(),
        };
        handleButtonState(sendState);
    });

    domElement.getNextBtn().addEventListener("click", () => {
        const nextMusicState = currMusicState.getNextMusicState(videoList);
        currMusicState.setMusicState(
            nextMusicState,
            nextMusicState.positionIndex,
        );
        chrome.runtime.sendMessage({
            action: "play",
            data: currMusicState.getMusicState(),
        });
        const sendState = {
            domElement: domElement,
            buttonState: "next",
            musicState: currMusicState.getMusicState(),
        };
        handleButtonState(sendState);
    });
}

function saveButtonState(state) {
    const { buttonState, musicState } = state;
    chrome.storage.local.set({
        buttonState: buttonState,
        musicState: musicState,
    });
}

init();

const port = chrome.runtime.connect({ name: "popup" });

// comunicate between popup.js and background.js
port.onMessage.addListener((message) => {
    const currMusicState = createMusicState();
    const domElement = createDocument();
    const { action, data } = message;
    currMusicState.setMusicState(data, data.positionIndex);
    if (action === "next") {
        const sendState = {
            domElement: domElement,
            buttonState: "next",
            musicState: currMusicState.getMusicState(),
        };
        handleButtonState(sendState);
    }
});
