import type { Metadata } from 'next'

import { Image } from '@nextui-org/react'

import { Dashboard } from './components/dashboard/Dashboard'
import { Section } from './components/section/Section'

export default function IndexPage() {
  return (
    <Section>
      <h1>About FLYPTO</h1>
      <div className="text-left flex flex-col gap-4 font-extralight p-20">
        <p>
          Welcome to FLYPTO, your trusted partner in navigating the dynamic world of cryptocurrency trading. At FLYPTO,
          we empower our customers to make smarter, more profitable decisions in the market through cutting-edge AI
          technology and insightful data analytics.
        </p>
        <p>
          Our platform is designed to provide a seamless trading experience, delivering real-time market information,
          trends, and predictive insights that help you stay ahead of the curve. Whether you’re a seasoned trader or
          just starting out, our AI-driven tools are tailored to help you maximize your returns and minimize risks.
        </p>
        <p>
          At FLYPTO, we believe that the future of trading lies in harnessing the power of artificial intelligence. Our
          advanced algorithms analyze vast amounts of market data, identifying opportunities that can give you a
          competitive edge. We are committed to transparency, security, and innovation, ensuring that you have the best
          resources at your fingertips.
        </p>
        <p>
          Join FLYPTO today and take control of your financial future with the most advanced trading tools available.
          Together, let’s make the market work for you.
        </p>
      </div>

      <Dashboard />
    </Section>
  )
}

export const metadata: Metadata = {
  title: 'FLYPTO',
}
