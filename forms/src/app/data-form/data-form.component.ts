import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownService } from '../shared/service/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/service/consulta-cep.service';
import { map, tap, Observable, distinctUntilChanged, switchMap, empty } from 'rxjs';
import { FormValidations } from '../shared/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  //formulario!: FormGroup;
  estados!: EstadoBr[];
  cidades!: Cidade[];
  //estados!: Observable<EstadoBr[]>;
  cargos!: any[];
  tecnologias!: any[];
  newsletterOp!: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];
  //frameworks!: any[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super();
  }

  override ngOnInit(): void {

    //this.verificaEmailService.verificarEmail('email@email.com').subscribe();

    /*
    this.dropdownService.getEstadosBr()
     .subscribe(dados => {
       this.estados = dados;
       console.log(`recebido nos estados: ${this.estados}`)
     });
     */

    // this.estados = this.dropdownService.getEstadosBr();

    this.dropdownService.getEstadosBr()
      .subscribe(dados => this.estados = dados);

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
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email], this.validarEmail.bind(this)],
      confirmarEmail: [null, [Validators.required, Validators.email, FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
      cep: [null, [Validators.required, FormValidations.cepValidator]],
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

    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log(`status CEP: ${value}`)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCEP(this.formulario.get('endereco.cep')?.value)
          : empty()
        )
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {});

      this.formulario.get('endereco.estado')?.valueChanges
        .pipe(
          tap(estado => console.log(`Novo estado: ${estado}`)),
          map(estado => this.estados.filter(e => e.sigla === estado)),
          map(estados => estados && estados.length > 0 ? estados[0].id : empty()),
          switchMap(estadoId => this.dropdownService.getCidades(Number(estadoId))),
          tap(console.log)
        )
        .subscribe(cidades => this.cidades = cidades);

      //this.dropdownService.getCidades(8).subscribe(console.log);

    // para email: Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    // [Validators.required, Validators.minLength(3), Validators.maxLength(20)]

  }

  buildFrameworks(){

    const values = this.frameworks.map(v => new FormControl(false));

    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));

    /*
    this.formBuilder.array([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ]);
    */

  }

  submit(): void {

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v: any, i: number) => v ? this.frameworks[i] : null)
        .filter((v:  any) => v != null)
    });

    console.log(valueSubmit);

    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit))
      .subscribe(dados => {
        console.log(dados);
        //reseta o form
        this.resetar();
      }, (error: any) => {
        alert(error.message);
      });

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
        //cep: dados.cep,
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

  validarEmail(formControl: FormControl){
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido: true } : null));
  }

}
