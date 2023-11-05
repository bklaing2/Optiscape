class RollingAverage {
  private data: number[] = []

  private windowSize: number
  private outlierCount = 0


  public get Data() { return this.data }
  

  public get Average () {
    if (this.data.length === 0) return 0

    const n = this.data.length

    const num = this.data.reduce((sum, d, i) => sum += d * (i + 1), 0)
    const denom = (n * (n + 1)) / 2

    return num / denom
  }

  public get StdDev () {
    const squaredDifferences = this.data.map(value => Math.pow(value - this.Average, 2))
    const variance = squaredDifferences.reduce((acc, value) => acc + value, 0) / this.data.length
    return Math.sqrt(variance)
  }

  private get OutlierMultiplier () {
    return Math.exp(this.outlierCount)
  }


  constructor (windowSize: number) {
    if (windowSize <= 0) throw new Error('Window size must be greater than 0')
    this.windowSize = windowSize
  }


  push (value: number) {
    if (this.isOutlier(value)) {
      this.outlierCount++
      return false
    }

    this.data.push(value)
    
    if (this.data.length > this.windowSize)
      this.data.shift()

    if (this.outlierCount > 0) this.outlierCount--
    return true
  }


  isOutlier (value: number) {
    if (this.data.length < 3) return false
    return Math.abs(value - this.Average) > (this.StdDev * this.OutlierMultiplier)
  }
}


export default RollingAverage
