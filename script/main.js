// Initially disable both buttons until player is ready
document.getElementById("play").disabled = true;
document.getElementById("pause").disabled = true;

let player;

// This will be called when the YouTube API is ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "0",
        width: "0",
        videoId: "PNxaXFdVix8",
        playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

// Called when the player is ready
function onPlayerReady(event) {
    console.log("Player is ready!");
    document.getElementById("play").disabled = false;
    document.getElementById("pause").disabled = true;
}

// Called when the player's state changes
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        document.getElementById("play").disabled = true;
        document.getElementById("pause").disabled = false;
    } else if (event.data === YT.PlayerState.PAUSED) {
        document.getElementById("play").disabled = false;
        document.getElementById("pause").disabled = true;
    }
}

// Add event listeners to play and pause buttons
document.getElementById("play").addEventListener("click", () => {
    console.log("Play clicked");
    player.playVideo();
});

document.getElementById("pause").addEventListener("click", () => {
    console.log("Pause clicked");
    player.pauseVideo();
});
