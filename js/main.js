const rollMusic = document.querySelector('.roll__musicas');
const player = document.querySelector('#cont__player');
const List = document.querySelector('#contList');
const listMusic = document.querySelector('.list__Music');
List.style.display = 'none';
player.style.display = 'none';

//token de acesso
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
async function  fetchFunction (query) {
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
  let setMusic = randomIndex(items);
  musics(setMusic);
  for(i = 0 ; i < items.length; i++){
    makeList(items[i]);
  }
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
  listenMusic(items);
}

function makeMusics (item) {
  return `
        <div class="musica">
          <button class="listen__Music">
              <img src="${item.album.images[0].url}" alt="" class="img__musica">
          </button>
          <div class="cont__inf">
              <p class="nome__musica">${item.name}</p>
              <p class="nome__cantor">${item.album.artists[0].name}</p>
          </div>
        </div>
  `
}

//list
function makeList (item) {
  listMusic.innerHTML += `
  <div class="ListMusic">
    <div class="inf__music__list">
          <p class="nome__musica__list">${item.name}</p>
          <p class="nome__cantor__list">${item.album.artists[0].name}l</p>
    </div>
        <div class="tech">
            <button hidden ><img src="imgs/icons/play_arrow.png" alt="tocar"></button>
            <a href="${item.uri}"><img src="imgs/logos/Spotify_logos.png" alt="#"></a>
        </div>
    </div>
    <audio class="audioList" hidden src="${item.preview_url}"></audio>
  `
}

//player
function makePLayer (item) {
  player.innerHTML = `
    <div id="player__music">
        <img src="${item.album.images[0].url}" alt="musica">
        <div id="inf__music__player">
            <p id="nome__musica__player">${item.name}</p>
            <p id="nome__cantor__player">${item.album.artists[0].name}</p>
        </div>
    </div>
    <audio class="audio" hidden src="${item.preview_url}"></audio>
    <div id="cont__control">
        <button hidden id="anterior"><img src="imgs/icons/skip_previous.png" alt="Voltar"></button>
        <button id="pausarPlay"><img src="imgs/icons/play_arrow.png" alt="Pausar"></button>
        <button hidden id="proximo"><img src="imgs/icons/skip_next.png" alt="Proximo"></button>
        <button id="list__button"><img src="imgs/icons/list.png" alt="Próximas Músicas"></button>
    </div>
  `  
}

function listenMusic (items) {
  const listenMusic = document.querySelectorAll('.listen__Music');
  listenMusic.forEach((music, ind) => {
    music.addEventListener('click', () => {
      player.style.display = 'flex';
      makePLayer(items[ind]);
      controlsPLayer();
    });
  });
}

function controlsPLayer () {
  const audio = document.querySelector('.audio');
  const pausarPlay = document.querySelector('#pausarPlay');
  const pausarPlayImg = document.querySelector('#pausarPlay img');
  const listButton = document.querySelector('#list__button');
  const close = document.querySelector('#close');
  const next = document.querySelector('#proximo');

  pausarPlay.addEventListener('click', () => {
    if(pausarPlayImg.src.includes('play_arrow.png')){
      pausarPlayImg.src = './imgs/icons/pause.png';
      audio.play();
    }else{
      pausarPlayImg.src = './imgs/icons/play_arrow.png';
      audio.pause();
    }
  });
  listButton.addEventListener('click', () => {
    List.style.display = 'block';
  });
  close.addEventListener('click', () => {
    List.style.display = 'none';
  });
}

//pesquisa
function search () {
  const inputSearch = document.querySelector('#input__pesquisa');
  inputSearch.addEventListener('keydown', (eve) => {
    if(eve.key === 'Enter'){//eve é apenas o evento
      let valorInput = inputSearch.value
      if(valorInput !== ''){
        listMusic.innerHTML = '';
        fetchFunction(valorInput);
      }else return
    }
  });
}

//musicas inicial
function randomIniMusic () {
  let idMusic = [];
  let caracteres = `5aBGFrQXzk8cTnpDVxvKPO12ZWtH0ifM4s7EYmL3CIq9SlJRhbNuojedAUgwy6`
  for(i = 0; i < 22; i++){
    let ind = Math.floor(Math.random() * caracteres.length);
    idMusic += caracteres[ind];
  }
  fetchFunction(idMusic);
}

window.addEventListener('DOMContentLoaded', () => {
  search();
  randomIniMusic();
});
