'use server'

import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { CategoryItem } from '@/types/category'
import defaultCategories from '@/data/categories.json'
import { revalidatePath } from 'next/cache'

let localCategories: CategoryItem[] = [...(defaultCategories as CategoryItem[])]

interface DbCategoryRow {
  id: string | number
  name: string
  name_ar: string
  image: string
  description?: string
  description_ar?: string
}

function mapDbRowToCategory(row: DbCategoryRow): CategoryItem {
  return {
    id: row.id.toString(),
    name: row.name,
    nameAr: row.name_ar,
    image: row.image || '/logo.jpg',
    description: row.description,
    descriptionAr: row.description_ar,
  }
}

/**
 * Fetch all categories (from Supabase if table exists, otherwise local JSON)
 */
export async function fetchCategoriesListAction(): Promise<CategoryItem[]> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('id', { ascending: true })

      if (!error && Array.isArray(data) && data.length > 0) {
        return (data as DbCategoryRow[]).map(mapDbRowToCategory)
      }
    }
  } catch (err) {
    console.warn('Supabase categories query fallback:', err)
  }

  return localCategories
}

/**
 * Create a new category
 */
export async function createCategoryAction(
  payload: Omit<CategoryItem, 'id'>
): Promise<{ success: boolean; category?: CategoryItem; error?: string }> {
  try {
    const slugId = `cat-${Date.now()}`
    const newCategory: CategoryItem = {
      id: slugId,
      name: payload.name.trim(),
      nameAr: payload.nameAr.trim(),
      image: payload.image || '/logo.jpg',
      description: payload.description,
      descriptionAr: payload.descriptionAr,
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .insert({
            name: newCategory.name,
            name_ar: newCategory.nameAr,
            image: newCategory.image,
            description: newCategory.description || null,
            description_ar: newCategory.descriptionAr || null,
          })
          .select()
          .single()

        if (!error && data) {
          const created = mapDbRowToCategory(data as DbCategoryRow)
          localCategories.push(created)
          revalidatePath('/')
          revalidatePath('/products')
          revalidatePath('/admin')
          return { success: true, category: created }
        }
      } catch (err) {
        console.warn('Supabase category insert error, fallback to memory:', err)
      }
    }

    // Fallback mode
    localCategories.push(newCategory)
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin')
    return { success: true, category: newCategory }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de la création de la catégorie',
    }
  }
}

/**
 * Update an existing category
 */
export async function updateCategoryAction(
  id: string,
  updates: Partial<CategoryItem>
): Promise<{ success: boolean; category?: CategoryItem; error?: string }> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const updateData: Record<string, unknown> = {}
        if (updates.name !== undefined) updateData.name = updates.name
        if (updates.nameAr !== undefined) updateData.name_ar = updates.nameAr
        if (updates.image !== undefined) updateData.image = updates.image
        if (updates.description !== undefined) updateData.description = updates.description
        if (updates.descriptionAr !== undefined) updateData.description_ar = updates.descriptionAr

        const { data, error } = await supabaseAdmin
          .from('categories')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (!error && data) {
          const updated = mapDbRowToCategory(data as DbCategoryRow)
          localCategories = localCategories.map((c) => (c.id === id ? updated : c))
          revalidatePath('/')
          revalidatePath('/products')
          revalidatePath('/admin')
          return { success: true, category: updated }
        }
      } catch (err) {
        console.warn('Supabase category update error:', err)
      }
    }

    // Fallback
    localCategories = localCategories.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
    const updated = localCategories.find((c) => c.id === id)
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin')
    return { success: true, category: updated }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour',
    }
  }
}

/**
 * Delete a category
 */
export async function deleteCategoryAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('categories').delete().eq('id', id)
      } catch (err) {
        console.warn('Supabase category delete error:', err)
      }
    }

    localCategories = localCategories.filter((c) => c.id !== id)
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de la suppression',
    }
  }
}
