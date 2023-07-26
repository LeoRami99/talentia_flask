import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api.constants';

@Injectable({
  providedIn: 'root'
})
export class ExamenesService {

  constructor(private http: HttpClient) { }
  getExamenes(){
    return this.http.get(`${API_URL}examen/get-examens`);
  }
}
