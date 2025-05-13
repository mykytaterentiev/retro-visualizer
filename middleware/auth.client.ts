// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const authed = useCookie('authed').value === '1'
  /* eslint-disable no-console */
  console.log('[guard]', { from: useRouter().currentRoute.value.fullPath, to: to.fullPath, authed })
  /* eslint-enable  no-console */

  if (!authed && !['/', '/callback'].includes(to.path)) return navigateTo('/')
})
