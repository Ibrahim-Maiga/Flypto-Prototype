import { ReactNode } from 'react'

import classNames from 'classnames'

import styles from './Section.module.scss'

interface Props {
  className?: string | undefined
  readonly children: ReactNode
}

export const Section = ({ className, children }: Props) => {
  return (
    <div className={classNames(styles.outline, 'p-8 text-center', className)}>
      <div className="lg:container lg:mx-auto" style={{ height: '100%' }}>
        {children}
      </div>
    </div>
  )
}
