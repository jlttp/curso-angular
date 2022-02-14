import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { FormsModule } from '@angular/forms';
import { DropdownService } from './service/dropdown.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorMessageComponent } from './error-message/error-message.component';


@NgModule({
  declarations: [
    FormDebugComponent,
    ErrorMessageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    FormDebugComponent,
    ErrorMessageComponent
  ],
  providers: [
    DropdownService
  ]
})
export class SharedModule { }
