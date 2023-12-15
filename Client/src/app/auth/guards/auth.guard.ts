import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
    constructor(private authService: AuthService,private router: Router) { }  // Injectez le service Router ici

  canActivate: CanActivateFn = (route, state) => {
   if (this.authService.isLoggedIn()) { // Récupérez l'état de connexion de l'utilisateur ici
      return true;
    } else {
      this.router.navigate(['/login']); // Redirigez l'utilisateur vers la page de connexion s'il n'est pas authentifié
      return false;
    }
  }
}
