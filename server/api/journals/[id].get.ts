import { getJournalEntries, getJournalById } from "../../utils/notion";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Journal ID is required'
            })
        }

        // Get all journals to find the matching entry
        const [journalsList, journalContent] = await Promise.all([
            getJournalEntries(),
            getJournalById(id)
        ])

        // Find the journal entry that matches the pageId
        const journalEntry = journalsList.find((entry: any) => 
            entry.properties?.PageID?.title?.[0]?.plain_text === id
        )

        if (!journalEntry) {
            throw createError({
                statusCode: 404,
                message: 'Journal not found'
            })
        }

        // Transform and combine the data
        const transformedEntry = {
            id: journalEntry.id,
            pageId: journalEntry.properties?.PageID?.title?.[0]?.plain_text || '',
            date: journalEntry.properties?.Date?.date?.start,
            day: journalEntry.properties?.Day?.number || 0,
            leap: journalEntry.properties?.Leap?.number || 0,
            session: journalEntry.properties?.Session?.number || 0,
            characters: journalEntry.properties?.Characters?.multi_select?.map((char: any) => char.name) || [],
            npcs: journalEntry.properties?.NPCs?.multi_select?.map((npc: any) => npc.name) || [],
            locations: journalEntry.properties?.Locations?.multi_select?.map((loc: any) => loc.name) || [],
            content: journalContent.content
        }

        return transformedEntry
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch journal'
        })
    }
}) 