'use server'

import { getLiveOrLocalProducts } from '@/sanity/client'
import { Product } from '@/types/product'
import { PRODUCTS, getCategories } from '@/data/products'

export async function fetchCatalogProductsAction(): Promise<Product[]> {
  try {
    const products = await getLiveOrLocalProducts()
    if (products && products.length > 0) {
      return products
    }
  } catch (error) {
    console.warn('Failed to fetch from Sanity, falling back to local catalog:', error)
  }
  return PRODUCTS
}

export async function fetchCategoriesAction(language: 'fr' | 'ar') {
  return getCategories(language)
}
