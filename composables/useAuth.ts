export const useAuth = () => {
  const authed = useState('authed', () => useCookie('authed').value === '1')

  const login = async () => {
    const { url } = await $fetch<{ url: string }>('/api/spotify/login', { method: 'POST' })
    window.location.href = url                    
  }

  return { authed, login }
}
