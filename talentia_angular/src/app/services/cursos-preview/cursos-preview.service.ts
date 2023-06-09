import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api.constants';

@Injectable({
  providedIn: 'root'
})
export class CursosPreviewService {
  constructor(private http: HttpClient) { }
  getCursos(){
    const uri = API_URL+"curso/get-cursos"
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`};
    return this.http.get(uri, {headers: headers})
  }
}
