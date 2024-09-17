const rollMusic = document.querySelector('.roll__musicas');
const player = document.querySelector('#cont__player');
player.style.display = 'none'

async function getAccessToken() {
    const client_id = '3a217a12cc904774a6ffed1a410926c0';
    const client_secret = '71f6b4ddd8eb4fda8ac558daadc4af6a';

    const authString = btoa(`${client_id}:${client_secret}`);
    const url = 'https://accounts.spotify.com/api/token';
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });

    const result = await response.json();
    return result.access_token;
}

async function fetchSpotifyData(query) {
    const token = await getAccessToken();
  
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    const items = data.tracks.items;
    dataAPI(items);
}

function dataAPI (items) {
  let setMusic = randomIndex(items, 3);
  musics(setMusic);
}

//randomizar músicas
function randomIndex (items) {
  let index = [];
  for(i = 0; i < 3; i++){
    let num = Math.floor(Math.random() * items.length);
    index.push(items[num]);
  }
  return index
}

//criar músicas
function musics (items) {
  rollMusic.innerHTML = ``;
  items.forEach(item => {
    rollMusic.innerHTML += makeMusics(item);
  });
}

function makeMusics (item) {
  return `
        <div class="musica">
          <button>
              <img src="${item.album.images[0].url}" alt="" class="img__musica">
          </button>
          <div class="cont__inf">
              <p class="nome__musica">${item.album.artists[0].name}</p>
              <p class="nome__cantor">${item.album.name}</p>
          </div>
        </div>
  `
}

//player
function makePLayer () {
  return `
    <div id="player__music">
        <img src="imgs/puma.jpeg" alt="musica">
        <div id="inf__music__player">
            <p id="nome__musica__player">lorem lorem</p>
            <p id="nome__cantor__player">lorem</p>
        </div>
    </div>
    <div id="cont__control">
        <button id="anterior"><img src="imgs/icons/skip_previous.png" alt="Voltar"></button>
        <button id="pausarPlay"><img src="imgs/icons/play_arrow.png" alt="Pausar"></button>
        <button id="proximo"><img src="imgs/icons/skip_next.png" alt="Proximo"></button>
        <button id="list__button"><img src="imgs/icons/list.png" alt="Próximas Músicas"></button>
    </div>
  `
}

//pesquisa
function search () {
  const inputSearch = document.querySelector('#input__pesquisa');
  inputSearch.addEventListener('keydown', (eve) => {
    if(eve.key === 'Enter'){//eve é apenas o evento
      let valorInput = inputSearch.value
      if(valorInput === ''){
        return
      }else fetchSpotifyData(valorInput);
    }
  });
}

//musicas inicial
function randomIniMusic () {
  let idMusic = []
  let caracteres = `5aBGFrQXzk8cTnpDVxvKPO12ZWtH0ifM4s7EYmL3CIq9SlJRhbNuojedAUgwy6`
  for(i = 0; i < 22; i++){
    let ind = Math.floor(Math.random() * caracteres.length);
    idMusic += caracteres[ind];
  }
  fetchSpotifyData(idMusic);
}

window.addEventListener('load', () => {
  search();
  randomIniMusic();
});
