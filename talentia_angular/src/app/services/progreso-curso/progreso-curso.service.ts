import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../api.constants'
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ProgresoCursoService {

  constructor(private http : HttpClient) {}
  verificarModulo(id_curso:any, id_modulo:any){
    return this.http.get(`${API_URL}curso/condicion-modulo/${id_curso}/${id_modulo}`);
  }
  verificarLeccion(id_seccion:any, id_subseccion:any){
    return this.http.get(`${API_URL}curso/condicion-leccion/${id_seccion}/${id_subseccion}`);
  }
  actualizarProgreso(id_usuario:any, id_curso:any, id_modulo:any, id_leccion:any){
    const data = {
      id_usuario: id_usuario,
      id_curso: id_curso,
      id_modulo: id_modulo,
      id_leccion: id_leccion
    }
    return this.http.put(`${API_URL}curso/actualizar-progreso-curso/`, data);
  }

}
