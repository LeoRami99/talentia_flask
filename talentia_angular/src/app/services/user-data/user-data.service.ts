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
  createProfile(data:any){
    return this.http.post(`${API_URL}user/create-profile`,data)
  }
  profileExist(id:any){
    return this.http.get(`${API_URL}user/profile-exist/${id}`)
  }
  getProfile(id:any){
    return this.http.get(`${API_URL}user/get-profile/${id}`)
  }
  updateProfile(data:any){
    return this.http.put(`${API_URL}user/update-profile`,data)
  }
  verifyAccount(data:any){
    return this.http.post(`${API_URL}user/verify-account`,data)
  }
  verificarEstadoCuenta(correo:any){
    return this.http.get(`${API_URL}user/verify-account-state/${correo}`)
  }
  actualizarFotoPerfil(data:any){
    return this.http.put(`${API_URL}user/actualizar-foto-perfil`,data)
  }
  getFotoPerfil(id:any){
    return this.http.get(`${API_URL}user/get-foto-perfil/${id}`)
  }
}
