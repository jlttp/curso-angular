import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { FormsModule } from '@angular/forms';
import { DropdownService } from './service/dropdown.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    FormDebugComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    FormDebugComponent
  ],
  providers: [
    DropdownService
  ]
})
export class SharedModule { }
