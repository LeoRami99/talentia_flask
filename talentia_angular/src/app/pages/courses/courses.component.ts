import { Component, OnInit } from '@angular/core';
import { CursosPreviewService } from '../../services/cursos-preview/cursos-preview.service';
// import { Socket } from 'ngx-socket-io';

interface Curso {
  id: number;
  titulo: string;
  description: string;
  imagen_card: string;
  dificultad: string;
  estado: number;
}

@Component({
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  page: number = 1;
  pageSize: number = 10;
  selectedCategory: string = '';
  filterText: string = '';
  lista_curso: Curso[] = [];

  constructor(
    private cursos: CursosPreviewService,
    // private socket: Socket
  ) {}

  ngOnInit() {
    this.cursos.getCursos().subscribe((data: any) => {
      console.log(data);
      this.lista_curso = data.cursos;
    });
  }
  get filteredCursos() {
    if (this.selectedCategory === '') {
      return this.lista_curso;
    } else {
      return this.lista_curso.filter(curso => curso.titulo === this.selectedCategory);
    }
  }

}
