import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    /*
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    });
    */

   this.formulario = this.formBuilder.group({
     nome: [null, [Validators.required]],
     email: [null, [Validators.required, Validators.email]]
   });

    // para email: Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    // [Validators.required, Validators.minLength(3), Validators.maxLength(20)]

  }

  onSubmit(){

    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(dados => {
        console.log(dados);
        //reseta o form
        this.resetar();
      }, (error: any) => {
        alert(error.message);
      });

  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: any){
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }

  /*
  verificaEmailInvalido(){
    if(this.formulario.get('email')?.errors){
      return this.formulario.get('email')?.errors['email'] && this.formulario.get('email')?.touched;
    }
  }
  */

  aplicaCssErro(campo: any){
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }

}
