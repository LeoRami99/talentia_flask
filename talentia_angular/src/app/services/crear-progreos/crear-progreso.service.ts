import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api.constants';

@Injectable({
  providedIn: 'root'
})
export class CrearProgresoService {

  constructor(private http: HttpClient) {}
  createProgreso(data: any) {
    return this.http.post(API_URL + 'curso/progreso-curso', data);
  }
  verificarProgreso(id_curso: string, id_usuario: string) {
    return this.http.get(API_URL + `curso/verificar-progreso-curso/${id_curso}/${id_usuario}`);
  }
}
