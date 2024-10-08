import moment from 'moment'

export interface Prices {
  Date: string
  Symbol: string
  Close: number
  Change?: number
  Prediction?: number
}

export const getLastTwoDates = () => {
  if (moment().utc().hour() > 1) {
    return [moment().utc().startOf('day'), moment().utc().startOf('day').subtract(1, 'days')]
  } else {
    return [moment().utc().startOf('day').subtract(1, 'days'), moment().utc().startOf('day').subtract(2, 'days')]
  }
}

export const fetchPricesApi = async () => {
  const resp = await fetch('/api/crypto/prices', {
    method: 'GET',
  })
  const data = await resp.json()

  const todayPrices: Prices[] = []
  const yesterdayPrices: Prices[] = []
  const dates = getLastTwoDates()

  data.forEach((item: Prices) => {
    if (item.Date.startsWith(dates[0].format('YYYY-MM-DDTHH:mm:ss') + 'Z')) {
      todayPrices.push(item)
    } else if (item.Date.startsWith(dates[1].format('YYYY-MM-DDTHH:mm:ss') + 'Z')) {
      yesterdayPrices.push(item)
    }
  })

  return todayPrices.map((item) => {
    const yesterdayPrice = yesterdayPrices.find((y) => y.Symbol === item.Symbol)
    const change = yesterdayPrice ? (item.Close - yesterdayPrice.Close) / yesterdayPrice.Close : undefined
    return { ...item, Change: change, Prediction: item.Close * (1 + (Math.random() * 20 - 10) / 100) }
  })
}
