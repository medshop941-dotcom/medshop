'use server'

import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function uploadImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File | null
    if (!file) {
      return { success: false, error: 'Aucun fichier sélectionné' }
    }

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'L’image dépasse la taille maximale autorisée (10 Mo)' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`
    const contentType = file.type || 'image/jpeg'

    // Try Supabase Storage first
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { error: uploadError } = await supabaseAdmin.storage
          .from('medshop-media')
          .upload(fileName, buffer, {
            contentType,
            upsert: true,
          })

        if (!uploadError) {
          const { data: urlData } = supabaseAdmin.storage
            .from('medshop-media')
            .getPublicUrl(fileName)

          if (urlData?.publicUrl) {
            return { success: true, url: urlData.publicUrl }
          }
        } else {
          console.warn('Supabase storage upload error:', uploadError)
        }
      } catch (err) {
        console.warn('Supabase storage exception:', err)
      }
    }

    // Fallback: Base64 Data URL (guarantees upload works even if storage is offline)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${contentType};base64,${base64}`
    return { success: true, url: dataUrl }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors du téléversement',
    }
  }
}
