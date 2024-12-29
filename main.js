const iframe = document.getElementById("youtube-player");
const playBtn = document.getElementById("play")
const pauseBtn = document.getElementById("pause")

function init() {
    playBtn.disabled = false;
    pauseBtn.disabled = true;

    playBtn.addEventListener("click", () => {
        postMessageToPlayer("play");
        playBtn.disabled = true;
        pauseBtn.disabled = false;
    });

    pauseBtn.addEventListener("click", () => {
        postMessageToPlayer("pause");
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    });
}

function postMessageToPlayer(action) {
    try {
        // Sending postMessage to play or pause the youtube video
        iframe.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: action + "Video",
                args: [],
            }),
            "*",
        );
    } catch (error) {
        console.error("Error sending message to player:", error);
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(() => postMessageToPlayer(action), 1000);
        }
    }
}

init();


//port.postMessage({
//    action: "play",
//    videoId: "6TpyRE_juyA", // Your video ID
//});
//
//port.postMessage({
//    action: "pause",
//});
