const rollMusic = document.querySelector('.roll__musicas');
const pesquisa = document.querySelector('#input__pesquisa');
const player = document.querySelector('#cont__player');
const contList = document.querySelector('#contList');
const musics = document.querySelector('.inf__music__list');
player.style.display = `none`
contList.style.display = `none`

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
    const items = data.tracks.items
    APIData(items)

}

function APIData (items) {
    let list = []
    for(i = 0; i < 3; i++){
      const ind = Math.floor(Math.random() * items.length);
      criarMusic(items[ind]);
      list.push(items[ind]);
    }
    listen(list);
    for(i = 0; i < items.length; i++){
      criarList(items[i]);
    }
}

window.addEventListener('load', () => {
  radomizador();
  search();
});

function radomizador () {
  const caracteres = 'BhrYPXZILf0WeOap3CMqJmFtyuGQv61kRxVndDwAEg4sUo9NSTcjz27bKHi85l';
  let result = '';
  for(i = 0; i < 22; i++){
    let random = Math.floor(Math.random() * caracteres.length);
    result += caracteres[random];
  }
  fetchSpotifyData(result);
}

function criarMusic (para) {
  rollMusic.innerHTML += `
    <div class="musica">
            <button class="musica__btn">
                <img src="${para.album.images[1].url}"
                alt=""
                class="img__musica">
            </button>
            <div class="cont__inf">
                <p class="nome__musica">${para.name}</p>
                <p class="nome__cantor">${para.artists[0].name}</p>
            </div>
        </div>
    </div>
  `
}

function criarPLayer (para) {
  player.innerHTML = `
     <div id="player__music">
            <img src="${para.album.images[1].url}" alt="musica">
            <div id="inf__music__player">
                <p id="nome__musica__player">${para.name}</p>
                <p id="nome__cantor__player">${para.artists[0].name}</p>
            </div>
        </div>
        <audio id="musica__audio" hidden controls>
          <source src="${para.preview_url}" type="audio/mpeg">
        </audio>
        <div id="cont__control">
            <button id="anterior"><img src="imgs/icons/skip_previous.png" alt="Voltar"></button>
            <button id="pausarPlay"><img src="imgs/icons/play_arrow.png" alt="Pausar" id="pausarPlayImg"></button>
            <button id="proximo"><img src="imgs/icons/skip_next.png" alt="Proximo"></button>
            <button id="list__button"><img src="imgs/icons/list.png" alt="Próximas Músicas"></button
        </div>
     </div>
  `
  playMusic();
}

function criarList (para) {
  musics.innerHTML += `
           <div class="ListMusic">
            <div class="inf__music__list">
                <p class="nome__musica__list">${para.name}</p>
                <p class="nome__cantor__list">${para.artists[0].name}</p>
            </div>
            <div class="tech">
                <button><img src="imgs/icons/play_arrow.png" alt="tocar"></button>
                <a href="${para.uri}"><img src="imgs/logos/Spotify_logos.png" alt="#"></a>
            </div>
            </div>
        <audio class="musica__audio" hidden controls>
          <source src="${para.preview_url}" type="audio/mpeg">
        </audio>
  `
}

function search () {
  pesquisa.addEventListener('keydown', function(event) {
      if(event.key === 'Enter'){
        const pesquisaValue = pesquisa.value;
        if(pesquisaValue === ''){
          null
        }else{
          fetchSpotifyData(pesquisaValue);
          contList.style.display = `none`;
          musics.innerHTML = ``;
          rollMusic.innerHTML = ``;
          player.style.display = `none`//tentar encurtar isso
        }
    }
  });
}


function listen (para) {
  const BTNmusicas = document.querySelectorAll('.musica__btn');
  
  BTNmusicas.forEach((BTN, i) => {//pega o botão separado e o indíce
    BTN.addEventListener('click', () => {

      player.innerHTML = ``
      criarPLayer(para[i]);
      player.style.display = `flex`;
    });
  })
}

function playMusic () {
  const musicaAudio = document.querySelector('#musica__audio');
  const pausarPlay = document.querySelector('#pausarPlay');
  const pPImg = document.querySelector('#pausarPlayImg');
  const listButton = document.querySelector('#list__button');
  const closeList = document.querySelector('#close');
  const next = document.querySelector('#proximo'); 

  pausarPlay.addEventListener('click', () => {
    if(pPImg.src.includes('imgs/icons/pause.png')){
      pPImg.src = 'imgs/icons/play_arrow.png';
      musicaAudio.pause();

    }else{
      pPImg.src = 'imgs/icons/pause.png';
      musicaAudio.play();
    }
  });
  listButton.addEventListener('click', () => {
    contList.style.display = `block`
  });
  closeList.addEventListener('click', () => {
    contList.style.display = `none`
  });
  next.addEventListener('click', () => {
    nextMusic();
  });
}

function nextMusic () {
  console.log('oi');
  
}
