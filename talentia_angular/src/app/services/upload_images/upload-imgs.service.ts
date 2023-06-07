import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImgsService {

  constructor(private http: HttpClient) { }
  uploadImgs(imgs: any) {
    return this.http.post('https://api.pruebawp.cymetria.com/curso/upload_imagenes_curso', imgs);
  }
}
