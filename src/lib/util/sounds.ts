const music = new Audio ()
music.loop = true
music.volume = 0.5
let currentlyPlaying = ''

const ambiences = new Map<string, HTMLAudioElement>()


let paused = false


function play () {
  paused = false
  
  music.play()
  ambiences.forEach(a => a.play())
}

function pause () {
  paused = true

  music.pause()
  ambiences.forEach(a => a.pause())
}

function toggle () {
  if (paused) play()
  else pause()
}


function changeMusic (src: string) {
  if (src === music.src) return
  
  music.pause()
  music.removeAttribute('src')

  music.src = src
  currentlyPlaying = src

  if (paused) return
  music.play()
}

function endMusic (src: string) {
  if (music.src.includes(src)) return

  music.pause()
  music.removeAttribute('src')
}


function addAmbience (src: string) {
  if (ambiences.has(src)) return

  const ambience = new Audio(src)
  ambience.loop = true
  ambiences.set(src, ambience)
  
  if (paused) return
  ambience.play()
}


function removeAmbience (src: string) {
  const ambience = ambiences.get(src)
  if (!ambience) return
  
  ambience.pause()
  ambience.remove()
  ambiences.delete(src)
}


function playSfx (src: string) {
  if (!src || paused) return

  const audio = new Audio(src)

  audio.addEventListener('ended', audio.remove)
  audio.play()
}


const sounds = {
  paused,
  currentlyPlaying,

  play,
  pause,
  toggle,

  changeMusic,
  endMusic,
  addAmbience,
  removeAmbience,
  playSfx
}

export default sounds