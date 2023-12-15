
export enum GenderType {
    Male = 'H',
    Female = 'F',
}

export interface Elder {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    isAdmin?: boolean;
    isActive?: boolean;
    refreshToken?: string;
    createdAt?: Date;
    gender?: GenderType;
}

export type Elders = Elder[];