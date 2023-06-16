import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/api.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteCursoService {

  constructor(private http: HttpClient) { }
  deleteCurso(curso: any) {
    let uri= API_URL + '/curso/delete-curso/';
    return this.http.delete(uri, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: curso,
    });
  }
}
