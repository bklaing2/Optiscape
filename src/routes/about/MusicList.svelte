<script lang="ts">
  const backgroundMusic = import.meta.glob('/static/music/*.mp3')

  let names: string[] = []

  async function handleMusic () {
    for (const modulePath in backgroundMusic) {
      const split = modulePath.split('/')
      const name = split[split.length - 1]
      const file = await backgroundMusic[modulePath]()
      // console.log(name)
      // backgroundMusic[modulePath]().then(({ default: imageUrl }) => {
      //   console.log(modulePath, imageUrl)
      // })

      names = [ ...names, name ]
    }
  }

  handleMusic()
</script>



{#each names as name }
  <p>{name}</p>
{/each}