'use server'

import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import defaultSettings from '@/data/settings.json'
import { revalidatePath } from 'next/cache'

let localSettings = { ...defaultSettings }

function cleanWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '212' + cleaned.slice(1)
  } else if (!cleaned.startsWith('212') && cleaned.length === 9) {
    cleaned = '212' + cleaned
  }
  return cleaned
}

/**
 * Get store settings (WhatsApp phone number)
 */
export async function getStoreSettingsAction(): Promise<{
  whatsappNumber: string
  formattedPhone: string
  storeName: string
}> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('store_settings')
          .select('value')
          .eq('key', 'whatsapp_number')
          .single()

        if (!error && data?.value) {
          const num = cleanWhatsAppNumber(data.value)
          return {
            whatsappNumber: num,
            formattedPhone: `+${num.slice(0, 3)} ${num.slice(3, 4)} ${num.slice(4, 6)} ${num.slice(6, 8)} ${num.slice(8)}`,
            storeName: localSettings.storeName,
          }
        }
      } catch (err) {
        console.warn('Supabase store_settings read fallback:', err)
      }
    }
  } catch (err) {
    console.warn('getStoreSettingsAction error:', err)
  }

  const num = cleanWhatsAppNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || localSettings.whatsappNumber || '212600000000'
  )
  return {
    whatsappNumber: num,
    formattedPhone: `+${num.slice(0, 3)} ${num.slice(3, 4)} ${num.slice(4, 6)} ${num.slice(6, 8)} ${num.slice(8)}`,
    storeName: localSettings.storeName,
  }
}

/**
 * Update WhatsApp phone number in settings
 */
export async function updateStoreSettingsAction(
  newPhone: string
): Promise<{ success: boolean; whatsappNumber?: string; formattedPhone?: string; error?: string }> {
  try {
    const cleaned = cleanWhatsAppNumber(newPhone)
    if (cleaned.length < 11 || cleaned.length > 13) {
      return {
        success: false,
        error: 'Veuillez saisir un numéro marocain valide (ex: 0612345678 ou 212612345678)',
      }
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin
          .from('store_settings')
          .upsert({
            key: 'whatsapp_number',
            value: cleaned,
            updated_at: new Date().toISOString(),
          })

        if (!error) {
          localSettings.whatsappNumber = cleaned
          revalidatePath('/')
          revalidatePath('/admin')
          revalidatePath('/products')
          revalidatePath('/checkout')
          return {
            success: true,
            whatsappNumber: cleaned,
            formattedPhone: `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`,
          }
        }
      } catch (err) {
        console.warn('Supabase store_settings upsert error:', err)
      }
    }

    // Local fallback
    localSettings.whatsappNumber = cleaned
    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/products')
    revalidatePath('/checkout')
    return {
      success: true,
      whatsappNumber: cleaned,
      formattedPhone: `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour',
    }
  }
}
