const songcards = document.getElementById('songcards');
fetch('../songs.json')
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        // Iterate through each array
        for (const genre in data) {
            if (data.hasOwnProperty(genre)) {
                const songs = data[genre];

                // Iterate through each song within the genre
                songs.forEach((song) => {
                    const card = document.createElement('div');
                    card.classList.add('card');
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
                                <p class="font-normal text-gray-700 dark:text-gray-400">
                                    Genre: ${genre}
                                </p>
                            </a>
                        </div>
                    `;
                    songcards.appendChild(card);
                });
            }
        }
    });
