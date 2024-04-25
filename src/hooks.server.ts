import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { Handle } from '@sveltejs/kit'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '$lib/types/database'

export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => event.cookies.set(key, value, { ...options, path: '/' }),
      remove: (key, options) => event.cookies.delete(key, { ...options, path: '/' }),
    }
  })

  
  const safeGetSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { session: null, user: null }

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return { session: null, user: null }

    return { session, user }
  }

  event.locals = { supabase, safeGetSession }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}