const songcards = document.getElementById('songcards');
const songtitle = document.getElementById('songtitle');
const songimage = document.getElementById('songimage');
let currentAudio = null;
const svgicon = document.getElementById('svgicon');
const durationcurrent = document.getElementById('duration-currenttime');
const duration = document.getElementById('duration');
let songduration;

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

function stopAudio() {
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

function repeat() {
    document.getElementById('repeatbtn').addEventListener('click', () => {
        // change color on click
        const svg = document.getElementById('repeatsvg');
        console.log('repeat');
        const path = svg.querySelector('path');
        if (path.getAttribute('stroke') === 'currentColor') {
            path.setAttribute('stroke', 'rgb(59 130 246)');
            // make the current song repeat
            currentAudio.loop = true;
        } else {
            path.setAttribute('stroke', 'currentColor');
            // make the current song not repeat
            currentAudio.loop = false;
        }
    });
}

function toggleAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        svgicon.innerHTML = pauseicon;
    } else {
        currentAudio.play();
        svgicon.innerHTML = playicon;
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

function audioslider() {
    const volume = document.getElementById('Audiovolume');
    volume.addEventListener('input', (e) => {
        currentAudio.volume = e.currentTarget.value / 100;
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
            stopAudio();
            songtitle.textContent = songs[index].title;
            songimage.src = songs[index].img_file;

            console.log(index, songs[index]);

            const audio = new Audio(songs[index].audio_file);
            currentAudio = audio;
            currentAudio.play();
            songduration = songs[index].duration;
            svgicon.innerHTML = playicon;
            duration.innerHTML = songduration;
            DurationUpdate();
        });
        card.classList.remove('hidden');
        songcards.appendChild(card);
    });
}

function shuffle() {
    const songs = songdata;
    const path = document.getElementById('shufflepath');
    let isFalse = false;

    document.getElementById('shufflebtn').addEventListener('click', () => {
        if (isFalse) {
            path.setAttribute('stroke', 'currentColor');
            isFalse = false;
        } else {
            path.setAttribute('stroke', 'rgb(59 130 246)');
            isFalse = true;
            if (currentAudio) {
                currentAudio.addEventListener('ended', () => {
                    const randomSong = songs[Math.floor(Math.random() * songs.length)];
                    stopAudio();
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
                });
            }
        }
    });
}

fetch('../songs.json')
    .then((response) => response.json())
    .then((data) => {
        const { songs } = data;
        localStorage.setItem('songs', JSON.stringify(songs));
    });

CreateCards();
repeat();
shuffle();
PausePlay();
PausePlayKey();
TimeBack();
TimeForward();
audioslider();
