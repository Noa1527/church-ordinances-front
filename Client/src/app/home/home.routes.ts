// home.route.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { sistersResolver } from '../services/member.resolver';

export default [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            womenLeaders$ : sistersResolver
        }
        // canActivate: [() => inject(AuthGuard).canActivate] 
    },
] as Routes;