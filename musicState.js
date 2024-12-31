export function createMusicState() {
    let currMusicState = {
        positionIndex: 0,
        title: "Default Title",
        videoId: "",
        videoOwnerChannelTitle: "Default Channel",
        videoOwnerChannelId: "",
    };

    function constructMusicState(newMusicState, newIndex) {
        const musicState = {
            positionIndex: newIndex,
            ...newMusicState,
        };
        return musicState;
    }

    function handlePrevMusicState(videoList) {
        const currMusicIndex = currMusicState.positionIndex;
        let prevVideoList = {},
            prevMusicState = {},
            newIndex = 0;
        const isNotFirstIndexMusic = currMusicIndex > 0;

        newIndex = isNotFirstIndexMusic
            ? currMusicIndex - 1
            : videoList.length - 1;

        prevVideoList = videoList[newIndex];
        prevMusicState = constructMusicState(prevVideoList, newIndex);
        return prevMusicState;
    }

    function handleNextMusicState(videoList) {
        const currMusicIndex = currMusicState.positionIndex;
        let nextVideoList = {},
            nextMusicState = {},
            newIndex = 0;
        const isNotLastIndexMusic = currMusicIndex < videoList.length - 1;

        newIndex = isNotLastIndexMusic ? currMusicIndex + 1 : 0;

        nextVideoList = videoList[newIndex];
        nextMusicState = constructMusicState(nextVideoList, newIndex);
        return nextMusicState;
    }

    return {
        getMusicState: () => {
            return currMusicState;
        },
        setMusicState: (newMusicState, newIndex) => {
            const musicState = constructMusicState(newMusicState, newIndex);
            currMusicState = musicState;
        },
        getPrevMusicState: (videoList) => {
            const prevMusicState = handlePrevMusicState(videoList);
            return prevMusicState;
        },
        getNextMusicState: (videoList) => {
            const nextMusicState = handleNextMusicState(videoList);
            return nextMusicState;
        },
    };
}
