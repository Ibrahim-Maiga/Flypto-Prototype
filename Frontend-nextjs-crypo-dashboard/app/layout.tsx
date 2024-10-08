import type { ReactNode } from 'react'

import { Overpass } from 'next/font/google'

import classNames from 'classnames'

import { Footer } from './components/footer/Footer'
import { Header } from './components/header/Header'
import { Providers } from './providers'
import './styles/globals.scss'
import styles from './styles/layout.module.scss'

interface Props {
  readonly children: ReactNode
}

const overpass = Overpass({ subsets: ['latin'] })

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={overpass.className}>
        <Providers>
          <section className={classNames(styles.container, 'orange-dark text-foreground bg-background')}>
            <Header />
            <main className={classNames(styles.main)}>{children}</main>
            <Footer />
          </section>
        </Providers>
      </body>
    </html>
  )
}
