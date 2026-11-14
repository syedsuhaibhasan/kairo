const conf = {
    projectUrl: String(import.meta.env.VITE_SUPABASE_URL),
    publishableKey: String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
    googleClientId: String(import.meta.env.VITE_GOOGLE_CLIENT_ID)
}

export default conf;        