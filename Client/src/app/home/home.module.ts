import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { BpModule } from '../bp/bp.module';
import { ElderModule } from '../elder/elder.module';
import { JeuneFillesModule } from '../jeune-filles/jeune-filles.module';
import { JeuneGensModule } from '../jeune-gens/jeune-gens.module';
import { PrimaireModule } from '../primaire/primaire.module';
import { SocieteModule } from '../societe/societe.module';
import { AuthService } from '../auth/service/auth.service';
import { ElderPastoralModule } from '../elder-pastoral/elder-pastoral.module';
import { ElderSmsMailerModule } from '../elder-sms-mailer/elder-sms-mailer.module';

const routes: Routes = [
  { 
    path:'', 
    component: HomeComponent,
    canActivate: [() => inject(AuthGuard).canActivate] 
  }
  // autres routes d'authentification...
];

@NgModule({
  declarations: [
    HomeComponent,
    
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule.forChild(routes), // register the routes
    BpModule,
    ElderModule,
    ElderPastoralModule,
    ElderSmsMailerModule,
    JeuneFillesModule,
    JeuneGensModule,
    PrimaireModule,
    SocieteModule,

  ],
  providers: [
    AuthService,
  ]
  
})
export class HomeModule { }
