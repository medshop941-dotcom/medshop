import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { CartProvider } from '@/context/CartContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://medshop.ma'),
  title: 'Med Shop | Maroquinerie & Sacs à Main de Luxe Maroc',
  description:
    'Boutique en ligne exclusive de sacs à main haut de gamme au Maroc. Cuir de qualité supérieure, livraison rapide partout au Maroc et paiement à la livraison.',
  keywords: [
    'sacs à main maroc',
    'maroquinerie luxe casablanca',
    'sacs femme maroc',
    'boutique sac rabat',
    'حقائب نسائية المغرب',
    'حقائب يد فاخرة',
  ],
  openGraph: {
    title: 'Med Shop | Sacs à Main de Luxe Maroc',
    description: 'Découvrez notre collection exclusive de sacs à main en cuir au Maroc.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                duration: 2500,
                className: 'font-sans text-sm',
              }}
            />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
