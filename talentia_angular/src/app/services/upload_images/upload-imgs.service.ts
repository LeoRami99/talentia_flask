import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UploadImgsService {

  constructor(private http: HttpClient) { }
  uploadImgs(imgs: any) {
    return this.http.post(API_URL+'curso/upload_imagenes_curso', imgs);
  }
}
