import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  constructor(private http: HttpClient) { }

  onSubmit(form: NgForm){

    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
      .subscribe(dados => {
        console.log(dados);
      });
  }

  consultaCEP(cep: any, form: any){
    cep = cep.value;
    cep = cep.replace(/\D/g, '');

    if(cep != ""){
      var validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)){
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
          .subscribe(dados => {
            this.populaDadosForm(dados, form);
          });
      }
    }
  }

  populaDadosForm(dados: any, form: any){
    /*
    form.setValue({
      nome: form.value.nome,
      email: form.value.email,
      endereco: {
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
    */
    form.form.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  ngOnInit(): void {
  }

}
