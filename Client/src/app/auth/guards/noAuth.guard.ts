import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) { // Vérifiez si l'utilisateur n'est pas connecté
      return true;
    } else {
      this.router.navigate(['/home']); // Redirigez l'utilisateur vers la page d'accueil s'il est déjà authentifié
      return false;
    }
  }
}