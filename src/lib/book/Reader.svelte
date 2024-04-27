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

  export function Highlight (range: Selected, color?: string) {
    const id = new Date().toString()
    rendition.annotations.highlight(range, { id: id }, (e: any) => {
      console.log(e.target)
    }, undefined, color ? { 'fill': color } : {})
    console.log (rendition.getContents)
  }

  export function RemoveHighlight (range: Selected) {
    rendition.annotations.remove(range, 'highlight')
  }

  let rendition: Rendition
  let atStart = false, atEnd = false

  const dispatch = createEventDispatcher<{
    selected: CfiLocation & { range: string },
    pageTurned: CfiLocation & { contents: Contents},
    mousemove: { x: number, y: number },
    mousedown: { x: number, y: number },
    mouseup: { x: number, y: number },
  }>()


  onMount(() => {
    rendition = epub.renderTo('rendition', {
      manager: "continuous",
      flow: "paginated",
      width: '100%',
      height: '100%',
      script: `data:text/javascript;charset=utf-8,${script}`,
      resizeOnOrientationChange: true,
      allowScriptedContent: true
    })

    rendition.themes.default({
      body: { 'text-align': 'justify' },
    })

    rendition.display(location)
    
    rendition.on('relocated', displayNavButtons)
    rendition.on('relocated', dispatchPageTurned)
    rendition.on('selected', dispatchSelected)
    rendition.on('keyup', keyboardNav)

    // rendition.on('markClicked', e => console.log(e))
  })

  const script = `
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
      const mouseMoveEvent = new CustomEvent('readermousemove', { detail: { x: e.screenX, y: e.screenY } });
      window.parent.dispatchEvent(mouseMoveEvent);
    }

    function onMouseDown(e) {
      const mouseDownEvent = new CustomEvent('readermousedown', { detail: { x: e.screenX, y: e.screenY } });
      window.parent.dispatchEvent(mouseDownEvent);
    }

    function onMouseUp(e) {
      const mouseUpEvent = new CustomEvent('readermouseup', { detail: { x: e.screenX, y: e.screenY } });
      window.parent.dispatchEvent(mouseUpEvent);
    }
  `


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

<svelte:window
  on:keydown={keyboardNav}
  on:readermousemove={e => dispatch('mousemove', { x: e.detail.x, y: e.detail.y})}
  on:readermousedown={e => dispatch('mousedown', { x: e.detail.x, y: e.detail.y})}
  on:readermouseup={e => dispatch('mouseup', { x: e.detail.x, y: e.detail.y})}
/>


<div class="book">
  <div id="rendition" class="max-w-[45rem] max-h-[30rem] h-svh renderer mx-auto"></div>

  <div class="flex drop-shadow-lg">
    <ReaderNav on:click={() => rendition.prev()} side="left" hidden={atStart} />
    <button on:click={() => sounds.toggle()} class="py-1 px-2 bg-orange-200/30 border border-amber-800/10 hover:bg-orange-300/20 select-none">{'⏵/⏸'}</button>
    <ReaderNav on:click={() => rendition.next()} side="right" hidden={atEnd} />
  </div>
</div>