import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role, Roles} from './leader-roles.type';

@Injectable({
    providedIn: 'root',
})
export class LeaderRoleService {

    constructor(
        private http: HttpClient, 
        public jwtHelper: JwtHelperService,
    ) { }

    private _roles: BehaviorSubject<Roles | null> = new BehaviorSubject<Roles | null>(null);
    private _role: BehaviorSubject<Role | null> = new BehaviorSubject<Role | null>(null);
    

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Setter & getter for client
     *
     * @param value
     */
    set role(value: Role) {
        // Store the value
        this._role.next(value);
    }
    
    set roles(value: Roles) {
        // Store the value
        this._roles.next(value);
    }

    get roles$(): Observable<Roles | null> {
        console.log('_roles', this._roles);
        return this._roles.asObservable();
    }

    get role$(): Observable<Role | null> {
        return this._role.asObservable();
    }

    public findRoles(): Observable<Roles> {
        return this.http.get<Roles>('/api/leader-role').pipe(
          tap((roles: any) => {
            this._roles.next(roles);
          })
        );
    }

    public findRole(id: string): Observable<Role> {
        return this.http.get<Role>(`/api/leader-role/${id}`).pipe(
          tap((role: any) => {
            this.role = role;
          })
        );
    }
}