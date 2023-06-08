import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';
@Injectable({
  providedIn: 'root'
})
export class CreateCursoService {

  constructor(private http:HttpClient ) { }
  createCurso(cursoData:any){
    const uri = API_URL+'/curso/create';
    return this.http.post(uri, cursoData);
  }
}
