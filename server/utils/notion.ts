import { Client } from '@notionhq/client'
import { useRuntimeConfig } from '#imports'

let notionClient: Client | null = null

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
    const response = await notion.databases.query({
      database_id: config.notionDatabaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    })
    
    return response.results
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch journal entries'
    })
  }
} 