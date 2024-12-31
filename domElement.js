export function createDocument() {
    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    return {
        getPlayBtn: () => {
            return playBtn;
        },
        getPauseBtn: () => {
            return pauseBtn;
        },
        getSongTitle: () => {
            return songTitle;
        },
        getSongArtist: () => {
            return songArtist;
        },
        getPrevBtn: () => {
            return prevBtn;
        },
        getNextBtn: () => {
            return nextBtn;
        },
    };
}
