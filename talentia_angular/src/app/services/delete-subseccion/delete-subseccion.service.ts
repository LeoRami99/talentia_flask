import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/api.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteSubseccionService {
  constructor(private http: HttpClient,) {}
  deleteSubseccion(subseccion: any) {
    let uri= API_URL + 'curso/delete-subseccion/';
    return this.http.delete(uri, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: subseccion,
    });
  }
}
