import { getJournalEntries } from '../utils/notion'

export default defineEventHandler(async (event) => {
  try {
    const entries = await getJournalEntries()
    return entries
  } catch (error) {
    throw error
  }
}) 