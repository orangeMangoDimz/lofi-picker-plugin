chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const iframe = document.getElementById("youtube-player");

    const { action, data } = message;
    const { videoId } = data;
    if (!isTheSameVideo(iframe, videoId)) {
        const url = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        iframe.src = url;
        iframe.onload = () => {
            initPlayer(iframe, data);
            if (action === "pause" || action === "play") {
                changeMusic(iframe, action);
            }
        };
    } else {
        changeMusic(iframe, action);
    }
});

function isTheSameVideo(iframe, videoId) {
    const currentVideoId = iframe.src.split("/").pop().split("?")[0];
    return currentVideoId === videoId;
}

function changeMusic(iframe, action) {
    iframe.contentWindow.postMessage(
        JSON.stringify({
            event: "command",
            func: action + "Video",
            args: [],
        }),
        "*",
    );
}
function initPlayer(iframe, musicState) {
    window.addEventListener("message", function(event) {
        try {
            const data = JSON.parse(event.data);
            if (data.event === "infoDelivery" && data.info.playerState === 0) {
                chrome.runtime.sendMessage({
                    action: "next",
                    data: musicState,
                });
            }
        } catch (e) {
            console.log("error parsing message", e);
        }
    });
    
    // litsen to the youtube iframe player to get callback
    iframe.contentWindow.postMessage(
        JSON.stringify({
            event: "listening",
        }),
        "*",
    );
}
