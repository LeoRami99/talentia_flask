import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCourseService } from '../../services/get-course/get-course.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

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
  id_curso: string = '';
  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private getcourse: GetCourseService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id_curso = this.routeActive.snapshot.params['id'];
    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe(
        (res: any) => {
          console.log(res.curso);
          const {
            titulo,
            descripcion,
            imagen_portada,
            secciones,
            dificultad,
            trailer,
          } = res.curso;
          this.curso = {
            title: titulo,
            description: descripcion,
            imagen_portada,
            sections: secciones,
            dificultad: dificultad,
            trailer: trailer,
          };
        },
        (error) => {
          // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
          this.toastr.error('Error no se puede obtener la información del curso', 'Error');
          this.router.navigate(['/courses']);

        }
      );
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
