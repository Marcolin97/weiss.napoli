export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/image'], // <-- commenta hints + a11y
  app: {
    head: {
      htmlAttrs: { lang: 'it' },
      title: 'Weiss Napoli',
      meta: [
        { name: 'description', content: 'Weiss Napoli official website' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
