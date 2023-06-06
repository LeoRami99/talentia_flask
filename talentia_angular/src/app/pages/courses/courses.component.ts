import { Component, OnInit } from '@angular/core';
import { CursosPreviewService } from '../../services/cursos-preview.service';
import { Socket } from 'ngx-socket-io';

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
  lista_curso: Curso[] = [];

  constructor(
    private cursos: CursosPreviewService,
    private socket: Socket
  ) {}

  ngOnInit() {
    // Suscribete a los eventos del socket.
    this.socket.fromEvent('update_courses').subscribe(data => {
      console.log('Received update_courses:', data);
      // Aquí puedes actualizar tus cursos.
      this.updateCursos();
    });
    this.updateCursos();
  }

  updateCursos() {
    this.cursos.getCursos().subscribe((data: any) => {
      console.log(data);
      this.lista_curso = data.cursos;
    });
  }
}
