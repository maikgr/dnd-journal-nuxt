import { getCharacters } from '../utils/notion'

export default defineEventHandler(async (event) => {
    try {
        const characters = await getCharacters()
        return characters
    } catch (error: any) {
        console.error('Characters API Error:', {
            message: error.message,
            code: error.code,
            status: error.status,
            body: error.body
        })
        
        throw createError({
            statusCode: error.status || 500,
            message: `Failed to fetch characters: ${error.message}`,
            cause: error
        })
    }
})