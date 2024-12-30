const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");

const listOfActions = [
    {
        name: "play",
        action: () => {
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            saveButtonState("play");
        },
    },
    {
        name: "pause",
        action: () => {
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
            saveButtonState("pause");
        },
    },
];

function init() {
     chrome.storage.local.get("buttonState", (result) => {
        const state = result.buttonState || "pause";
        handleButtonState(state);
    });

    playBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "play" });
        handleButtonState("play");
    });

    pauseBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "pause" });
        handleButtonState("pause");
    });
}

function handleButtonState(action) {
    for (const item of listOfActions) {
        if (item.name === action) {
            item.action();
            break;
        }
    }
}

function saveButtonState(state) {
    chrome.storage.local.set({ buttonState: state });
}

init();
