// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
    storage: {
      cache: {
        driver: 'memory'  // Use memory driver for cache
      }
    }
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
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
    notionEntityAliasDatabaseId: process.env.NOTION_ENTITY_ALIAS_DATABASE_ID,
    notionQuestsDatabaseId: process.env.NOTION_QUESTS_DATABASE_ID,
    notionQuestFactsDatabaseId: process.env.NOTION_QUESTFACTS_DATABASE_ID,
    public: {
      // Public runtime config goes here
    }
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https://*.notion.so', 'https://*.amazonaws.com'],
        'connect-src': ["'self'", 'https://api.notion.com', 'https://chronofell.com', 'https://www.chronofell.com'],
        'default-src': ["'self'", 'https://chronofell.com', 'https://www.chronofell.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com']
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
      title: 'Lyrial\'s Corposcape Journal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A D&D campaign journal by Lyrial Chronofell' },
        { property: 'og:title', content: 'D&D Journal - Lyrial Chronofell' },
        { property: 'og:description', content: 'A D&D campaign journal by Lyrial Chronofell' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://chronofell.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'D&D Journal - Lyrial Chronofell' },
        { name: 'twitter:description', content: 'A D&D campaign journal by Lyrial Chronofell' }
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