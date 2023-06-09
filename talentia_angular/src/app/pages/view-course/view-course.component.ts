import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCourseService } from '../../services/get-course/get-course.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
interface Curso {
  title: string;
  description: string;
  imagen_portada: string;
  dificultad: string;
  trailer: string;
  sections: Seccion[];
}

interface Seccion {
  id: number;
  titulo: string;
  subsecciones: Subseccion[];
}

interface Subseccion {
  id_seccion: number;
  titulo: string;
  contenido: string;
}

@Component({
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css'],
})

export class ViewCourseComponent implements OnInit {
  curso: Curso | undefined;
  constructor(private routeActive: ActivatedRoute, private router: Router, private getcourse: GetCourseService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe((res: any) => {
        console.log(res);
        const { titulo, descripcion, imagen_portada, secciones, dificultad, trailer } = res.curso;
        this.curso = { title: titulo, description: descripcion, imagen_portada, sections: secciones, dificultad: dificultad, trailer: trailer };
        console.log(this.curso.sections);
      }, error => {
        // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
        console.error(error);
      });
    });

  }
  getVideoUrl(trailerUrl: string): SafeResourceUrl {
    const videoId = this.extractVideoId(trailerUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractVideoId(url: string) {
     // Extraer el ID del video de la URL de YouTube
    const videoId = url.split('/').pop();
    return videoId;
  }





}
