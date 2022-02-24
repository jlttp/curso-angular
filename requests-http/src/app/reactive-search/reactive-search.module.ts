import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveSearchRoutingModule } from './reactive-search-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibSearchComponent } from './lib-search/lib-search.component';


@NgModule({
  declarations: [
    LibSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveSearchRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReactiveSearchModule { }
