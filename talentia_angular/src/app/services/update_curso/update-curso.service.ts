import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UpdateCursoService {

  constructor(private http: HttpClient) { }
  updateCurso(dataCurso: any) {
    const uri = API_URL + '/curso/update-curso';
    return this.http.put(uri, dataCurso);
  }
}
