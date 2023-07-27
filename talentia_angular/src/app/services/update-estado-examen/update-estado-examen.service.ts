import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UpdateEstadoExamenService {

  constructor(private http: HttpClient) { }
  updateEstadoExmanen(data:any){
    return this.http.put(`${API_URL}examen/update-estado-examen`,data);
  }
}
