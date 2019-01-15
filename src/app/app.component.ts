import { Component } from '@angular/core';
import { FileUploader ,FileSelectDirective  } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';

const URL = 'http://local.durbarex.com/api/upload/images';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http : HttpClient){

  }
  title = 'app';

  selectedFile: File;

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    console.log( event.target.files[0]);
  }

  onUpload() {
    // this.http is the injected HttpClient
    console.log(this.selectedFile);
    this.http.post('http://local.durbarex.com/api/upload/images', this.selectedFile).subscribe(
      response => {
        console.log(response);
      }
    );
  
  }

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
     };
 }
}
