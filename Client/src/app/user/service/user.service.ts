import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from './user.types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

   /**
     * Constructor
     */
   constructor(private http: HttpClient){}

   // -----------------------------------------------------------------------------------------------------
   // @ Accessors
   // -----------------------------------------------------------------------------------------------------

   /**
    * Setter & getter for user
    *
    * @param value
    */
   set user(value: User)
   {
       // Store the value
       this._user.next(value);
   }

   get user$(): Observable<User>
   {
       return this._user.asObservable();
   }
}
