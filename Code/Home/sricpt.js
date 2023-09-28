const songcards = document.getElementById('songcards');
const songtitle = document.getElementById('songtitle');
const songimage = document.getElementById('songimage');
let currentAudio = null; // Track the currently playing audio
const svgicon = document.getElementById('svgicon');
const durationcurrent = document.getElementById('duration-currenttime');
const duration = document.getElementById('duration');

const playicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white">
<path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
</svg>
`;
const pauseicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white">
<path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
</svg>
`;

// Function to stop the audio if it's playing
function stopAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

fetch('../songs.json')
    .then((response) => response.json())
    .then((data) => {
        const { songs } = data;

        songs.forEach((song, index) => {
            const card = document.getElementById('songTemplate').cloneNode(true);
            card.querySelector('img').src = song.img_file;
            card.querySelector('h5').innerHTML = song.title;
            card.querySelector(
                'p',
            ).innerHTML = `Artist: ${song.artist}<br> Album: ${song.album}<br> Year: ${song.year}`;

            const button = card.querySelector('a');
            button.addEventListener('click', () => {
                stopAudio(); // Stop the audio if it's playing
                songtitle.textContent = songs[index].title;
                songimage.src = songs[index].img_file;
                console.log(index, songs[index]);
                const audio = new Audio(songs[index].audio_file);
                currentAudio = audio; // Set the current audio
                console.log(songs[index].audio_file);
                audio.play();
                svgicon.innerHTML = playicon;

                // Update the current playback duration every second
                setInterval(() => {
                    if (currentAudio) {
                        durationcurrent.innerHTML = new Date(
                            currentAudio.currentTime * 1000,
                        )
                            .toISOString()
                            .substr(14, 5);
                        // for every second, update the progress width
                        const progress = document.getElementById('progress');
                        progress.style.width = `${
                            (currentAudio.currentTime / currentAudio.duration) * 100
                        }%`;
                    }
                }, 1000);
                if (currentAudio) {
                    duration.innerHTML = songs[index].duration;
                }
            });
            card.classList.remove('hidden');
            songcards.appendChild(card);

            document.getElementById('shufflebtn').addEventListener('click', () => {
                // change color on click
                const svg = document.getElementById('shufflesvg');
                const path = svg.querySelector('path');
                if (path.getAttribute('stroke') === 'currentColor') {
                    path.setAttribute('stroke', 'rgb(59 130 246)');
                    // When a song has finished playing, play a random song
                    currentAudio.addEventListener('ended', () => {
                        const randomSong = songs[index].audio_file[Math.floor(Math.random() * songs.length)];
                        const audio = new Audio(randomSong.audio_file);
                        currentAudio = audio;
                        audio.play();
                        svgicon.innerHTML = playicon;
                    });
                } else {
                    path.setAttribute('stroke', 'currentColor');
                    // unshuffle the songs
                    songs.sort((a, b) => a.id - b.id);
                }
            });

            document.getElementById('repeatbtn').addEventListener('click', () => {
                // change color on click
                const svg = document.getElementById('repeatsvg');
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
        });

        function toggleAudio() {
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                svgicon.innerHTML = pauseicon;
            } else {
                currentAudio.play();
                svgicon.innerHTML = playicon;
            }
        }

        const pausebtn = document.getElementById('pausebtn');
        pausebtn.addEventListener('click', () => {
            toggleAudio();
        });

        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 32 || e.key === ' ') {
                e.preventDefault();
                toggleAudio();
            }
        });

        const volume = document.getElementById('Audiovolume');
        volume.addEventListener('input', (e) => {
            currentAudio.volume = e.currentTarget.value / 100;
        });
    });
