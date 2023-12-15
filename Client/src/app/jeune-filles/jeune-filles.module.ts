import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JeuneFillesComponent } from './jeune-filles.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    JeuneFillesComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    JeuneFillesComponent,
  ],
})
export class JeuneFillesModule { }
