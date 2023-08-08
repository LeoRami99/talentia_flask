import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor(private http: HttpClient) {}
  dataUsuario(id: number){
    const header = { 'Authorization': `Bearer ${localStorage.getItem('token')}`};
    return this.http.get(`${API_URL}user/data-usuario/${id}`, {headers: header});
  }
  countUsers(){
    return this.http.get(`${API_URL}user/count-users`);
  }
}
