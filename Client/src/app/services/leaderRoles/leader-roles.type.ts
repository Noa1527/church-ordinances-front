
export enum LeaderRoles {
    BranchPresident = 'Président De Branche',
    EldersQuorum = 'Prêtrise',
    ReliefSociety = 'Société Secours',
    YoungMen = 'Jeunes Gens',
    YoungWomen = 'Jeunes Filles',
    Primary = 'Primaire',
    Member = 'Membre',
}

export interface Role {
    _id?: string;
    roles?: LeaderRoles;
}

export type Roles = Role[];