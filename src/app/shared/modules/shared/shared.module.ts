import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
      code: ''
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CodeInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
