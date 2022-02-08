import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormDebugComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormDebugComponent
  ]
})
export class SharedModule { }
