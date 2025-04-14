import { Routes } from '@angular/router';
import { FamillyComponent } from '../familly/familly.component';
import { FamiliesResolver } from './family.resolver';
import { ConnectedUserResolver } from '../user/user.resolver';

export default [
    {
        path: '',
        component: FamillyComponent,
        resolve: {
            families$: FamiliesResolver,
            user$: ConnectedUserResolver
        }
    }
] as Routes;