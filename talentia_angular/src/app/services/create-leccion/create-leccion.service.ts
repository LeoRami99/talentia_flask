import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { API_URL } from '../../api.constants';

@Injectable({
  providedIn: 'root'
})
export class CreateLeccionService {
  constructor(private http : HttpClient) {}
  createLeccion(data:any){
    return this.http.post(`${API_URL}curso/create-leccion`,data);
  }
}
