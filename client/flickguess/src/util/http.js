const MOVIE_API_BASE_URL = 'http://www.omdbapi.com/?apikey=d621c3d&t=';
const MUSIC_API_BASE_URL = '';
const THEME_SONG_API_BASE_URL = '';

async function getJson(url) {
    const resource = await fetch(url);
    return await resource.json();
}

async function getMovie(title) {
    if (!title || !title.length) {
        return Promise.reject(null);
    }

    const url = MOVIE_API_BASE_URL + title.replace(' ', '%20');
    return await getJson(url);
}

export { getMovie };