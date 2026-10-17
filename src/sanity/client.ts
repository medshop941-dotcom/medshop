import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId, token, isSanityConfigured } from './env'
import { Product } from '@/types/product'
import { PRODUCTS } from '@/data/products'

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: !token,
      token: token || undefined,
    })
  : null

const imageBuilder = isSanityConfigured && sanityClient
  ? imageUrlBuilder(sanityClient)
  : null

export function urlForImage(source: Parameters<NonNullable<typeof imageBuilder>['image']>[0]) {
  return imageBuilder?.image(source)?.auto('format')?.fit('max')
}

// GROQ query to fetch all products from Sanity
export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  nameAr,
  "id": _id,
  price,
  originalPrice,
  "image": image.asset->url,
  category,
  categoryAr,
  description,
  descriptionAr,
  inStock,
  featured
}`

// Fetch products from Sanity with automatic fallback to local catalog
export async function getLiveOrLocalProducts(): Promise<Product[]> {
  if (isSanityConfigured && sanityClient) {
    try {
      const sanityProducts = await sanityClient.fetch(PRODUCTS_QUERY)
      if (Array.isArray(sanityProducts) && sanityProducts.length > 0) {
        return sanityProducts
      }
    } catch (error) {
      console.warn('Sanity fetch fallback to local products:', error)
    }
  }
  return PRODUCTS
}
