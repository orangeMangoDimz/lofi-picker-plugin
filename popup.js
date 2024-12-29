const playBtn = document.getElementById("play")
const pauseBtn = document.getElementById("pause")

function init() {
    playBtn.disabled = false;
    pauseBtn.disabled = true;

    chrome.runtime.sendMessage({ action: 'createPlayer' });

    playBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: 'play' });
        playBtn.disabled = true;
        pauseBtn.disabled = false;
    });

    pauseBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: 'pause' });
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    });
}

init();
