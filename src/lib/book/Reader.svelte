<script lang="ts" context="module">
  type CfiLocation = { start: string, end: string };
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
  import ePub, { Book, Rendition } from 'epubjs'
	import cfi from '$lib/util/cfi'


  export let title: string
  let book: Book
  let rendition: Rendition

  const dispatch = createEventDispatcher<{
    loaded: { book: Book, rendition: Rendition },
    relocated: CfiLocation,
    selected: CfiLocation
  }>()


  onMount(() => {
    book = ePub(`/books/${title}.epub`)
    rendition = book.renderTo('rendition', { width: '100%', height: 600 })
    book.ready.then(onBookReady)
    
    rendition.display()
    rendition.on('keyup', keyboardNav)
    
    rendition.on('relocated', handleNavButtons)
    rendition.on('relocated', ({ start, end }: any) => {
      dispatch('relocated', { start: start.cfi, end: end.cfi })
    })

    rendition.on('selected', (cfiRange: string) => {
      const [ start, end ] = cfi.split(cfiRange)
      dispatch('selected', { start: start, end: end })
    })


    return book.destroy
  })


  async function onBookReady () {
    const next = document.getElementById('next')
    const prev = document.getElementById('prev')
    if (!next || !prev) return
    
    next.addEventListener('click', () => rendition.next(), false)
    prev.addEventListener('click', () => rendition.prev(), false)
    

    await book.locations.generate(1000)
    dispatch('loaded', { book: book, rendition: rendition })
  }


  function handleNavButtons ({ atEnd, atStart }: any) {
    const next = document.getElementById('next')
    const prev = document.getElementById('prev')
    if (!next || !prev) return

    next.style.visibility = atEnd ? 'hidden' : 'visible'
    prev.style.visibility = atStart ? 'hidden' : 'visible'
  }

  // // Add keyframe
  // rendition.on('selected', async (cfiRange: string) => {
  //   const range = await book.getRange(cfiRange)
  //   const [ start, end ] = cfi.split(cfiRange)

  //   const keyframe: Keyframe = {
  //     id: Date.now(),
  //     type: 'music',
  //     src: '',
  //     snippet: range.toString(),
  //     start: start,
  //     end: end
  //   }

  //   // keyframeEditor.edit(keyframe)
  // })


  function keyboardNav(e: KeyboardEvent) {
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        rendition.prev()
        break
      case 'ArrowRight':
      case 'ArrowDown':
        rendition.next()
        break
    }
  }
</script>

<svelte:window on:keydown={keyboardNav} />


<div class="book">
  <div id="rendition" class="renderer"></div>

  <div style:display="flex">
    <button id="prev" style:flex-grow={1}>‹</button>
    <!-- <button on:click={() => sounds.toggle()}>{'⏵/⏸'}</button> -->
    <button id="next" style:flex-grow={1}>›</button>
  </div>
</div>