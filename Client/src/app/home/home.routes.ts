// home.route.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AllMembersResolver, MembersResolver, sistersResolver } from '../services/member.resolver';

export default [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            womenLeaders$ : sistersResolver,
            allMembers$: AllMembersResolver,
            members$: MembersResolver
        }
        // canActivate: [() => inject(AuthGuard).canActivate] 
    },
] as Routes;