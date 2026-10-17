'use server'

import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { Product } from '@/types/product'
import { PRODUCTS, getCategories } from '@/data/products'
import { revalidatePath } from 'next/cache'

// Local in-memory store fallback for offline / local mode
let localProducts: Product[] = [...PRODUCTS]

interface DbProductRow {
  id: number
  created_at?: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  price: number
  original_price: number | null
  image: string
  category: string
  category_ar: string
  in_stock: number
  featured: boolean
}

function mapDbRowToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    nameAr: row.name_ar,
    description: row.description,
    descriptionAr: row.description_ar,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: row.image || '/logo.jpg',
    category: row.category,
    categoryAr: row.category_ar,
    inStock: Number(row.in_stock ?? 10),
    featured: Boolean(row.featured),
  }
}

/**
 * Fetch all products (Supabase live DB with instant local fallback)
 */
export async function fetchCatalogProductsAction(): Promise<Product[]> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('id', { ascending: true })

      if (!error && Array.isArray(data) && data.length > 0) {
        return (data as DbProductRow[]).map(mapDbRowToProduct)
      }
    }
  } catch (err) {
    console.warn('Supabase fetch products error, fallback to local:', err)
  }

  return localProducts
}

/**
 * Create a new product in the database
 */
export async function createProductAction(
  payload: Omit<Product, 'id'>
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert({
          name: payload.name,
          name_ar: payload.nameAr,
          description: payload.description,
          description_ar: payload.descriptionAr,
          price: payload.price,
          original_price: payload.originalPrice || null,
          image: payload.image || '/logo.jpg',
          category: payload.category,
          category_ar: payload.categoryAr,
          in_stock: payload.inStock ?? 10,
          featured: Boolean(payload.featured),
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase createProduct error:', error)
        return { success: false, error: error.message }
      }

      const created = mapDbRowToProduct(data as DbProductRow)
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/admin')
      return { success: true, product: created }
    }

    // Local fallback mode
    const newId = localProducts.length > 0 ? Math.max(...localProducts.map((p) => Number(p.id) || 0)) + 1 : 1
    const localNewProduct: Product = { ...payload, id: newId }
    localProducts.push(localNewProduct)
    return { success: true, product: localNewProduct }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Update an existing product in the database
 */
export async function updateProductAction(
  id: number | string,
  updates: Partial<Product>
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const updateData: Record<string, unknown> = {}
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.nameAr !== undefined) updateData.name_ar = updates.nameAr
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.descriptionAr !== undefined) updateData.description_ar = updates.descriptionAr
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice || null
      if (updates.image !== undefined) updateData.image = updates.image
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.categoryAr !== undefined) updateData.category_ar = updates.categoryAr
      if (updates.inStock !== undefined) updateData.in_stock = updates.inStock
      if (updates.featured !== undefined) updateData.featured = updates.featured

      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase updateProduct error:', error)
        return { success: false, error: error.message }
      }

      const updated = mapDbRowToProduct(data as DbProductRow)
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath(`/products/${id}`)
      revalidatePath('/admin')
      return { success: true, product: updated }
    }

    // Local fallback mode
    const idx = localProducts.findIndex((p) => p.id.toString() === id.toString())
    if (idx !== -1) {
      localProducts[idx] = { ...localProducts[idx], ...updates }
      return { success: true, product: localProducts[idx] }
    }
    return { success: false, error: 'Product not found' }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Delete a product from the database
 */
export async function deleteProductAction(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id)

      if (error) {
        console.error('Supabase deleteProduct error:', error)
        return { success: false, error: error.message }
      }

      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/admin')
      return { success: true }
    }

    // Local fallback mode
    localProducts = localProducts.filter((p) => p.id.toString() !== id.toString())
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchCategoriesAction(language: 'fr' | 'ar') {
  return getCategories(language)
}
