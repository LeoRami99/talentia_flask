import { Injectable } from '@angular/core';
import  {API_URL}  from 'src/app/api.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteSeccionService {

  constructor(private http: HttpClient) { }
  deleteSeccion(seccion: any) {
    let uri= API_URL + 'curso/delete-seccion/';
    return this.http.delete(uri, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: seccion,
    });
  }
}
