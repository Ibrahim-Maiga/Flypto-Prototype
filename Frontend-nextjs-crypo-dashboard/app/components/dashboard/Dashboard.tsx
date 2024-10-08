'use client'

import { useEffect, useState } from 'react'

import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'

import { Prices, fetchPricesApi } from '@/lib/features/crypto/cryptoAPI'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User, getKeyValue } from '@nextui-org/react'
import CardanoIcon from 'cryptocurrency-icons/svg/color/ada.svg'
import BinanceIcon from 'cryptocurrency-icons/svg/color/bnb.svg'
import BitcoinIcon from 'cryptocurrency-icons/svg/color/btc.svg'
import DogecoinIcon from 'cryptocurrency-icons/svg/color/doge.svg'
import EthereumIcon from 'cryptocurrency-icons/svg/color/eth.svg'
import SolanaIcon from 'cryptocurrency-icons/svg/color/sol.svg'
// import ToncoinIcon from 'cryptocurrency-icons/svg/color/ton.svg'
import RippleIcon from 'cryptocurrency-icons/svg/color/xrp.svg'

const crypto: { [key: string]: { name: string; icon: string | StaticImport } } = {
  BTC: { name: 'Bitcoin', icon: BitcoinIcon },
  ETH: { name: 'Ethereum', icon: EthereumIcon },
  BNB: { name: 'Binance Coin', icon: BinanceIcon },
  SOL: { name: 'Solana', icon: SolanaIcon },
  XRP: { name: 'Ripple', icon: RippleIcon },
  DOGE: { name: 'Dogecoin', icon: DogecoinIcon },
  // TON: { name: 'Toncoin', icon: ToncoinIcon },
  ADA: { name: 'Cardano', icon: CardanoIcon },
}

export const Dashboard = () => {
  const [prices, setPrices] = useState<Prices[]>([
    { Symbol: 'BTC', Close: 0, Date: '' },
    { Symbol: 'ETH', Close: 0, Date: '' },
    { Symbol: 'BNB', Close: 0, Date: '' },
    { Symbol: 'SOL', Close: 0, Date: '' },
    { Symbol: 'XRP', Close: 0, Date: '' },
    { Symbol: 'DOGE', Close: 0, Date: '' },
    { Symbol: 'ADA', Close: 0, Date: '' },
  ])

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        let resp: Prices[] = await fetchPricesApi()
        resp = resp.filter((item) => !['USDC', 'TON'].includes(item.Symbol))
        setPrices(resp)
      } catch (err: any) {
        alert(err.message || 'An error occurred')
      }
    }
    fetchPrices()
  }, [])

  return (
    <div>
      <Table aria-label="static collection table">
        <TableHeader className="">
          <TableColumn>Name</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>24H Change</TableColumn>
          <TableColumn>Prediction</TableColumn>
        </TableHeader>
        <TableBody>
          {prices?.map(({ Symbol, Close, Change, Prediction }, index) => (
            <TableRow key={index}>
              <TableCell>
                <User
                  name={Symbol}
                  description={crypto[Symbol.toUpperCase()].name}
                  avatarProps={{
                    icon: <Image alt="Bitcoin" src={crypto[Symbol]?.icon} fill />,
                  }}
                />
              </TableCell>
              <TableCell>{Close}</TableCell>
              <TableCell className={Change ? (Change > 0 ? 'text-emerald-400' : 'text-red-600') : ''}>
                {Change ? `${(Math.round(Change * 100 * 100) / 100).toFixed(2)}%` : 'N/A'}
              </TableCell>
              <TableCell className={Prediction ? (Prediction > Close ? 'text-emerald-400' : 'text-red-600') : ''}>
                {Prediction ? `${Math.round(Prediction).toFixed(2)}` : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
