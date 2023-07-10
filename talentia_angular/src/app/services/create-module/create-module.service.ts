import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api.constants';


@Injectable({
  providedIn: 'root'
})
export class CreateModuleService {

  constructor(private http: HttpClient) { }
  createModule(data: any) {
    return this.http.post(`${API_URL}curso/create-modulo/`, data);
  }
}
