import { Component } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { BpComponent } from '../bp/bp.component';
import { ElderComponent } from '../elder/elder.component';
import { ElderPastoralComponent } from '../elder-pastoral/elder-pastoral.component';
import { JeuneFillesComponent } from '../jeune-filles/jeune-filles.component';
import { JeuneGensComponent } from '../jeune-gens/jeune-gens.component';
import { PrimaireComponent } from '../primaire/primaire.component';
import { SocieteComponent } from '../societe/societe.component';

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

  ],
})
export class HomeComponent {

  constructor(
    public authService: AuthService,
  ) {}
}
