export interface Family {
    _id: string;
    name: string;
    region: string;
    code?: string;
}

export type Families = Family[];