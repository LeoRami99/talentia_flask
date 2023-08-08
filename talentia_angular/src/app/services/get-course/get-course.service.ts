import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class GetCourseService {
  constructor(private http: HttpClient) { }
  getCourse(id: number){
    return this.http.get(API_URL+`curso/get-curso/${id}`)
  }
  getCursosEstado(){
    return this.http.get(API_URL+'curso/get-cursos-estado')
  }
  getCursosTomados(){
    return this.http.get(API_URL+'curso/get-cursos-tomados')
  }
}
