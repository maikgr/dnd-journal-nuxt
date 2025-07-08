// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-security'
  ],
  tailwindcss: {
    viewer: true
  },
  runtimeConfig: {
    notionApiKey: process.env.NOTION_API_KEY,
    notionSessionsDatabaseId: process.env.NOTION_SESSIONS_DATABASE_ID,
    notionCharactersDatabaseId: process.env.NOTION_CHARACTERS_DATABASE_ID,
    notionMainPageId: process.env.NOTION_MAIN_PAGE_ID,
    notionSessionPageId: process.env.NOTION_SESSION_PAGE_ID,
    notionNpcPageId: process.env.NOTION_NPC_PAGE_ID,
    notionLocationDatabaseId: process.env.NOTION_LOCATION_DATABASE_ID,
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Roboto+Slab:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Source+Serif+Pro:wght@300;400;600;700&display=swap'
        }
      ]
    }
  }
})