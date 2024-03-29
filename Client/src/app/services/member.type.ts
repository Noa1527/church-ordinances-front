import { Blessing } from "./blessings/blessing.type";
import { Family } from "./familes/family.type";
import { Role } from "./leaderRoles/leader-roles.type";
import { Ordinance } from "./ordinaces/ordinance.type";

export enum GenderType {
    Male = 'H',
    Female = 'F',
}

export enum LeaderRoles {
    BranchPresident = 'Président De Branche',
    EldersQuorum = 'Prêtrise',
    ReliefSociety = 'Société Secours',
    YoungMen = 'Jeunes Gens',
    YoungWomen = 'Jeunes Filles',
    Primary = 'Primaire',
    Member = 'Membre',
}

export enum Regions {
    Toul = 'Toul',
    Cholet = 'Cholet',
}

export interface Member {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: Date;
    aaronicPriesthoodReception?: Date;
    phone?: string;
    comments?: string[];
    leaderRoles?: Role;
    ordinance?: Ordinance;
    _blessing?: Blessing;
    gender?: GenderType
    regions?: Regions;
    _family?: Family;
}

export type Members = Member[];