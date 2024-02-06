
export interface Ordinance {
    _id: string;
    Baptism: boolean;
    AaronicPriesthood: boolean;
    PriestHood: boolean;
    Initiatory: boolean;
    Endowment: boolean;
    Sealing: boolean;
}

export type Ordinances = Ordinance[];