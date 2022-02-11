import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownService } from '../shared/service/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/service/consulta-cep.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;
  //estados!: EstadoBr[];
  estados!: Observable<EstadoBr[]>;
  cargos!: any[];
  tecnologias!: any[];
  newsletterOp!: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];
  //frameworks!: any[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {

    /*
    this.dropdownService.getEstadosBr()
     .subscribe(dados => {
       this.estados = dados;
       console.log(`recebido nos estados: ${this.estados}`)
     });
     */
    this.estados = this.dropdownService.getEstadosBr();

    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsletter();
    //this.frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

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
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      //termos: [null, Validators.pattern('true')]
      termos: [null, Validators.requiredTrue],
      frameworks: this.buildFrameworks()
    });

    // para email: Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    // [Validators.required, Validators.minLength(3), Validators.maxLength(20)]

  }

  buildFrameworks(){

    const values = this.frameworks.map(v => new FormControl(false));

    return this.formBuilder.array(values);

    /*
    this.formBuilder.array([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ]);
    */

  }

  onSubmit(){

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v: any, i: number) => v ? this.frameworks[i] : null)
        .filter((v:  any) => v != null)
    });

    console.log(valueSubmit);

    if(this.formulario.valid){
      this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit))
        .subscribe(dados => {
          console.log(dados);
          //reseta o form
          this.resetar();
        }, (error: any) => {
          alert(error.message);
       });
    }else{
      console.log('Formulário inválido');
      this.verificaValidacoesForm(this.formulario);
    }

  }

  verificaValidacoesForm(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      if(controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: string){
    return !this.formulario.get(campo)?.valid && (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty);
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

    if(cep != null && cep !== ''){
      this.cepService.consultaCEP(cep)
        .subscribe(dados => {
          this.populaDadosForm(dados);
        });
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

  setarCargo(){
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1: any, obj2: any){
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  setarTecnologias(){
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript', 'php']);
  }

}
