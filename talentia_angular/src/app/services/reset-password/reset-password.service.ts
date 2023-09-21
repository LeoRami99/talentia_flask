import { Injectable } from '@angular/core';
import { API_URL } from '../../api.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) { }

  resetPassword(correo:any){
    return this.http.post(`${API_URL}user/restore-password`,{correo:correo})
  }
  verifyCode(codigo:any, correo: any){
    return this.http.post(`${API_URL}user/verify-code`,{codigo:codigo, correo: correo})
  }
  updatePassword(correo:any, password:any){
    return this.http.post(`${API_URL}user/update-password`,{correo:correo, password: password})
  }

}
