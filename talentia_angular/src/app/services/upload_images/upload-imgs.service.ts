import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImgsService {

  constructor(private http: HttpClient) { }
  uploadImgs(imgs: any) {
    return this.http.post('http://localhost:5000/curso/upload_imagenes_curso', imgs);
  }
}
