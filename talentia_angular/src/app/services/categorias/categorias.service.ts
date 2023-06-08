import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private http: HttpClient) { }
  getCategorias(){
    const uri = API_URL+"/curso/get-categorias"
    return this.http.get(uri)
  }
}
