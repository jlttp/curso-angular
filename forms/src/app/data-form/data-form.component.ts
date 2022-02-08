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
     email: [null, [Validators.required, Validators.email]],
     endereco: this.formBuilder.group({
      cep: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      complemento: [null],
      rua: [null, [Validators.required]],
      bairro: [null, [Validators.required]],
      cidade: [null, [Validators.required]],
      estado: [null, [Validators.required]]
     })
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

  verificaValidTouched(campo: string){
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }

  /*
  verificaEmailInvalido(){
    if(this.formulario.get('email')?.errors){
      return this.formulario.get('email')?.errors['email'] && this.formulario.get('email')?.touched;
    }
  }
  */

  aplicaCssErro(campo: string){
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }

  consultaCEP(){
    let cep = this.formulario.get('endereco.cep')?.value;
    cep = cep.replace(/\D/g, '');

    if(cep != ""){
      var validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)){

        this.resetaDadosForm();

        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .subscribe(dados => {
            this.populaDadosForm(dados);
          });
      }
    }
  }

  populaDadosForm(dados: any){
    this.formulario.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });

    //setando apenas um campo
    //this.formulario.get('nome')?.setValue('Juliette');
  }

  resetaDadosForm(){
    this.formulario.patchValue({
      endereco: {
        cep: null,
        complemento: null,
        rua: null,
        numero: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

}
