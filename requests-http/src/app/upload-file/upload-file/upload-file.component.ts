import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../upload-file.service';
import { environment } from '../../../environments/environment';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertModalService } from '../../shared/alert-modal.service';
import { filterResponse, uploadProgress } from '../../shared/rxjs-operators';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  files!: Set<File>;
  progress = 0;

  constructor(
    private service: UploadFileService,
    private alertService: AlertModalService
  ) { }

  ngOnInit(): void {
  }

  onChange(event: any){
    console.log(event);

    const selectedFiles = <FileList>event.srcElement.files;

    //document.getElementById('customFileLabel')!.innerHTML = selectedFiles[0].name;

    this.files = new Set();

    for(let i=0; i<selectedFiles.length; i++){
      this.files.add(selectedFiles[i]);
    }

    this.progress = 0;

  }

  onUpload(){
    if(this.files && this.files.size > 0){
      this.service.upload(this.files, `${environment.BASE_URL}/upload`) //'http://localhost:8000/upload')
        .pipe(
          uploadProgress(progress => {
            console.log(progress);
            this.progress = progress;
          }),
          filterResponse()
        )
        .subscribe(response => this.alertService.showAlertSuccess('Upload concuído com sucesso!'))
        // .subscribe((event: HttpEvent<Object>) => {
        //   //console.log(event);
        //   if(event.type === HttpEventType.Response){
        //     //console.log('Upload concluído.');
        //     this.alertService.showAlertSuccess('Upload concuído com sucesso!');
        //   } else if(event.type === HttpEventType.UploadProgress){
        //     const percentDone = Math.round((event.loaded * 100) / event.total!);
        //     //console.log(`Progresso: ${percentDone}`);
        //     this.progress = percentDone;
        //   }
        // });
    }
  }

  onDownloadExcel(){
    this.service.download(`${environment.BASE_URL}/downloadExcel`)
    .subscribe((res: any) => {
      // const file = new Blob([res], {
      //   type: res.type
      // });

      // const blob = window.URL.createObjectURL(file);

      // const link = document.createElement('a');
      // link.href = blob;
      // link.download = 'report.xlsx';

      // //link.click(); //funciona bem no chrome
      // link.dispatchEvent(new MouseEvent('click', {
      //   bubbles: true,
      //   cancelable: true,
      //   view: window
      // }));

      // setTimeout(() => { //firefox, sem timeout funciona bem no chrome
      //   window.URL.revokeObjectURL(blob);
      //   link.remove();
      // }, 100);

      this.service.handleFile(res, 'report.xlsx');

    });
  }

  onDownloadPDF(){
    this.service.download(`${environment.BASE_URL}/downloadPDF`)
    .subscribe((res: any) => {
    //   const file = new Blob([res], {
    //     type: res.type
    //   });

    //   const blob = window.URL.createObjectURL(file);

    //   const link = document.createElement('a');
    //   link.href = blob;
    //   link.download = 'report.pdf';

    //   link.click();

    //   window.URL.revokeObjectURL(blob);
    //   link.remove();

    this.service.handleFile(res, 'report.pdf');

    });

  }

}
