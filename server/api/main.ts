import { getLocations, getCharacters, getJournalEntries, getNpcs } from "../utils/notion";

export default defineEventHandler(async (event) => {
    const [locations, characters, journalEntries, npcs] = await Promise.all([
        getLocations(),
        getCharacters(),
        getJournalEntries(),
        getNpcs()
    ])

    return {
        lastSession: {
            date: journalEntries[0].properties?.Date?.date?.start,
            summary: journalEntries[0].properties?.Summary?.rich_text?.[0]?.plain_text,
            characters: journalEntries[0].properties?.Characters?.multi_select?.map((char: any) => char.name) || [],
            npcs: journalEntries[0].properties?.NPCs?.multi_select?.map((npc: any) => npc.name) || [],
            locations: journalEntries[0].properties?.Locations?.multi_select?.map((loc: any) => loc.name) || [],
            day: journalEntries[0].properties?.Day?.number || 0,
            leap: journalEntries[0].properties?.Leap?.number || 0,
            pageId: journalEntries[0].properties?.PageID?.title?.[0]?.plain_text || ''
        },
        totalSessions: journalEntries.length,
        totalCharacters: characters.length,
        totalNpcs: npcs.length,
        totalLocations: locations.length
    }
})