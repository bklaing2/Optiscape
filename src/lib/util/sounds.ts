const music = new Audio ()
music.loop = true
music.volume = 0.5
let currentlyPlaying = ''

const ambiences = new Map<string, HTMLAudioElement>()


let paused = false


function play () {
  console.log('PLAY MUSIC')
  return
  paused = false
  
  music.play()
  ambiences.forEach(a => a.play())
}

function pause () {
  console.log('PAUSE MUSIC')
  return
  paused = true

  music.pause()
  ambiences.forEach(a => a.pause())
}

function toggle () {
  console.log('TOGGLE MUSIC')
  return
  if (paused) play()
  else pause()
}


function changeMusic (src: string) {
  console.log('CHANGE MUSIC')
  return
  if (src === music.src) return
  
  music.pause()
  music.removeAttribute('src')

  music.src = src
  currentlyPlaying = src

  if (paused) return
  music.play()
}


function addAmbience (src: string) {
  console.log('ADD AMBIENCE')
  return
  if (ambiences.has(src)) return

  const ambience = new Audio(src)
  ambience.loop = true
  ambiences.set(src, ambience)
  
  if (paused) return
  ambience.play()
}


function removeAmbience (src: string) {
  console.log('REMOVE AMBIENCE')
  return
  const ambience = ambiences.get(src)
  if (!ambience) return
  
  ambience.pause()
  ambience.remove()
  ambiences.delete(src)
}


function playSfx (src: string) {
  console.log('PLAY SFX')
  return
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
  addAmbience,
  removeAmbience,
  playSfx
}

export default sounds