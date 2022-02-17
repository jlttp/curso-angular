import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  formulario!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  abstract submit(): void;

  onSubmit(){
    if(this.formulario.valid){
      this.submit();
    }else{
      console.log('Formulário inválido');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray){
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if(controle instanceof FormGroup || controle instanceof FormArray){
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: string){
    return(
      !this.formulario.get(campo)?.valid &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    );
  }

  verificaRequired(campo: string){
    return(
      this.formulario.get(campo)?.hasError('required') &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    );
  }

  verificaEmailInvalido(){
    const campoEmail = this.formulario.get('email');
    if(!!campoEmail?.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo: string){
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }

  getCampo(campo: string){
    return this.formulario.get(campo);
  }

}
