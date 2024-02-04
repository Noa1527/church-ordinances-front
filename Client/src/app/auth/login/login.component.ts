import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatOptionModule,
    MatProgressSpinnerModule,
  ],
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
