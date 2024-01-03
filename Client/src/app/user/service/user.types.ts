import { Gender } from "src/app/auth/enum/gender.enum";
import { LeaderRoles, Regions } from "src/app/services/member.type";

export interface User
{
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    isAdmin?: boolean;
    isActive?: boolean;
    gender?: Gender;
    regions?: Regions;
    comments?: string[];
    createdAt?: Date;
    leaderRoles?: LeaderRoles;
}

export type Users = User[];