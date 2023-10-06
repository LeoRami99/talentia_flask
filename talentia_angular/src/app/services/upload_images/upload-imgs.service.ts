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
  uploadImgExamen(img: any) {
    return this.http.post(API_URL+'examen/upload_imagen_examen', img);
  }
  uploadImagenPerfil(img: any) {
    return this.http.post(API_URL+'user/upload_imagen_perfil', img);
  }
}
