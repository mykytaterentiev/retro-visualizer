import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const { public: cfg } = useRuntimeConfig()

  const verifier = crypto.randomBytes(32).toString('base64url')
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')

  setCookie(event, 'pkce_verifier', verifier, { httpOnly: true, path: '/', maxAge: 300 })
  console.info('[login]   set pkce_verifier cookie', verifier.slice(0, 8))

  const params = new URLSearchParams({
    client_id: cfg.spotifyClientId,
    response_type: 'code',
    redirect_uri: 'http://127.0.0.1:3000/callback',
    scope: 'user-read-private user-top-read playlist-read-private user-modify-playback-state streaming',
    code_challenge_method: 'S256',
    code_challenge: challenge
  })

  const url = `https://accounts.spotify.com/authorize?${params}`
  console.info('[login]   redirect →', url)

  return { url }
})
