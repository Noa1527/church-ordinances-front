import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
