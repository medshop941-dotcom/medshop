'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CartDrawer } from './CartDrawer'
import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'

export function Header() {
  const { t, isRtl } = useLanguage()
  const { cartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const navItems = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.products, href: '/products' },
  ]

  return (
    <>
      <header className="bg-black text-white sticky top-0 z-40 shadow-lg border-b border-neutral-900/80 backdrop-blur-md bg-black/95">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform active:scale-98"
            >
              <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border border-gold/40 shadow-gold group-hover:border-gold transition-colors">
                <Image
                  src="/logo.jpg"
                  alt="Med Shop Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-wider text-gold">
                  MED SHOP
                </span>
                <span className="text-[10px] tracking-widest text-neutral-400 uppercase -mt-1 font-mono">
                  {isRtl ? 'المغرب • فاخر' : 'Maroc • Luxury'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-neutral-300 hover:text-gold transition-colors font-medium text-base relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions: Language Switcher & Cart */}
            <div className="flex items-center gap-3 md:gap-5">
              <LanguageSwitcher />

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={t.nav.cart}
                className="text-white hover:text-gold transition-colors relative p-2.5 rounded-xl hover:bg-neutral-900 cursor-pointer"
              >
                <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow-gold animate-in zoom-in-50 duration-200">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-900 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pb-3 border-t border-neutral-800 pt-3 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-neutral-200 hover:text-gold hover:bg-neutral-900 transition-colors font-semibold text-base"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
