const songcards = document.getElementById('songcards');
fetch('../songs.json')
    .then((response) => response.json())
    .then((data) => {
        const { songs } = data; // Access the array of songs

        songs.forEach((song) => {
            const card = document.createElement('div');
            card.classList = 'text-center';
            console.log(song);
            card.innerHTML = `
        <div class="">
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
          </a>
        </div>
      `;
            songcards.appendChild(card);
        });
    });
