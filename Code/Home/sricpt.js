const songcards = document.getElementById('songcards');
const songtitle = document.getElementById('songtitle');
const songimage = document.getElementById('songimage');
let currentAudio = null; // Track the currently playing audio

// Function to stop the audio if it's playing
function stopAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset to the beginning
    }
}

fetch('../songs.json')
    .then((response) => response.json())
    .then((data) => {
        const { songs } = data;

        songs.forEach((song, index) => {
            const card = document.createElement('div');
            card.classList = 'text-center';
            card.innerHTML = `
        <button class="">
          <a
            href="#"
            class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              ${song.title}
            </h5>
            <img src="${song.img_file}" alt="Song Image" class="object-cover w-full h-48 mb-6 rounded-lg" />
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Artist: ${song.artist} | Album: ${song.album} | Year: ${song.year}
            </p>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Index: ${index}
            </p>
          </a>
        </button>
      `;
            const button = card.querySelector('button');
            button.addEventListener('click', () => {
                stopAudio(); // Stop the audio if it's playing
                songtitle.textContent = songs[index].title;
                songimage.src = songs[index].img_file;
                console.log(index, songs[index]);
                // play a mp3 file with the same index
                const audio = new Audio(songs[index].audio_file);
                currentAudio = audio; // Set the current audio
                console.log(songs[index].audio_file);
                audio.play();
            });

            songcards.appendChild(card);
        });
        const pausebtn = document.getElementById('pausebtn');
        pausebtn.addEventListener('click', () => {
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
            } else {
                currentAudio.play();
            }
        });
    });
