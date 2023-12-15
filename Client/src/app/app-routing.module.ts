import { NgModule, inject } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
// import { SignupComponent } from './auth/signup/signup.component';
// import { ProfileComponent } from './auth/profile/profile.component';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

const routes: Routes = [

  // 1. default route
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },

  { 
    path: 'auth', 
    loadChildren: () => 
    import('src/app/auth/auth.module').then(
      m => m.AuthModule
    ) 
  },
  {
    path: 'home',
    loadChildren: () =>
      import('src/app/home/home.module').then(
        m => m.HomeModule
      )
  },

  // 4. Admin routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
