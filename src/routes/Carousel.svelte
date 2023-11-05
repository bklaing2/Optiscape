<script>
  let items = [1, 2, 3, 4, 5] // Sample items to display
  let currentIndex = 0

  function next() {
    if (currentIndex < items.length - 1) {
      currentIndex += 1
    }
  }

  function prev() {
    if (currentIndex > 0) {
      currentIndex -= 1
    }
  }
</script>

<div class="carousel">
  <div class="carousel-container" style="transform: translateX(-${currentIndex * 100}%)">
    {#each items as item, i (item)}
      <div class="carousel-item" style="width: 100%">
        {item}
      </div>
    {/each}
  </div>

  <button on:click={prev} class="carousel-button prev">Previous</button>
  <button on:click={next} class="carousel-button next">Next</button>
</div>

<style>
  .carousel {
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .carousel-container {
    display: flex;
    transition: transform 0.5s;
  }

  .carousel-item {
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    margin: 0 10px;
  }

  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 10px;
    cursor: pointer;
  }

  .prev {
    left: 10px;
  }

  .next {
    right: 10px;
  }
</style>
