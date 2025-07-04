// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-security'
  ],
  runtimeConfig: {
    notionApiKey: process.env.NOTION_API_KEY,
    notionSessionsDatabaseId: process.env.NOTION_SESSIONS_DATABASE_ID,
    notionCharactersDatabaseId: process.env.NOTION_CHARACTERS_DATABASE_ID,
    notionMainPageId: process.env.NOTION_MAIN_PAGE_ID,
    notionSessionPageId: process.env.NOTION_SESSION_PAGE_ID,
    public: {
      // Public runtime config goes here
    }
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https://*.notion.so', 'https://*.amazonaws.com'],
        'connect-src': ["'self'", 'https://api.notion.com']
      }
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 'hour'
    }
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  app: {
    head: {
      title: 'D&D Journal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A D&D campaign journal by Lyrial Chronofell' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})