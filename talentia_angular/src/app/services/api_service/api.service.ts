import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  signup(userData:any){
    const uri = 'http://localhost:5000/user/signup';
    return this.http.post(uri, userData);
  }
  // login del usuario
  login(userData:any){
    const uri = 'http://localhost:5000/user/login';
    return this.http.post(uri, userData);
  }
}
