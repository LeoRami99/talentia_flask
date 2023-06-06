import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetCourseService {
  constructor(private http: HttpClient) { }
  getCourse(id: number){
    return this.http.get(`http://localhost:5000/curso/get-curso/${id}`)
  }
}
