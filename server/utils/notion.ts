import { Client } from '@notionhq/client'
import { useRuntimeConfig } from '#imports'
import { createStorage } from 'unstorage'
import { CACHE_KEY } from './values'
import type { NotionResponse } from './types'
import memoryDriver from 'unstorage/drivers/memory'

let notionClient: Client | null = null

const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

// Initialize storage with memory driver which works everywhere
const storage = createStorage({
  driver: memoryDriver()
})

export function getNotionClient() {
  if (!notionClient) {
    const config = useRuntimeConfig()
    notionClient = new Client({
      auth: config.notionApiKey,
      fetch: (url, init) => {
        // Bind fetch to the global context
        return fetch(url, {
          ...init,
          // Ensure headers are properly merged
          headers: {
            ...init?.headers,
            'Notion-Version': '2022-06-28', // Use stable version
          }
        })
      }
    })
  }
  return notionClient
}

export async function getJournalEntries() {
  const notion = getNotionClient()
  const config = useRuntimeConfig()
  
  try {
    // Try to get from cache first
    const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.JOURNALS)
    if (cached) {
      // Check if cache is still valid
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data
      }
    }

    // If no cache or expired, fetch from Notion
    const response = await notion.databases.query({
      database_id: config.notionSessionsDatabaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    })
    
    // Cache the new results
    const cacheEntry: CacheEntry<NotionResponse[]> = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.JOURNALS, cacheEntry)
    
    return response.results
  } catch (error) {
    // If error occurs and we have cached data, return it as fallback
    const cached = await storage.getItem<CacheEntry<NotionResponse[]>>(CACHE_KEY.JOURNALS)
    if (cached) {
      console.warn('Using cached data for sessions due to Notion API error')
      return cached.data
    }

    console.error('Error fetching journal entries:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch journal entries'
    })
  }
} 

export async function getCharacters() {
  const notion = getNotionClient()
  const config = useRuntimeConfig()

  if (!config.notionCharactersDatabaseId) {
    throw createError({
      statusCode: 500,
      message: 'Notion Characters Database ID is not configured'
    })
  }

  const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.CHARACTERS)
  try {
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    console.log('Fetching characters from Notion:', {
      databaseId: config.notionCharactersDatabaseId
    })

    const response = await notion.databases.query({
      database_id: config.notionCharactersDatabaseId,
    })

    const cacheEntry: CacheEntry<any[]> = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.CHARACTERS, cacheEntry)

    // Also cache each character individually
    for (const char of response.results) {
      const charCacheEntry: CacheEntry<any> = {
        data: char,
        timestamp: Date.now()
      }
      await storage.setItem(`${CACHE_KEY.CHARACTERS}-${char.id}`, charCacheEntry)
    }

    return response.results
  } catch (error: any) {
    console.error('Notion API Error in getCharacters:', {
      message: error.message,
      code: error.code,
      status: error.status,
      body: error.body,
      databaseId: config.notionCharactersDatabaseId
    })

    if (cached) {
      console.warn('Using cached data for characters due to Notion API error')
      return cached.data
    }

    throw error
  }
}

export async function getCharacterById(id: string) {
  const notion = getNotionClient()
  
  const cached = await storage.getItem<CacheEntry<any>>(`${CACHE_KEY.CHARACTERS}-${id}`)
  try {
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    const response = await notion.pages.retrieve({
      page_id: id,
    })
    
    const cacheEntry: CacheEntry<any> = {
      data: response,
      timestamp: Date.now()
    }
    await storage.setItem(`${CACHE_KEY.CHARACTERS}-${id}`, cacheEntry)

    return response
  }
  catch (error) {
    if (cached) {
      console.warn('Using cached data for character due to Notion API error')
      return cached.data
    }

    console.error('Error fetching character by ID:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch character by ID'
    })
  }
}

export async function getNpcs() {
  const notion = getNotionClient()
  const config = useRuntimeConfig()

  try {
    const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.NPCS)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    const response = await notion.databases.query({
      database_id: config.notionNpcPageId,
    })

    const cacheEntry: CacheEntry<any[]> = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.NPCS, cacheEntry)

    return response.results
  } catch (error) {
    const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.NPCS)
    if (cached) {
      console.warn('Using cached data for NPCs due to Notion API error')
      return cached.data
    }

    console.error('Error fetching NPCs:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch NPCs database'
    })
  }
}

export async function getLocations() {
  const notion = getNotionClient()
  const config = useRuntimeConfig()

  try {
    const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.LOCATIONS)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await notion.databases.query({
      database_id: config.notionLocationDatabaseId,
    })

    const cacheEntry: CacheEntry<any[]> = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.LOCATIONS, cacheEntry)

    return response.results
  } catch (error) {
    const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.LOCATIONS)
    if (cached) {
      console.warn('Using cached data for locations due to Notion API error')
      return cached.data
    }

    console.error('Error fetching locations:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch locations database'
    })
  }
}

export const getJournalById = async (id: string) => {
  const notion = getNotionClient()
  
    try {
        const response = await notion.pages.retrieve({
            page_id: id
        })

        // Get the page content (blocks)
        const blocks = await notion.blocks.children.list({
            block_id: id,
            page_size: 100,
        })

        return {
            id: response.id,
            properties: response,
            content: blocks.results
        }
    } catch (error) {
        console.error('Error fetching journal by ID:', error)
        throw error
    }
}

export const getEntityAlias = async () => {
  const notion = getNotionClient()
  const config = useRuntimeConfig()

  try {
    const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.ENTITY_ALIAS)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    const response = await notion.databases.query({
      database_id: config.notionEntityAliasDatabaseId,
    })
    const cacheEntry: CacheEntry<any[]> = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.ENTITY_ALIAS, cacheEntry)

    return response.results
  } catch (error) {
    const cached = await storage.getItem<CacheEntry<any[]>>(CACHE_KEY.ENTITY_ALIAS)
    if (cached) {
      console.warn('Using cached data for entity alias due to Notion API error')
      return cached.data
    }

    console.error('Error fetching entity alias:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch entity alias database'
    })
  }
}