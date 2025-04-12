import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Families, Family } from './family.type';
import { Regions } from '../member.type';

@Injectable({
    providedIn: 'root',
})
export class FamilyService {

    constructor(
        private http: HttpClient, 
        public jwtHelper: JwtHelperService,
    ) { }

    private _families: BehaviorSubject<Families | null> = new BehaviorSubject<Families | null>(null);
    private _family: BehaviorSubject<Family | null> = new BehaviorSubject<Family | null>(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Setter & getter for client
     *
     * @param value
     */
    set family(value: Family) {
        this._family.next(value);
    }
    set families(value: Families) {
        this._families.next(value);
    }
    get families$(): Observable<Families | null> {
        return this._families.asObservable();
    }

    get family$(): Observable<Family | null> {
        return this._family.asObservable();
    }

    findAllFamily(region: Regions): Observable<Families> {
        return this.http.get<Families>('/api/family', { params: { region } }).pipe(
          tap((families: Families) => {
            this._families.next(families);
          })
        );
    }

    public deleteFamily(id: string, region: Regions): Observable<any> {
        return this.http.delete<any>(`/api/family/${id}`).pipe(
            tap((res: any)=> {
                this.findAllFamily(region).subscribe()
            })
        )
    }
}
