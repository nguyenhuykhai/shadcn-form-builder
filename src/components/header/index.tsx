import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer'
import If from '@/components/ui/if'
import { cn } from '@/lib/utils'

import { FaXTwitter } from 'react-icons/fa6'
import { LuGithub, LuMenu } from 'react-icons/lu'
import { SiBuymeacoffee } from 'react-icons/si'

import Logo from '@/assets/logo.svg'
import { ThemeSwitch } from '../ui/theme-switch'

type Tab = {
  name: string
  href: string
  isNewTab?: boolean
  className?: string
  isUpdated?: boolean
}

const tabs: Tab[] = [
  { name: 'Playground', href: '/playground' },
  { name: 'Review JSON', href: '/review' },
]

export default function Header() {
  const { pathname } = useLocation()
  const currentBasePath = '/' + pathname.split('/')[1]

  const navLinks = (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => {
        const isActive = currentBasePath === tab.href
        return (
          <Link
            to={tab.href}
            key={tab.href}
            target={tab.isNewTab ? '_blank' : undefined}
            rel={tab.isNewTab ? 'noopener noreferrer' : undefined}
            className={cn(
              'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              'hover:bg-muted/80 hover:text-foreground',
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground',
              tab.className,
            )}
          >
            {tab.name}
            {isActive && (
              <span
                className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary"
                aria-hidden
              />
            )}
            <If
              condition={!!tab.isUpdated}
              render={() => (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            />
          </Link>
        )
      })}
    </div>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80',
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo + desktop nav */}
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted/80 dark:rounded-lg dark:bg-white/5 dark:hover:bg-white/10"
            aria-label="Home"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
              <Logo />
            </span>
          </Link>
          <nav className="hidden md:block">{navLinks}</nav>
        </div>

        {/* Right: theme + mobile menu */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeSwitch />
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-lg"
                aria-label="Open menu"
              >
                <LuMenu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] rounded-t-2xl">
              <div className="flex flex-col gap-2 p-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Menu
                </span>
                {tabs.map((tab) => (
                  <DrawerClose asChild key={tab.href}>
                    <Link
                      to={tab.href}
                      className={cn(
                        'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        currentBasePath === tab.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted',
                      )}
                    >
                      {tab.name}
                    </Link>
                  </DrawerClose>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

    </header>
  )
}
