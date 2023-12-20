import { Elder } from "./elder.type";
import { Family } from "src/app/services/familes/family.type";

export interface Team {
    _id?: string;
    seq?: string;
    name?: string;
    members?: Elder[];
    families?: Family[];
}

export type Teams = Team[];