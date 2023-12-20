import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElderPastoralComponent } from './elder-pastoral.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ElderPastoralComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
  ],
  exports: [
    ElderPastoralComponent
  ]
})
export class ElderPastoralModule { }
