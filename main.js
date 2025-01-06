const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')


const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')

// sırası
let index

// döngü
let loop = true

// şarkı listesi
const songsList = [
    {
        name: "Gözlerinin Yeşilini Özledim",
        link: "assets/gozlerinin-yesilini-ozledim.mp3",
        artist: "Seda Tripkolic",
        image: "assets/tripkolik-seda.jpeg"
    },    
    {
        name: "Aramam",
        link: "assets/aramam.mp3",
        artist: "İbrahim Tatlıses",
        image: "assets/ibrahim-tatlises.jpeg"
    },
    {
        name: "Gitme Kal",
        link: "assets/yara-bere-icindeyim.mp3",
        artist: "Hira-i Zerdust",
        image: "assets/hirai.jpeg"
    },
    {
        name: "Gelo Ew Ki Bu",
        link: "assets/gelo-ew-ki-bu.mp3",
        artist: "Aram Tigran",
        image: "assets/aram-tigran.jpeg"
    },
    {
        name: "Ax Eman",
        link: "assets/ax-eman.mp3",
        artist: "Rewsan Celiker",
        image: "assets/rewsan-celiker.jpeg"
    },
    {
        name: "Dinle",
        link: "assets/dinle.mp3",
        artist: "Mahsun Kirmizigul",
        image: "assets/mahsun.jpeg"
    }
]

// şarkı atama
const setSong = (arrayIndex) => {

    // bir obje içerisini tek bir adımda dışarı çıkarıp değişkenlere atama, sırasına göre
    let { name, link, artist, image } = songsList[arrayIndex]

    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image


    // zamanı ayarla
    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration) //125
    }

    //sarki listesini gizle
    playListContainer.classList.add('hide')


    playAudio()
}

// şarkıyı çal
const playAudio = () => {
    audio.play()
    pauseButton.classList.remove("hide") // görün
    playButton.classList.add("hide") // kaybol
}

// şarkı kendiliğinden bittiğinde sonrakine geç
audio.onended = () => {
    nextSong()
}

// şarkıyı durdur
const pauseAudio = () => {
    audio.pause()
    pauseButton.classList.add("hide")
    playButton.classList.remove("hide")
}



// sonrakine geç
const nextSong = () => {
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0
        } else {
            index += 1 // index = index + 1
        }
        setSong(index)

    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }

    playAudio()
}

// öncekine geç
const prevSong = () => {

    pauseAudio()

    if (index > 0) {
        index -= 1
    } else {
        index = songsList.length - 1
    }
    setSong(index)
    playAudio()
}



// zaman düzenleyici
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60) // 02
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60) // 05
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}

// tekrar açma, kapama
repeatButton.addEventListener("click", () => {
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
    }
})

//karistirici tiklanildiginda
shuffleButton.addEventListener('click',()=>{
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        loop = true
    }else {
        shuffleButton.classList.add('active')
        loop = false
    }
})

//anlik zamani yakala
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    //progresi ilerlet
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3))
    
}, 1000); //milnisaniye


//liste ekranini getir
playListButton.addEventListener('click',()=>{
    playListContainer.classList.remove('hide')
})

//listeyi kapat
closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})

//liste olusturma
const initializePlaylist = () =>{
    for(let i in songsList) { // 0 1 2 3 4
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                ${songsList[i].artist}
            </span>
        </div>
        </li>`
    }
}

//progress bar ayarlama
progressBar.addEventListener('click',(event)=>{

    let coordStart = progressBar.getBoundingClientRect().left

    let coordEnd = event.clientX

    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    currentProgress.style.width = progress * 100 + "%"

    audio.currentTime = progress * audio.duration

    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')

})


// önceki butonuna tıklandığında
prevButton.addEventListener('click', prevSong)

// sıradaki butonuna tıklandığında
nextButton.addEventListener('click', nextSong)

// durdur butonuna tıklandığında
pauseButton.addEventListener('click', pauseAudio)

// oynat butonuna tıklanıldığında
playButton.addEventListener('click', playAudio)


// ekran yükleme
window.onload = () => {
    index = 0
    setSong(index)

    pauseAudio()

    initializePlaylist()
}