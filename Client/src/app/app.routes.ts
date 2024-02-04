import { Route } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { NoAuthGuard } from './auth/guards/noAuth.guard';

export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    {
        path: 'login',
        loadChildren: () => import('src/app/auth/login/login.routes'),
        canActivate: [NoAuthGuard],
    },
    {
        path: 'register',
        loadChildren: () => import('src/app/auth/register/register.routes'),
        canActivate: [NoAuthGuard],
    },
    {
        path: 'home',
        loadChildren: () => import('src/app/home/home.routes'),
        canActivate: [AuthGuard],
    },
    {
        path: 'logout',
        loadChildren: () => import('src/app/auth/logout/logout.routes'),
        canActivate: [AuthGuard],
    },
    { path: '**', redirectTo: 'home' },
];
