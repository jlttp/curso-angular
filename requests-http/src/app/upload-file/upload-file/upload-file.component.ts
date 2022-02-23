import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onChange(event: any){
    console.log(event);

    const selectedFiles = <FileList>event.srcElement.files;

    //document.getElementById('customFileLabel')!.innerHTML = selectedFiles[0].name;
  }

}
