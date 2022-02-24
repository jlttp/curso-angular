import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../upload-file.service';
import { environment } from '../../../environments/environment';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertModalService } from '../../shared/alert-modal.service';

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
        .subscribe((event: HttpEvent<Object>) => {
          //HttpEventType.UploadProgress
          console.log(event);
          if(event.type === HttpEventType.Response){
            console.log('Upload concluído.');
            this.alertService.showAlertSuccess('Upload concuído com sucesso!');
          } else if(event.type === HttpEventType.UploadProgress){
            const percentDone = Math.round((event.loaded * 100) / event.total!);
            console.log(`Progresso: ${percentDone}`);
            this.progress = percentDone;
          }
        });
    }
  }

}
