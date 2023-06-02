import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursosPreviewService {

  constructor(private http: HttpClient) { }
  getCursos(){
    const uri = "http://localhost:5000/curso/get-cursos"
    return this.http.get(uri)
  }
}
