'use client'

import { useLanguage } from '@/context/LanguageContext'
import { ProductDrawer } from '@/components/ProductDrawer'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/types/product'
import { getFeaturedProducts } from '@/data/products'
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  Eye,
  Gem,
  ShoppingBag,
  Watch,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export default function Home() {
  const { t, isRtl } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const featuredProducts = getFeaturedProducts()

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  const categoryUniverses = [
    {
      title: isRtl ? 'الحقائب والجلد الفاخر' : 'Maroquinerie & Sacs',
      subtitle: isRtl ? 'حقائب يد، حقائب كتف وبوشيت سهرة' : 'Sacs à main, bandoulières & pochettes',
      icon: ShoppingBag,
      href: '/products?category=bags',
      badge: isRtl ? 'تصاميم راقية' : 'Cuir & Finitions Or',
    },
    {
      title: isRtl ? 'المجوهرات والحلي' : 'Bijoux & Parures',
      subtitle: isRtl ? 'سلاسل، أساور، خواتم وأقراط متلألئة' : 'Colliers, joncs, bagues & boucles d’oreilles',
      icon: Gem,
      href: '/products?category=jewelry',
      badge: isRtl ? 'تألق يدوم' : 'Plaqué Or & Perles',
    },
    {
      title: isRtl ? 'الساعات والإكسسوارات' : 'Montres & Accessoires',
      subtitle: isRtl ? 'ساعات أنيقة، أحزمة وسلاسل القفطان' : 'Montres fines & ceintures chaînes caftan',
      icon: Watch,
      href: '/products?category=accessories',
      badge: isRtl ? 'لمسة ساحرة' : 'Éditions Limitées',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white py-20 md:py-32 border-b border-neutral-900">
        {/* Subtle decorative gold light glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Collection Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs md:text-sm font-bold mb-6 animate-in fade-in zoom-in-95 duration-500 shadow-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 text-gold tracking-tight leading-[1.15] max-w-5xl mx-auto drop-shadow-sm">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl mb-10 text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Category Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 text-xs md:text-sm">
            <Link
              href="/products"
              className="px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-neutral-200 hover:border-gold hover:text-gold transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'حقائب يد' : 'Sacs à Main'}</span>
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-neutral-200 hover:border-gold hover:text-gold transition-colors flex items-center gap-1.5"
            >
              <Gem className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'مجوهرات راقية' : 'Bijoux Précieux'}</span>
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-neutral-200 hover:border-gold hover:text-gold transition-colors flex items-center gap-1.5"
            >
              <Watch className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'ساعات وإكسسوارات' : 'Montres & Accessoires'}</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-gradient text-black px-9 py-4 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-300 text-base shadow-gold transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t.hero.cta}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>

            <a
              href="#featured"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-base cursor-pointer"
            >
              {t.hero.secondaryCta}
            </a>
          </div>

          {/* Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-14 pt-10 border-t border-neutral-800/80 text-xs sm:text-sm text-neutral-400">
            <div className="flex items-center justify-center gap-2.5">
              <Sparkles className="w-4 h-4 text-gold shrink-0" />
              <span>{t.hero.feature1}</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <Truck className="w-4 h-4 text-gold shrink-0" />
              <span>{t.hero.feature2}</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>{t.hero.feature3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Universes / Categories Grid */}
      <section className="py-16 md:py-20 bg-neutral-950 text-white border-b border-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-gold mb-3 tracking-tight">
              {t.hero.universeTitle}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              {t.hero.universeSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {categoryUniverses.map((univ) => {
              const Icon = univ.icon
              return (
                <Link
                  key={univ.title}
                  href="/products"
                  className="group relative p-6 md:p-8 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2.5 py-1 rounded-md bg-neutral-800">
                        {univ.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                      {univ.title}
                    </h3>
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-6">
                      {univ.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gold text-xs font-bold pt-4 border-t border-neutral-800">
                    <span>{isRtl ? 'تصفح التشكيلة' : 'Découvrir la sélection'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-neutral-950 mb-3 tracking-tight">
              {t.products.featuredTitle}
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
              {t.products.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-neutral-200/80 group cursor-pointer flex flex-col overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={isRtl ? product.nameAr : product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <span className="absolute top-3.5 right-3.5 bg-black/85 backdrop-blur-xs text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold/30">
                    {isRtl ? product.categoryAr : product.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-gold transition-colors">
                      {isRtl ? product.nameAr : product.name}
                    </h3>
                    <p className="text-neutral-500 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
                      {isRtl ? product.descriptionAr : product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 font-medium">{t.cart.total}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-gold font-black text-xl md:text-2xl">
                          {product.price} {t.common.currency}
                        </span>
                        {product.originalPrice && (
                          <span className="text-neutral-400 line-through text-xs">
                            {product.originalPrice} {t.common.currency}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer group-hover:bg-gold-gradient group-hover:text-black"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.products.clickToView}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border-2 border-black text-black px-8 py-3.5 rounded-xl font-bold hover:bg-black hover:text-white transition-all duration-300 text-sm md:text-base cursor-pointer"
            >
              <span>{t.products.viewAll}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us & Customer Reassurance */}
      <section className="py-14 bg-neutral-900 text-white border-t border-neutral-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <CheckCircle2 className="w-6 h-6 text-gold mb-2 mx-auto sm:mx-0" />
              <h4 className="font-bold text-sm text-neutral-100 mb-1">
                {isRtl ? 'معاينة قبل الدفع' : 'Vérifiez avant de payer'}
              </h4>
              <p className="text-xs text-neutral-400">
                {isRtl ? 'افتحي طردكِ وتأكدي من الجودة' : 'Ouvrez votre colis à la livraison'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <Sparkles className="w-6 h-6 text-gold mb-2 mx-auto sm:mx-0" />
              <h4 className="font-bold text-sm text-neutral-100 mb-1">
                {isRtl ? 'مجوهرات لا تصدأ' : 'Inoxydable & Durable'}
              </h4>
              <p className="text-xs text-neutral-400">
                {isRtl ? 'مقاومة للماء والاسوداد' : 'Résiste à l’eau et au temps'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <Clock className="w-6 h-6 text-gold mb-2 mx-auto sm:mx-0" />
              <h4 className="font-bold text-sm text-neutral-100 mb-1">
                {isRtl ? 'شحن فائق السرعة' : 'Expédition 24/48h'}
              </h4>
              <p className="text-xs text-neutral-400">
                {isRtl ? 'توصيل مباشر لباب منزلكِ' : 'Livraison directe à domicile'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <ShieldCheck className="w-6 h-6 text-gold mb-2 mx-auto sm:mx-0" />
              <h4 className="font-bold text-sm text-neutral-100 mb-1">
                {isRtl ? 'خدمة زبناء ممتازة' : 'Assistance 7j/7'}
              </h4>
              <p className="text-xs text-neutral-400">
                {isRtl ? 'متابعة عبر تطبيق واتساب' : 'Conseils et suivi personnalisé'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Drawer */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
