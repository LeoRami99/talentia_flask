import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api.constants';

@Injectable({
  providedIn: 'root',
})
export class ExamenesService {
  constructor(private http: HttpClient) {}
  getExamenes() {
    return this.http.get(`${API_URL}examen/get-examens`);
  }
  getExamen(id: string) {
    return this.http.get(`${API_URL}examen/get-examen/${id}`);
  }
  createOption(data: any) {
    return this.http.post(`${API_URL}examen/create-opcion`, data);
  }
  deleteOption(id: string) {
    return this.http.delete(`${API_URL}examen/delete-opcion`, {
      body: { id },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  // actualización de examen completo
  updateExamen(data: any) {
    return this.http.put(`${API_URL}examen/update-examen`, data);
  }
  // actualización de estado de examen
  // crear pregunta de examen con sus opciones
  createPregunta(data: any) {
    return this.http.post(`${API_URL}examen/create-pregunta`, data);
  }
  // ElminarPregunta()
  deletePregunta(id: string) {
    return this.http.delete(`${API_URL}examen/delete-pregunta`, {
      body: { id },
    });
  }
  // funciones del progreso del examen
  createProgreso(data: { id_examen: any; id_usuario: any }) {
    return this.http.post(`${API_URL}examen/create-progreso`, data);
  }
  getProgreso(data: { id_examen: any; id_usuario: any }){
    return this.http.get(`${API_URL}examen/get-progreso/${data.id_examen}/${data.id_usuario}`);
  }
  updateProgreso(data: any) {
    console.log(data);
    return this.http.put(`${API_URL}examen/update-progreso`, data);
  }

  getProgresoUsuario(id_usuario: string) {
    return this.http.get(`${API_URL}examen/get-progreso/${id_usuario}`);
  }
  getExamenesEstado(){
      return this.http.get(`${API_URL}examen/get-examenes-estado`);
  }
  getExamenesAprobados(){
    return this.http.get(`${API_URL}examen/get-examenes-aprobados`);
  }
  // descargar certificado
  getCertificado(id_usuario: string, id_examen: string) {
    return this.http.get(`${API_URL}examen/certificados/${id_usuario}/${id_examen}`,
    {responseType: 'blob'});
  }
}
