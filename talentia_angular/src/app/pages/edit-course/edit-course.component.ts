import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCourseService } from '../../services/get-course/get-course.service';


// Interfaces para guardar el JSON del API
interface Curso {
  id: number;
  titulo: string;
  id_instructor: number;
  descripcion: string;
  imagen_card: string;
  imagen_portada: string;
  dificultad: string;
  estado: number;
  categoria: string;
  precio: number;
  secciones: Secciones[];
}
interface Secciones{
  titulo: string;
  curso_id: number;
  id_seccion: number;
  orden: number;
  subsecciones: Subsecciones[];
}
interface Subsecciones{
  id: number;
  titulo: string;
  descripcion: string;
  seccion: number;
}



@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {
  curso: Curso | undefined;

}
