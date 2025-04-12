// home.route.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { FamillyComponent } from '../familly/familly.component';
// import { AuthGuard } from '../auth/guards/auth.guard';
// import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: HomeComponent,
        // canActivate: [() => inject(AuthGuard).canActivate] 
    },
] as Routes;