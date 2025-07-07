import { Client } from '@notionhq/client'
import { useRuntimeConfig } from '#imports'
import { createStorage } from 'unstorage'
import { CACHE_KEY } from './values'
import fsDriver from 'unstorage/drivers/fs'

let notionClient: Client | null = null

const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

interface CacheEntry {
  data: any[]
  timestamp: number
}

// Initialize storage
const storage = createStorage({
  driver: fsDriver({ base: './.cache' })
})

export function getNotionClient() {
  if (!notionClient) {
    const config = useRuntimeConfig()
    notionClient = new Client({
      auth: config.notionApiKey,
    })
  }
  return notionClient
}

export async function getJournalEntries() {
  const notion = getNotionClient()
  const config = useRuntimeConfig()
  
  try {
    // Try to get from cache first
    const cached = await storage.getItem<CacheEntry>(CACHE_KEY.JOURNALS)
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
    const cacheEntry: CacheEntry = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.JOURNALS, cacheEntry)
    
    return response.results
  } catch (error) {
    // If error occurs and we have cached data, return it as fallback
    const cached = await storage.getItem<CacheEntry>(CACHE_KEY.JOURNALS)
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

  try {
    const cached = await storage.getItem<CacheEntry>(CACHE_KEY.CHARACTERS)
    if (cached) {
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data
      }
    }

    const response = await notion.databases.query({
      database_id: config.notionCharactersDatabaseId,
    })

    const cacheEntry: CacheEntry = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.CHARACTERS, cacheEntry)

    return response.results
  } catch (error) {
    const cached = await storage.getItem<CacheEntry>(CACHE_KEY.CHARACTERS)
    if (cached) {
      console.warn('Using cached data for characters due to Notion API error')
      return cached.data
    }

    console.error('Error fetching characters:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch characters database'
    })
  }
}

export async function getNpcs() {
  const notion = getNotionClient()
  const config = useRuntimeConfig()

  try {
    const cached = await storage.getItem<CacheEntry>(CACHE_KEY.NPCS)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    const response = await notion.databases.query({
      database_id: config.notionNpcPageId,
    })

    const cacheEntry: CacheEntry = {
      data: response.results,
      timestamp: Date.now()
    }
    await storage.setItem(CACHE_KEY.NPCS, cacheEntry)

    return response.results
  } catch (error) {
    const cached = await storage.getItem<CacheEntry>(CACHE_KEY.NPCS)
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