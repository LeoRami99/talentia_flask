import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/api.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UpdateStateCursoService {
  constructor(private http: HttpClient) {}
  updateStateCurso(curso: any) {
    return this.http.put(`${API_URL}/curso/estado-curso/`, curso);
  }
}
