<script lang="ts" context="module">
  export type CfiLocation = { start: string, end: string };
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
  import type { Book, Contents, Rendition } from 'epubjs'
	import cfi from '$lib/util/cfi'
	import ReaderNav from '$lib/buttons/ReaderNav.svelte';
	import type { Relocated, Selected } from '$lib/types/types';
	import sounds from '$lib/util/sounds';


  export let epub: Book
  export let location: string | undefined = undefined
  let rendition: Rendition
  let atStart = false, atEnd = false

  const dispatch = createEventDispatcher<{
    clicked: undefined,
    selected: CfiLocation & { range: string },
    pageTurned: CfiLocation & { contents: Contents},
  }>()


  onMount(() => {
    rendition = epub.renderTo('rendition', {
      manager: "continuous",
      flow: "paginated",
      width: '100%',
      height: '100%',
      stylesheet: 'data:text/css;charset=utf-8,body{text-align:justify;}',
      // script: `data:text/javascript;charset=utf-8,${script}`,
      resizeOnOrientationChange: true,
      allowScriptedContent: true
    })

    rendition.display(location)
    
    rendition.on('relocated', displayNavButtons)
    rendition.on('relocated', dispatchPageTurned)
    rendition.on('selected', dispatchSelected)
    rendition.on('keyup', keyboardNav)
  })

  // const script = `
  //   const customEvent = new CustomEvent('readerclicked');
  //   document.addEventListener("click", handleClick);

  //   function handleClick(event) {
  //     window.parent.dispatchEvent(customEvent);
  //   }
  // `


  function displayNavButtons (page: Relocated) {
    atStart = !!page.atStart
    atEnd = !!page.atEnd
  }

  function dispatchPageTurned (page: Relocated) {
    dispatch('pageTurned', { start: page.start.cfi, end: page.end.cfi, contents: rendition.getContents() })
  }

  function dispatchSelected (range: Selected) {
    const [ start, end ] = cfi.split(range)
    dispatch('selected', { range, start, end })
  }

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

<svelte:window on:keydown={keyboardNav} on:readerclicked={() => dispatch('clicked')} />


<div class="book">
  <div id="rendition" class="max-w-[45rem] max-h-[30rem] h-svh renderer mx-auto"></div>

  <div class="flex drop-shadow-lg">
    <ReaderNav on:click={() => rendition.prev()} side="left" hidden={atStart} />
    <button on:click={() => sounds.toggle()} class="py-1 px-2 bg-orange-200/30 border border-amber-800/10 hover:bg-orange-300/20 select-none">{'⏵/⏸'}</button>
    <ReaderNav on:click={() => rendition.next()} side="right" hidden={atEnd} />
  </div>
</div>