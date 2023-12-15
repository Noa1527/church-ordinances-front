import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showAlert = false;
  alert = {
    type: '',
    message: '',
  };

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      "Eye",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/svg/Eye.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "EyeSlash",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/svg/EyeSlash.svg")
    );
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // rememberMe: ['']
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.showAlert = true;
      this.alert = {
        type: 'error',
        message: 'Please fill in all required fields correctly.',
      };
      return;
    }

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
    .pipe(
      tap(response => {
        // handle response here
        // redirect user to home page or another page
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        this.showAlert = true;
        this.alert = {
          type: 'error',
          message: error.error.message,
        };
        // Retourner un observable pour continuer le flux
        return of(error);
      })
    ).subscribe();
  }
  
  signUp(): void {
    this.router.navigate(['/register']);
  }
}
