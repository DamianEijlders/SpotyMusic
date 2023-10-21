const songcards = document.getElementById('songcards');
const songtitle = document.getElementById('songtitle');
const songimage = document.getElementById('songimage');
const volume = document.getElementById('Audiovolume');
const VolBtn = document.getElementById('VolBtn');
const svgicon = document.getElementById('pausesvgicon');
const durationcurrent = document.getElementById('duration-currenttime');
const duration = document.getElementById('duration');
const Volmuteicon = document.getElementById('volmuteicon');
const nextbtn = document.getElementById('nextbtn');
const prevbtn = document.getElementById('prevbtn');
const expandbtn = document.getElementById('expandbtn');
const sidebar = document.getElementById('cta-button-sidebar');
let currentAudio = null;
let songduration;
let lastRandomSong = null;
let isMuted = false;
let isloopfalse = false;
let Lastvolume = 50;

// Getting data out of the local storage
let songdata = {};
songdata = JSON.parse(localStorage.getItem('songs'));

const playicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white">
<path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
</svg>
`;
const pauseicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white">
<path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
</svg>
`;

const muteicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5" style="color: rgb(209 213 219)">
<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
</svg>
`;

const volicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5" style="color: rgb(209 213 219)">
<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
<path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
</svg>
`

function StopAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function DurationUpdate() {
    setInterval(() => {
        if (currentAudio) {
            durationcurrent.innerHTML = new Date(
                currentAudio.currentTime * 1000,
            )
                .toISOString()
                .substr(14, 5);
            // for every second, update the progress width
            const progress = document.getElementById('progress');
            progress.style.width = `${(currentAudio.currentTime / currentAudio.duration) * 100
                }%`;
        }
    }, 1000);
}

function Repeat() {
    document.getElementById('repeatbtn').addEventListener('click', () => {
        const svg = document.getElementById('repeatsvg');
        const path = svg.querySelector('path');
        if (isloopfalse) {
            path.setAttribute('stroke', 'currentColor');
            console.log('Loop is now OFF');
            if (currentAudio) {
                currentAudio.loop = false;
            }
        } else {
            path.setAttribute('stroke', 'rgb(59 130 246)');
            console.log('Loop is now ON');
            if (currentAudio) {
                currentAudio.loop = true;
                currentAudio.play();
            }
        }
        isloopfalse = !isloopfalse;
    });
}

function toggleAudio() {
    if (currentAudio && !currentAudio.paused) {
        svgicon.innerHTML = pauseicon;
        if (currentAudio) {
            currentAudio.pause();
        }
    } else {
        svgicon.innerHTML = playicon;
        if (currentAudio) {
            currentAudio.play();
        }
    }
}

function PausePlay() {
    const pausebtn = document.getElementById('pausebtn');
    pausebtn.addEventListener('click', () => {
        toggleAudio();
    });
}

function TimeBack() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 37 || e.key === ' ') {
            e.preventDefault();
            currentAudio.currentTime -= 5;
        }
    });
}

function TimeForward() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 39 || e.key === ' ') {
            e.preventDefault();
            currentAudio.currentTime += 5;
        }
    });
}

function PausePlayKey() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 32 || e.key === ' ') {
            e.preventDefault();
            toggleAudio();
        }
    });
}

function Volvalue() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 38 || e.key === ' ') {
            e.preventDefault();
            volume.value = Number(volume.value) + 5;
            Lastvolume = volume.value;
            Volmuteicon.innerHTML = volicon;
            if (currentAudio) {
                currentAudio.volume = volume.value / 100;
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 40 || e.key === ' ') {
            e.preventDefault();
            volume.value = Number(volume.value) - 5;
            Lastvolume = volume.value;
            Volmuteicon.innerHTML = volicon;
            if (currentAudio) {
                currentAudio.volume = volume.value / 100;
            }
        }
    });
}

function Volmute() {
    if (isMuted) {
        volume.value = Lastvolume;
        Volmuteicon.innerHTML = volicon;
        if (currentAudio) {
            currentAudio.volume = Lastvolume / 100;
        }
    } else {
        volume.value = 0;
        Volmuteicon.innerHTML = muteicon;
        if (currentAudio) {
            currentAudio.volume = 0;
        }
    }
    isMuted = !isMuted;
}

function VolumeMuteKey() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 77 || e.key === 'm') {
            e.preventDefault();
            Volmute();
        }
    });
}

function Audioslider() {
    volume.addEventListener('input', (e) => {
        if (currentAudio) {
            currentAudio.volume = e.currentTarget.value / 100;
            if (currentAudio.volume === 0) {
                Volmuteicon.innerHTML = muteicon;
            } else {
                Volmuteicon.innerHTML = volicon;
            }
        }
    });

    VolBtn.addEventListener('click', () => {
        Volmute();
    });
}

function skipSong() {
    const songs = songdata;
    const currentSong = songs.findIndex((song) => song.title === songtitle.textContent);
    const nextSong = songs[(currentSong + 1) % songs.length];
    StopAudio();
    songtitle.textContent = nextSong.title;
    songimage.src = nextSong.img_file;
    const audio = new Audio(nextSong.audio_file);
    currentAudio = audio;
    currentAudio.play();
    if (volume.value === 0) {
        currentAudio.volume = 0;
    } else {
        currentAudio.volume = volume.value / 100;
    }
    songduration = nextSong.duration;
    svgicon.innerHTML = playicon;
    duration.innerHTML = songduration;
    DurationUpdate();
}

nextbtn.addEventListener('click', () => {
    skipSong();
});

function prevSong() {
    const songs = songdata;
    const currentSong = songs.findIndex((song) => song.title === songtitle.textContent);
    const prevSong = songs[(currentSong - 1 + songs.length) % songs.length];
    StopAudio();
    songtitle.textContent = prevSong.title;
    songimage.src = prevSong.img_file;
    const audio = new Audio(prevSong.audio_file);
    currentAudio = audio;
    currentAudio.play();
    if (volume.value === 0) {
        currentAudio.volume = 0;
    } else {
        currentAudio.volume = volume.value / 100;
    }
    songduration = prevSong.duration;
    svgicon.innerHTML = playicon;
    duration.innerHTML = songduration;
    DurationUpdate();
}

prevbtn.addEventListener('click', () => {
    prevSong();
});

function skipsongKeys() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 78 || e.key === 'n') {
            e.preventDefault();
            skipSong();
        }

        if (e.keyCode === 80 || e.key === 'p') {
            e.preventDefault();
            prevSong();
        }
    });
}

function CreateCards() {
    const songs = songdata;
    songs.forEach((song, index) => {
        const card = document.getElementById('songTemplate').cloneNode(true);
        card.querySelector('img').src = song.img_file;
        card.querySelector('h5').innerHTML = song.title;
        card.querySelector(
            'p',
        ).innerHTML = `Artist: ${song.artist}<br> Album: ${song.album}<br> Year: ${song.year}`;

        const button = card.querySelector('a');
        button.addEventListener('click', () => {
            StopAudio();
            songtitle.textContent = songs[index].title;
            songimage.src = songs[index].img_file;
            const audio = new Audio(songs[index].audio_file);
            currentAudio = audio;
            currentAudio.play();
            if (volume.value === 0) {
                currentAudio.volume = 0;
            } else {
                currentAudio.volume = volume.value / 100;
            }
            songduration = songs[index].duration;
            svgicon.innerHTML = playicon;
            duration.innerHTML = songduration;
            DurationUpdate();

            console.log(index, songs[index]);
        });
        card.classList.remove('hidden');
        songcards.appendChild(card);
    });
}

function Shuffle() {
    const songs = songdata;
    const path = document.getElementById('shufflepath');
    let isShuffleActive = false;

    function handleEnded() {
        console.log('Song ended!');

        do {
            randomSong = songs[Math.floor(Math.random() * songs.length)];
        } while (randomSong === lastRandomSong);

        lastRandomSong = randomSong;

        StopAudio();
        songtitle.textContent = randomSong.title;
        songimage.src = randomSong.img_file;

        console.log(randomSong);

        const audio = new Audio(randomSong.audio_file);
        currentAudio = audio;
        currentAudio.play();
        songduration = randomSong.duration;
        duration.innerHTML = songduration;
        svgicon.innerHTML = playicon;
        DurationUpdate();
        currentAudio.addEventListener('ended', handleEnded);
    }


    document.getElementById('shufflebtn').addEventListener('click', () => {
        if (isShuffleActive) {
            path.setAttribute('stroke', 'currentColor');
            console.log('Shuffle is now OFF');

            if (currentAudio) {
                currentAudio.removeEventListener('ended', handleEnded);
            }
        } else {
            path.setAttribute('stroke', 'rgb(59 130 246)');
            console.log('Shuffle is now ON');

            if (currentAudio) {
                currentAudio.addEventListener('ended', handleEnded);
            }
        }

        isShuffleActive = !isShuffleActive;
    });

}

function checkTime() {
    const TimeAdded = localStorage.getItem('TimeAdded');
    const TimeNow = new Date().getMinutes() + ':' + new Date().getSeconds();
    if (TimeNow - TimeAdded > 1) {
        fetchdatda();
    }
}

function fetchdatda() {
    fetch('../songs.json')
        .then((response) => response.json())
        .then((data) => {
            const { songs } = data;
            localStorage.setItem('songs', JSON.stringify(songs));
            const TimeAdded = new Date().getMinutes() + ':' + new Date().getSeconds();
            localStorage.setItem('TimeAdded', TimeAdded);
        });
}

function GoFullscreen() {
    expandbtn.addEventListener('click', () => {
        // check if songcards contains class hidden
        if (songcards.classList.contains('hidden')) {
            songcards.classList.remove('hidden');
            sidebar.classList.remove('hidden');
        }
        else {
            songcards.classList.add('hidden');
            sidebar.classList.add('hidden');
        }
    });
}

checkTime();
CreateCards();
Repeat();
Shuffle();
PausePlay();
PausePlayKey();
TimeBack();
TimeForward();
Audioslider();
VolumeMuteKey();
Volvalue();
skipsongKeys();
GoFullscreen();

// if you click on view playlist you will see the songs in the index order that will be played next