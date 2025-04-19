import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { BpComponent } from 'src/app/bp/bp.component';
import { ElderComponent } from 'src/app/elder/elder.component';
import { ElderPastoralComponent } from 'src/app/elder-pastoral/elder-pastoral.component';
import { JeuneFillesComponent } from 'src/app/jeune-filles/jeune-filles.component';
import { JeuneGensComponent } from 'src/app/jeune-gens/jeune-gens.component';
import { PrimaireComponent } from 'src/app/primaire/primaire.component';
import { SocieteComponent } from 'src/app/societe/societe.component';
import { EmailComponent } from 'src/app/email/email.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    BpComponent,
    ElderComponent,
    ElderPastoralComponent,
    JeuneFillesComponent,
    JeuneGensComponent,
    PrimaireComponent,
    SocieteComponent,
    EmailComponent,
  ],
})
export class HomeComponent {

  constructor(
    public authService: AuthService,
  ) {}
}
