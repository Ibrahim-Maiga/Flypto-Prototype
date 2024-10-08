'use client'

import { useState } from 'react'
import { MdContentCopy } from 'react-icons/md'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Snippet,
} from '@nextui-org/react'
import classNames from 'classnames'

import styles from './Header.module.scss'

const pages = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about-me' },
  { name: 'Contact', path: '/contact' },
]

export const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    'Profile',
    'Dashboard',
    'Activity',
    'Analytics',
    'System',
    'Deployments',
    'My Settings',
    'Team Settings',
    'Help & Feedback',
    'Log Out',
  ]

  return (
    <div>
      <Navbar
        className="px-14 py-8"
        style={{
          backgroundColor: 'rgb(84 64 48 / 46%)',
          borderBottomLeftRadius: '4rem',
          borderBottomRightRadius: '4rem',
        }}
        maxWidth="full"
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
          <NavbarBrand className="hidden lg:flex">FLYPTO</NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="end">
          {pages.map((page) => (
            <NavbarItem key={page.path} isActive={pathname === page.path}>
              <Link color="foreground" href={page.path}>
                {page.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'}
                className="w-full"
                href="#"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  )
}

export const Nav = () => {
  const pathname = usePathname()

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-me' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav className={styles.nav}>
      {pages.map((page) => (
        <Link
          key={page.path}
          className={classNames(styles.link, { [styles.active]: pathname === page.path })}
          href={page.path}
        >
          {page.name}
        </Link>
      ))}
    </nav>
  )
}
