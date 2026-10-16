'use client'

import { useLanguage } from '@/context/LanguageContext'
import { ProductDrawer } from '@/components/ProductDrawer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Product } from '@/types/product'
import { getAllProducts, getCategories } from '@/data/products'
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react'

export default function ProductsPage() {
  const { t, isRtl, language } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const allProducts = getAllProducts()
  const categories = useMemo(() => getCategories(language), [language])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return allProducts
    return allProducts.filter((p) =>
      isRtl ? p.categoryAr === selectedCategory : p.category === selectedCategory
    )
  }, [allProducts, selectedCategory, isRtl])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  return (
    <div className="py-12 md:py-20 bg-gradient-to-b from-neutral-50 to-white min-h-[80vh]">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h1 className="text-3xl md:text-5xl font-black text-neutral-950 mb-3 tracking-tight">
            {t.products.allTitle}
          </h1>
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
            {t.products.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 md:mb-14">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-black text-gold shadow-md scale-102'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-neutral-200/80 group flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <div
                onClick={() => handleProductClick(product)}
                className="relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer"
              >
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

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => handleProductClick(product)}
                    className="text-lg font-bold text-neutral-900 mb-2 hover:text-gold transition-colors cursor-pointer"
                  >
                    {isRtl ? product.nameAr : product.name}
                  </h3>
                  <p className="text-neutral-500 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
                    {isRtl ? product.descriptionAr : product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-gold font-black text-xl md:text-2xl">
                      {product.price} {t.common.currency}
                    </span>
                    {product.originalPrice && (
                      <span className="text-neutral-400 line-through text-xs ml-2">
                        {product.originalPrice} {t.common.currency}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleProductClick(product)}
                      className="inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.products.clickToView}</span>
                    </button>

                    <Link
                      href={`/products/${product.id}`}
                      className="p-2 border border-neutral-300 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                      title={t.products.viewDetails}
                    >
                      {isRtl ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Quick View Drawer */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
