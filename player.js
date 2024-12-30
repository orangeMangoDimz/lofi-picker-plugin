chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const iframe = document.getElementById("youtube-player");

    const { action, data } = message;
    const { videoId } = data;
    if (!isTheSameVideo(iframe, videoId)) {
        const url = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        iframe.src = url;
        iframe.onload = () => {
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
