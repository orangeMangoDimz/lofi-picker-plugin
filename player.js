chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const iframe = document.getElementById("youtube-player");

    if (message.action === "play" || message.action === "pause") {
        iframe.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: message.action + "Video",
                args: [],
            }),
            "*",
        );
    }
});
