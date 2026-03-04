import { Member } from "src/app/services/member.type";
import { Family } from "src/app/services/familes/family.type";

export interface Team {
    _id?: string;
    seq?: number;
    name?: string;
    _members?: Member[];
    _families?: Family[];
}

export type Teams = Team[];