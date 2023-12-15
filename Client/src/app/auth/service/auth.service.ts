import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/user/service/user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(
        private http: HttpClient, 
        public jwtHelper: JwtHelperService,
        private userService: UserService,
    ) { }
    
     // Maintenant, currentUser a un tableau de rôles
    // currentUser: any = {
    //     roles: [
    //         'Président De Branche', 
    //         'Prêtrise',
    //         'Société Secours',
    //         'Jeunes Gens',
    //         'Jeunes Filles',
    //         'Primaire',
    //     ] // Ici, remplacez ceci par les rôles actuels de l'utilisateur.
    // };
    currentRole: any = {};

  // Cette méthode vérifie si l'utilisateur a un certain rôle
  public hasRole(role: string): boolean {
    const currentRole = this.curentUser();

    // check if currentUser is valid and if it has the required role
    if (currentRole && currentRole.roles) {
        return currentRole.roles.includes(role);
    }

    // if currentUser is not valid or does not have roles, return false
    return false;
}

    // forgotPassword(email: string): Observable<any> {
    //     return this.http.post<any>('/api/auth/forgot-password', { email });
    // }

    // resetPassword(token: string, newPassword: string): Observable<any> {
    //     return this.http.post<any>(`/api/users/reset-password/${token}`, {
    //         newPassword,
    //     });
    // }

    getAuthorizationToken(): string | null {
        // get the token from local storage
        return localStorage.getItem('access_token');
    }

    register(user: any): Observable<any> {
        return this.http.post<any>('/api/auth/register', user);
    }

    login(email: string, password: string): Observable<any> {
        
        return this.http
            .post<any>('/api/auth/login', { email, password })
            .pipe(tap(response => this.setSession(response.access_token)));
    }
    
    // TO LINK
    // updatePassword(email: string, password: string): Observable<any> {
    //     return this.http
    //         .put<any>('/api/auth/login', { email, password })
    //         .pipe(tap(this.setSession));
    // }

    setSession(token: string): void {
        // set the token in local storage
        localStorage.setItem('access_token', token);
    }

    magicSignIn(input: { email: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this.isLoggedIn() === true)
        {
            throw throwError('L\'utilisateur est déjà connecté.');
        }
        return this.http.post<any>('/api/auth/magic-sign-in', input).pipe(
            switchMap((response: any) => of(response))
        );
    }

    verifyMagicSignIn(token: string): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this.isLoggedIn() )
        {
            return throwError('L\'utilisateur est déjà connecté.');
        }

        return this.http.post('/api/auth/verify-magic-sign-in', { token }).pipe(
            
            switchMap((response: any) => {

                // store in local storage
                this.setSession(response.access_token);

                // Store the user on the user service
                response = {
                    access_token: response.access_token,
                    expires_in: response.expires_in,
                    user: response.user._doc
                }
                this.userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    public signOut(): void {
        localStorage.removeItem('access_token');
    }

    public isLoggedIn(): boolean {
        // get the token from local storage
        const token = this.getAuthorizationToken();
        // check if token is set, then check if token is valid
        if (!token) {
            return false;
        }
        try {
            const isExpired = this.jwtHelper.isTokenExpired(token);
            return !isExpired;
        } catch (e) {
            return false;
        }
    }

    public isAdmin(): boolean {
        const token = this.getAuthorizationToken();
        // check if token is set, then check if token is valid
        if (!token || this.jwtHelper.isTokenExpired(token)) {
            return false;
        }
        // get the decoded token and its data to check if the user is an admin
        const decoded = this.jwtHelper.decodeToken(token);
        
        return decoded.isAdmin;
    }

    public curentUser(): any {
        const token = this.getAuthorizationToken();
        // check if token is set, then check if token is valid
        if (!token || this.jwtHelper.isTokenExpired(token)) {
            return false;
        }
        // get the decoded token and its data to check if the user is an admin  
        const decoded = this.jwtHelper.decodeToken(token);
        return decoded;
    }

    // public hasRole(role: string): boolean {
    //     const token = this.getAuthorizationToken();
    //     // check if token is set, then check if token is valid
    //     if (!token || this.jwtHelper.isTokenExpired(token)) {
    //         return false;
    //     }
    //     // get the decoded token and its data to check if the user is an admin
    //     const decoded = this.jwtHelper.decodeToken(token);
    //     console.log('decoded', decoded);
    //     console.log('decoded.roles', decoded.roles);
    //     console.log('decoded.roles.includes(role)', decoded.roles.includes(role));
        
        
    //     return decoded.roles.includes(role);
    // }

    logout(): void {
        localStorage.removeItem('access_token');
    }

}
