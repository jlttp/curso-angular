import { Component, OnInit } from '@angular/core';

import { catchError, EMPTY, Observable, of, Subject } from 'rxjs';
import { Curso } from '../curso';
import { CursosService } from '../cursos.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { AlertModalService } from '../../shared/alert-modal.service';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  //cursos!: Curso[];

  cursos$!: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  //bsModalRef?: BsModalRef;

  constructor(
    private service: CursosService,
    //private modalService: BsModalService
    private alertService: AlertModalService
  ) { }

  ngOnInit(): void {
    //this.service.list()
    //  .subscribe(dados => this.cursos = dados);
    this.onRefresh();
  }

  onRefresh(){
    this.cursos$ = this.service.list()
    .pipe(
      catchError(error => {
        console.error(error);
        //this.error$.next(true);
        this.handleError();
        return EMPTY;
      })
    );

    of(this.service.list()).subscribe({
      next: dados => {
        console.log(dados);
      },
      error: error => {
        console.error(error)
      },
      complete: () => {
        console.log('Observable completo!')
      }
    });
  }

  handleError(){
    /*
    this.bsModalRef = this.modalService.show(AlertModalComponent);
    this.bsModalRef.content.type = 'danger';
    this.bsModalRef.content.message = 'Erro ao carregar cursos. Tente novamente mais tarde.';
    */
    this.alertService.showAlertDanger('Erro ao carregar cursos. Tente novamente mais tarde.');
  }

}
