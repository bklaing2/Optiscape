class Debounce {
  delay: number
  timeout?: NodeJS.Timeout

  constructor (delay = 750) {
    this.delay = delay
  }

  public buffer (fn: () => void) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(fn, this.delay)
  }
}

export default Debounce