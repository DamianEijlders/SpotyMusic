const songcards = document.getElementById('songcards');
const progressBar = document.getElementById('progressBar');
const progressdata = document.getElementById('progressdata');

// Function to show the progress bar
function showProgressBar() {
    progressBar.style.display = 'block';
}

// Function to hide the progress bar
function hideProgressBar() {
    progressBar.style.display = 'none';
}

// Add a click event listener to each button
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
                showProgressBar();
                setTimeout(() => {
                    progressdata.innerHTML = `Song: ${songs[index].title}`;
                    console.log('Data for index', index, ':', songs[index]);

                    // hideProgressBar();
                }, 2000);
            });

            songcards.appendChild(card);
        });
    });
