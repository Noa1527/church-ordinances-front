import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { catchError, of, tap } from 'rxjs';

@Component({
    selector     : 'magic-login',
    templateUrl  : './magic-login.component.html',
    styleUrls: ['./magic-login.component.css']
})
export class MagicLoginComponent implements OnInit
{
    magicLoginForm!: FormGroup;
    showAlert = false;
    alert = {
        type: '',
        message: '',
    };

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
    ){ }

    ngOnInit(): void
    {
        this.magicLoginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    magicLogin(): void
    {
        if (this.magicLoginForm.invalid) {
            this.showAlert = true;
            this.alert = {
              type: 'error',
              message: 'Veuillez remplir le champn email correctement.',
            };
            return;
        }
        
        this.authService.magicSignIn(this.magicLoginForm.value).pipe(
            tap(() => {
              this.alert = {
                type: 'success',
                message: 'Connexion magique confirmée',
              };
              this.showAlert = true;
            }),
            catchError((error: HttpErrorResponse) => {
              this.alert = {
                type: 'error',
                message: 'Une erreur inconnue s\'est produite',
              };
              this.showAlert = true;
              return of(error);
            })
        ).subscribe();
    }
}
