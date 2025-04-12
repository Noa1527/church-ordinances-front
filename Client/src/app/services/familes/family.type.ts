import { Regions } from "../member.type";

export interface Family {
    _id: string;
    name: string;
    region: Regions;
    code?: string;
    isDeleted?: boolean
}

export type Families = Family[];