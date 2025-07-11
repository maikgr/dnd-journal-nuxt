import { getJournalEntries, getJournalById, getEntityAlias, getCharacters, getLocations, getNpcs } from "../../utils/notion";
import type { NotionResponse } from "../../utils/types";
import type { PageObjectResponse } from "@notionhq/client";
import { JournalContent } from "./types";

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
        const [journalsList, journalContent, entityAlias, rawCharacters, rawLocations, rawNpcs] = await Promise.all([
            getJournalEntries(),
            getJournalById(id),
            getEntityAlias(),
            getCharacters(),
            getLocations(),
            getNpcs()
        ])

        // Find the journal entry that matches the pageId
        const journalEntry = journalsList.find((entry: any) => {
            return entry.properties?.PageID?.title?.[0]?.plain_text === id
        })

        if (!journalEntry) {
            throw createError({
                statusCode: 404,
                message: 'Journal not found'
            })
        }

        const characters: Map<string, any> = rawCharacters.reduce((acc, char) => {
            char = char as PageObjectResponse
            if (!('properties' in char)) {
                console.warn('Character missing properties:', char);
                return acc;
            }

            const class1 = char.properties.Class1.rich_text[0]?.plain_text?.split(' ')[0]
            const level1 = char.properties.Level1?.number
            const class2 = char.properties.Class2.rich_text[0]?.plain_text?.split(' ')[0]
            const level2 = char.properties.Level2?.number
            let charClass = `${class1} ${level1}`
            if (class2 && level2) {
                charClass += ` / ${class2} ${level2}`
            }
            acc.set(char.id, {
                id: char.id,
                charClass,
                name: char.properties.Name.title[0].plain_text,
                species: char.properties.Species.rich_text[0]?.plain_text,
                occupation: char.properties.Occupation.rich_text[0]?.plain_text,
                flavor: char.properties.Flavor.rich_text[0]?.plain_text,
            })
            return acc
        }, new Map<string, any>())

        const locations: Map<string, any> = rawLocations.reduce((acc, loc) => {
            try {
                acc.set(loc.id, {
                    id: loc.id,
                    name: loc.properties.Name.title[0].plain_text,
                    description: loc.properties.Description.rich_text[0]?.plain_text,
                    tagline: loc.properties.Tagline?.rich_text[0]?.plain_text,
                });
            } catch (error) {
                console.error('Error processing location:', loc, error);
            }
            return acc;
        }, new Map<string, any>())

        const npcs: Map<string, any> = rawNpcs.reduce((acc, npc) => {
            try {
                acc.set(npc.id, {
                    id: npc.id,
                    name: npc.properties.Name.title[0].plain_text,
                    description: npc.properties.Description.rich_text[0]?.plain_text,
                });
            } catch (error) {
                console.error('Error processing NPC:', npc, error);
            }
            return acc;
        }, new Map<string, any>())

        const entityMap = entityAlias.reduce((acc, data) => {
            try {
                const entityType = data.properties?.Type?.select?.name;
                if (!entityType) {
                    console.warn('Entity missing type:', data);
                    return acc;
                }
        
                let entityData;
                let entityId;
        
                switch(entityType) {
                    case 'Character':
                        entityId = data.properties['Player Characters']?.relation?.[0]?.id;
                        if (!entityId) {
                            console.warn('Character alias missing:', data.properties.Name.title[0].plain_text);
                            return acc;
                        }
                        entityData = characters.get(entityId);
                        break;
                    case 'NPC':
                        entityId = data.properties['NPC']?.relation?.[0]?.id;
                        if (!entityId) {
                            console.warn('NPC alias missing:', data.properties.Name.title[0].plain_text);
                            return acc;
                        }
                        entityData = npcs.get(entityId);
                        break;
                    case 'Location':
                        entityId = data.properties['Locations']?.relation?.[0]?.id;
                        if (!entityId) {
                            console.warn('Location alias missing:', data.properties.Name.title[0].plain_text);
                            return acc;
                        }
                        entityData = locations.get(entityId);
                        break;
                    default:
                        console.warn('Unknown entity type:', entityType, data);
                        return acc;
                }
        
                if (!entityData) {
                    console.warn(`Could not find ${entityType} data for "${entityId}"`);
                    return acc;
                }
        
                const alias = data.properties?.Name?.title?.[0]?.plain_text;
                acc[alias] = {
                    ...entityData,
                    type: entityType.toLowerCase()
                };
            } catch (error) {
                console.error('Error processing entity:', data, error);
            }
            return acc;
        }, {} as Record<string, any>);

        // Transform and combine the data
        const transformedEntry: JournalContent = {
            id: journalEntry.id,
            pageId: journalEntry.properties?.PageID?.title?.[0]?.plain_text || '',
            date: journalEntry.properties?.Date?.date?.start,
            day: journalEntry.properties?.Day?.number || 0,
            leap: journalEntry.properties?.Leap?.number || 0,
            session: journalEntry.properties?.Session?.number || 0,
            characters: journalEntry.properties?.Characters?.multi_select?.map((char: any) => char.name) || [],
            npcs: journalEntry.properties?.NPCs?.multi_select?.map((npc: any) => npc.name) || [],
            locations: journalEntry.properties?.Locations?.multi_select?.map((loc: any) => loc.name) || [],
            entityMap,
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