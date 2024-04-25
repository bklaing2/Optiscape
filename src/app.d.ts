import 'unplugin-icons/types/svelte'
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from '$lib/types/database'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: null; user: null; } | { session: Session; user: User | null; }>;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};