export default defineEventHandler(async (event) => {
    const { code } = await readBody<{ code: string }>(event)
    const verifier = getCookie(event, 'pkce_verifier') || ''
    console.info('[callback] code', code?.slice(0, 8), 'verifier', verifier.slice(0, 8))
  
    const { public: cfg } = useRuntimeConfig()
  
    try {
      const res = await $fetch<{ access_token: string; refresh_token: string; expires_in: number }>(
        'https://accounts.spotify.com/api/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: cfg.spotifyClientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'http://127.0.0.1:3000/callback',
            code_verifier: verifier
          }).toString()
        }
      )
  
      console.info('[callback] token OK expires', res.expires_in, 's')
  
      setCookie(event, 'access_token', res.access_token, { httpOnly: true, path: '/', maxAge: res.expires_in })
      setCookie(event, 'refresh_token', res.refresh_token, { httpOnly: true, path: '/', maxAge: 30 * 24 * 3600 })
      setCookie(event, 'authed', '1', { httpOnly: false, path: '/', maxAge: 30 * 24 * 3600 })
      return { ok: true }
    } catch (e: any) {
      console.error('[callback] token error', e?.response?._data ?? e)
      throw createError({ statusCode: 500, message: 'token-exchange failed' })
    }
  })
  