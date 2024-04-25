import { redirect, type Cookies } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "$lib/types/database";
import Tokens from "./tokens";


async function Supabase (cookies: Cookies) {
  const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, { ...options, secure: process.env.ENV! !== 'DEV' }),
      remove: (key, options) => cookies.delete(key, { ...options, secure: process.env.ENV! !== 'DEV' })
    }
  })

  return supabase
}

export function Service () {
  return createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
    cookies: {
      get: undefined,
      set: undefined,
      remove: undefined
    }
  })
}

export default Supabase