import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'contador',
  templateUrl: './output-property.component.html',
  styleUrls: ['./output-property.component.css']
})
export class OutputPropertyComponent implements OnInit {

  @Input() valor: any = 0;

  @Output() mudouValor = new EventEmitter();

  @ViewChild('campoInput') campoValorInput: any;

  constructor() { }

  ngOnInit(): void {
  }

  incrementa(){
    //console.log(this.campoValorInput.nativeElement.value);
    this.campoValorInput.nativeElement.value++;
    //this.valor++;
    this.mudouValor.emit({novoValor: this.valor});
  }

  decrementa(){
    //this.valor--;
    this.campoValorInput.nativeElement.value--;
    this.mudouValor.emit({novoValor: this.valor});
  }

}
