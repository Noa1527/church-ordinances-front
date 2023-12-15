import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpComponent } from './bp.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MemberDialogModule } from '../components/member-dialog/member-dialog.module';



@NgModule({
  declarations: [
    BpComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MemberDialogModule,
  ],
  exports: [
    BpComponent,
  ],
})
export class BpModule { }
