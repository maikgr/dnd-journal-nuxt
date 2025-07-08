import { getLocations } from "../utils/notion";

export default defineEventHandler(async (event) => {
  try {
    const locations = await getLocations()
    return locations
  } catch (error) {
    throw error
  }
})