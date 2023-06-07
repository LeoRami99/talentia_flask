import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CreateCursoService {

  constructor(private http:HttpClient ) { }
  createCurso(cursoData:any){
    const uri = 'https://api.pruebawp.cymetria.com/curso/create';
    return this.http.post(uri, cursoData);
  }
}
