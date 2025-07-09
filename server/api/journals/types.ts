export interface JournalContent {
    id: string;
    pageId: string;
    date: string;
    day: number;
    leap: number;
    session: number;
    characters: string[];
    npcs: string[];
    locations: string[];
    entityMap: Record<string, any>;
    content: any;
}