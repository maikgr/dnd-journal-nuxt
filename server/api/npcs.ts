import { getNpcs } from '../utils/notion'

export default defineEventHandler(async (event) => {
  try {
    const npcs = await getNpcs()
    return npcs
  } catch (error) {
    throw error
  }
})