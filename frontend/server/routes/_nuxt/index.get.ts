import { setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  // Some clients/extensions probe the Nuxt assets directory itself ("/_nuxt/")
  // which does not have an index file. Returning 204 avoids noisy 404 stack logs
  // while not interfering with real asset requests like "/_nuxt/*.js".
  setResponseStatus(event, 204)
  return ''
})
