import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  signup(userData:any){
    const uri = API_URL+'user/signup';
    return this.http.post(uri, userData);
  }
  // login del usuario
  login(userData:any){
    const uri = API_URL+'user/login';
    return this.http.post(uri, userData);
  }
}
