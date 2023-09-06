import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  selectedFiles: FileList | null = null;
  uploadedFiles: any[] = [];

  constructor(private http: HttpClient) {
    this.listUploadedFiles();
  }

  onFileChange(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadFiles() {
    if (this.selectedFiles) {
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }
      this.http.post('http://localhost:3300/upload', formData).subscribe(
        (response) => {
          console.log('Upload successful', response);
          this.listUploadedFiles();
          this.selectedFiles = null;
        },
        (error) => {
          console.error('Error uploading files', error);
        }
      );
    }
  }

  listUploadedFiles() {
    this.http.get<any>('http://localhost:3300/list').subscribe(
      (response) => {
        this.uploadedFiles = response.files.map((file: any) => ({
          name: file,
          url: `http://localhost:3300/uploads/${encodeURIComponent(file)}`, // Encode the filename
        }));
      },
      (error) => {
        console.error('Error listing files', error);
      }
    );
  }


  deleteFile(filename: string) {
    this.http.delete(`http://localhost:3300/delete/${filename}`).subscribe(
      (response) => {
        console.log('File deleted', response);
        this.listUploadedFiles();
      },
      (error) => {
        console.error('Error deleting file', error);
      }
    );
  }

  isImage(file: any): boolean {
    const extensions = ['jpg', 'jpeg', 'png', 'gif'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    return extensions.includes(ext || '');
  }
}
