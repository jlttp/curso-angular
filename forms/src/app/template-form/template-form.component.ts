import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: 'Juliette',
    email: 'juliette@email.com'
  }

  constructor() { }

  onSubmit(form: NgForm){
    console.log(form.value);

    console.log(this.usuario);
  }

  ngOnInit(): void {
  }

}
