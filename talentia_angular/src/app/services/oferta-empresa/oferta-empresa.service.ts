import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class OfertaEmpresaService {

  constructor(private http: HttpClient) { }

  crearEmpresa(data:any){
    return this.http.post(`${API_URL}oferta/create-empresa`,data)
  }
  getHabilidades(){
    return this.http.get(`${API_URL}oferta/habilidades`);
  }
  getEmpresaById(id:any){
    return this.http.get(`${API_URL}oferta/empresa/${id}`);
  }
  crearOferta(data:any){
    return this.http.post(`${API_URL}oferta/create-oferta`,data)
  }
  allOfertas(){
    return this.http.get(`${API_URL}oferta/ofertas`);
  }
  aplicarOferta(data:any){
    return this.http.post(`${API_URL}oferta/aplicar-oferta`,data)
  }
  countOfertasByUser(id:any){
    return this.http.get(`${API_URL}oferta/ofertas-usuario/${id}`);
  }
  actualizarOferta(data:any){
    return this.http.put(`${API_URL}oferta/update-oferta`,data)
  }
  actualizarEstadoOferta(data:any){
    return this.http.put(`${API_URL}oferta/update-estado-oferta`,data)
  }
}
