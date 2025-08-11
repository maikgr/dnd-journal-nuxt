import { getLocations, getCharacters, getJournalEntries, getNpcs, getQuests, getQuestFacts } from "../utils/notion";

export default defineEventHandler(async (event) => {
    const [locations, characters, journalEntries, npcs, rawQuests, rawQuestFacts] = await Promise.all([
        getLocations(),
        getCharacters(),
        getJournalEntries(),
        getNpcs(),
        getQuests(),
        getQuestFacts()
    ])

    const quests = rawQuests.map((quest) => {
        const questFacts = rawQuestFacts.filter((fact) => fact.properties['Quest']?.relation?.[0]?.id === quest.id)
        return {
            id: quest.id,
            name: quest.properties.Name.title[0].plain_text,
            number: quest.properties.Number.number,
            nextSteps: quest.properties['Next Steps']?.rich_text[0]?.plain_text,
            facts: questFacts.map((fact) => ({
                id: fact.id,
                sessionId: fact.properties['SessionID']?.title[0]?.plain_text,
                sessionDate: fact.properties['SessionDate']?.date?.start,
                summary: fact.properties['Summary']?.rich_text[0]?.plain_text,
            }))
        }
    }).sort((a, b) => a.number - b.number)


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
        totalLocations: locations.length,
        quests,
    }
})