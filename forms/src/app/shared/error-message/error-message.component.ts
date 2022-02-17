import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormValidations } from '../form-validations';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {

  @Input() msgErro?: string;
  @Input() mostrarErro?: boolean;

  @Input() control!: any; // FormControl;
  @Input() label!: string;

  constructor() { }

  ngOnInit(): void {
  }

  get errorMessage(){

    for(const propertyName in this.control?.errors){
      //console.log(`property name ${propertyName}`);
      if(this.control?.errors.hasOwnProperty(propertyName) && this.control.touched){
        //console.log('entrou');
        //console.log(this.label);
        //console.log(propertyName);
        //console.log(this.control.errors[propertyName]);
        return FormValidations.getErrorMsg(this.label, propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }

}
