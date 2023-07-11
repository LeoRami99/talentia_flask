import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService();
@Injectable({
  providedIn: 'root',
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
  public isLoggedIn() {
    const token = localStorage.getItem('token');
    // Comprueba si el token existe y si no ha expirado
    if (token && !jwtHelper.isTokenExpired(token)){
      return true;
    }else{
      return false;
    }
  }
  logout(){
    localStorage.removeItem('token');
  }
}
