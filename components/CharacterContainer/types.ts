export type CharacterStats ={
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
}

export interface CharacterInfo {
    id: string
    name: string
    pronouns: string
    species: string
    class1: string
    level1: string
    class2: string | null,
    level2: string | null,
    hp: number,
    stats: CharacterStats
}