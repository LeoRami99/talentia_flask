import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api.constants';

@Injectable({
  providedIn: 'root'
})
export class CreateExamenService {

  constructor(private http : HttpClient) { }
  createExamen(examen: any){
    return this.http.post(`${API_URL}examen/crear`, examen);
  }

}
