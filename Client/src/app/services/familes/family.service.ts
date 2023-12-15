import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/user/service/user.service';
import { Families, Family } from './family.type';

@Injectable({
    providedIn: 'root',
})
export class FamilyService {

    constructor(
        private http: HttpClient, 
        public jwtHelper: JwtHelperService,
        private _userService: UserService,
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


    findAllFamily(): Observable<Families> {
        return this.http.get<Families>('/api/family').pipe(
          tap((families: Families) => {
            this._families.next(families);
          })
        );
    }

    // findLeaders(): Observable<Families> {
    //     return this.http.get<Families>('/api/member/leaders').pipe(
    //       tap((leaders: any) => {
    //         this._families.next(leaders);
    //       })
    //     );
    // }
      
    // getAllMembers(): Observable<Families> {
    //     return this.http.get<Families>('/api/member').pipe(
    //       tap((members: any) => {
    //         this._families.next(members);
    //       })
    //     );
    // }
    // findWomenLeaders(): Observable<Families> {
    //     return this.http.get<Families>('/api/member/WomenLeaders').pipe(
    //         tap((leaders: any) => {
    //             this.members = leaders;
    //         })
    //     );
    // }

    // getAllMembersByRoleBP(role: string): Observable<any> {
    //     return this.http.get<any>(`/api/member/${role}`);
    // }
    // getAllMembersByRolemember(role: string): Observable<any> {
    //     return this.http.get<any>(`/api/member/${role}`);
    // }

}
