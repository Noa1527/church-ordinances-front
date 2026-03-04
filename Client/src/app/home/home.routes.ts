// home.route.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AllMembersResolver, MembersResolver, sistersResolver } from '../services/member.resolver';
import { GetLeadersResolver } from '../elder-pastoral/elder-pastoral.resolver';
import { FamiliesResolver } from '../familly/family.resolver';
import { GetTeamsResolver } from '../elder-pastoral/services/elder-pastoral.resolver';

export default [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            womenLeaders$ : sistersResolver,
            allMembers$: AllMembersResolver,
            members$: MembersResolver,
            elders$: GetLeadersResolver,
            families$: FamiliesResolver,
            teams$: GetTeamsResolver
        }
        // canActivate: [() => inject(AuthGuard).canActivate] 
    },
] as Routes;