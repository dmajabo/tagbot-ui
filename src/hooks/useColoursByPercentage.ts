export default function useColoursByPercentage() {

  function getColourByPercent(val: number) {
    if (val < 50) return 'percent_the-lowest'
    if (val < 85) return 'percent_average'
    return 'percent_the-highest'
  }

  return {
    getColourByPercent
  }
}
