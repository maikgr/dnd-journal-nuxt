export interface LocationInfo {
    name: string;  // Name should be required
    description?: string;  // Description can be optional
    notes?: string;  // Notes can be optional
}

export type LocationsByType = {
    [key: string]: LocationInfo[];
}