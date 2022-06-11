const apiURl = 'https://api.lyrics.ovh';

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

//Search by song or artist
async function searchSongs(term) {
   const resData = await fetch(`${apiURl}/suggest/${term}`);
   const data = await resData.json();
   console.log(data);

   showData(data);
}

//Show song and artist in DOM
function showData (data) {
    let output = '';
    data.data.forEach(song => {
        output += `<li>
<span> <strong>${song.artist.name}</strong> - ${song.title}</span>
<button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
</li>`
    });

    result.innerHTML = `<ul class="songs">${output}</ul>`;

    if(data.prev || data.next) {
        more.innerHTML = `
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = '';
    }
}

// Get prev & next songs
async function getMoreSongs(url) {
    const resData = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await resData.json();
    console.log(data);

    showData(data);
}

//Get lyrics for song
async function getLyrics(artist, songTitle) {
    const resData = await fetch(`${apiURl}/v1/${artist}/${songTitle}`);
    const data = await resData.json();
    console.log(data);

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2> <span>${lyrics}</span>`;

    more.innerHTML = '';
}

//Event listeners
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const searchTerm = search.value.trim();
    console.log(searchTerm);

    if (!searchTerm) {
        alert('Please enter a search term');
    } else {
        searchSongs(searchTerm);
    }
});

// Get lyrics button click
result.addEventListener('click', evt => {
    console.log(evt.target);
    const clickedEl = evt.target;

    if (clickedEl.tagName === 'BUTTON') {
        console.log(123);

        const artist = clickedEl.getAttribute("data-artist");
        const songTitle = clickedEl.getAttribute("data-songtitle");

        getLyrics(artist, songTitle);
    }
})
