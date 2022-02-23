import { Component, OnInit, ViewChild } from '@angular/core';

import { catchError, EMPTY, Observable, of, Subject, take, switchMap } from 'rxjs';
import { Curso } from '../curso';
import { CursosService } from '../cursos.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { AlertModalService } from '../../shared/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cursos2Service } from '../cursos2.service';

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

  cursoSelecionado!: Curso;

  //bsModalRef?: BsModalRef;

  deleteModalRef?: BsModalRef;
  @ViewChild('deleteModal') deleteModal: any;

  constructor(
    private service: Cursos2Service,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
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

  onEdit(id: number){
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(curso: Curso){
    this.cursoSelecionado = curso;
    //this.deleteModalRef = this.modalService.show(this.deleteModal, { class: 'modal-sm' });
    const result$ = this.alertService.showConfirm('Confirmação', 'Tem certeza que deseja remover esse curso?');
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.service.remove(curso.id) : EMPTY)
    )
    .subscribe(
      success => {
        this.alertService.showAlertSuccess('Curso removido com sucesso.');
        this.onRefresh();
      },
      error => this.alertService.showAlertDanger('Erro ao remover curso. Tente novamente mais tarde.'),
      () => console.log('completed onDelete')
    );
  }


  onConfirmDelete(){
    console.log('modal confirm');

    this.service.remove(this.cursoSelecionado.id).subscribe(
      success => {
        this.alertService.showAlertSuccess('Curso removido com sucesso.');
        this.onRefresh();
      },
      error => this.alertService.showAlertDanger('Erro ao remover curso. Tente novamente mais tarde.'),
      () => console.log('completed onConfirmDelete')
    );

    this.deleteModalRef?.hide();
  }

  onDeclineDelete(){
    console.log('modal decline');
    this.deleteModalRef?.hide();
  }


}
