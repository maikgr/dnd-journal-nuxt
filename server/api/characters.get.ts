import { getCharacters } from '../utils/notion'

export default defineEventHandler(async (event) => {
    try {
        const characters = await getCharacters()
        return characters
    } catch (error) {
        throw error
    }
})