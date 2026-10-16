'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { STORE_PHONE_DISPLAY, STORE_PHONE_NUMBER } from '@/lib/constants'
import { Phone, MapPin, MessageCircle, ShieldCheck, Truck } from 'lucide-react'

const CURRENT_YEAR = 2026

export function Footer() {
  const { t, isRtl } = useLanguage()

  return (
    <footer className="bg-black text-white border-t border-neutral-800/90 mt-auto">
      {/* Trust Badges */}
      <div className="border-b border-neutral-900 bg-neutral-950/70 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Truck className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="font-bold text-sm text-neutral-100">
                  {isRtl ? 'توصيل لجميع المدن المغربية' : 'Livraison Partout au Maroc'}
                </p>
                <p className="text-xs text-neutral-400">
                  {isRtl ? 'مجاني للطلبات فوق 500 درهم' : 'Gratuite dès 500 DH d’achat'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <ShieldCheck className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="font-bold text-sm text-neutral-100">
                  {isRtl ? 'جودة أصلية مضمونة' : 'Cuir & Finitions de Qualité'}
                </p>
                <p className="text-xs text-neutral-400">
                  {isRtl ? 'فحص الطلب قبل الدفع' : 'Vérification avant paiement'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <MessageCircle className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="font-bold text-sm text-neutral-100">
                  {isRtl ? 'خدمة عملاء عبر واتساب' : 'Assistance WhatsApp Directe'}
                </p>
                <p className="text-xs text-neutral-400">
                  {isRtl ? 'إجابة سريعة على جميع استفساراتكم' : 'Réponse 7j/7 pour vos commandes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-black text-gold tracking-wide mb-3">MED SHOP</h3>
            <p className="text-neutral-400 mb-5 text-sm leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
            <div className="space-y-2.5 text-neutral-400 text-sm">
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>{t.footer.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span dir="ltr">{STORE_PHONE_DISPLAY}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-gold uppercase tracking-wider mb-4">
              {t.footer.linksTitle}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-gold transition-colors text-sm inline-block py-0.5"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-neutral-400 hover:text-gold transition-colors text-sm inline-block py-0.5"
                >
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-neutral-400 hover:text-gold transition-colors text-sm inline-block py-0.5"
                >
                  {t.nav.cart}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / WhatsApp */}
          <div>
            <h3 className="text-base font-bold text-gold uppercase tracking-wider mb-4">
              {t.footer.contactTitle}
            </h3>
            <p className="text-neutral-400 text-sm mb-4">
              {isRtl
                ? 'لأي استفسار أو طلب خاص، لا تترددي في مراسلتنا مباشرة على واتساب.'
                : 'Pour toute question ou commande spécifique, contactez notre équipe sur WhatsApp.'}
            </p>
            <a
              href={`https://wa.me/${STORE_PHONE_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-gold-gradient text-black px-5 py-3 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 text-sm shadow-gold transform hover:scale-102 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>{t.footer.whatsappBtn}</span>
            </a>
          </div>
        </div>

        <div className="border-t border-neutral-900 mt-10 pt-8 text-center text-neutral-500 text-xs">
          <p>© {CURRENT_YEAR} Med Shop. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
