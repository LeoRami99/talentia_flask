import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {API_URL} from '../../../app/api.constants';


// Interfaz para guardar las lessons
interface Lesson {
  id_seccion: number;
  id_subseccion: number;
  titulo: string;
  contenido: string;
}
@Component({
  selector: 'app-lesson-preview',
  templateUrl: './lesson-preview.component.html',
  styleUrls: ['./lesson-preview.component.css'],
})

export class LessonPreviewComponent implements OnInit {
  api_url = API_URL;
  isLoading: boolean = true;
  id_curso: any;
  id_seccion: any;
  id_subseccion: any;
  lessons: any;
  modulo: any;
  curso: any;
  allLessons: Lesson[]=[];

  constructor(
    private routeActive: ActivatedRoute,
    private getCurso: GetCourseService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,

  ) {

  }
  ngOnInit() {
    this.id_curso = this.routeActive.snapshot.paramMap.get('id_curso');
    this.id_seccion = this.routeActive.snapshot.paramMap.get('id_seccion');
    this.id_subseccion = this.routeActive.snapshot.paramMap.get('id_subseccion');
    // Ahora puedes usar los valores de id_curso, id_seccion e id_subseccion
    // console.log(this.id_curso, this.id_seccion, this.id_subseccion);
    this.getCurso.getCourse(this.id_curso).subscribe((res: any) => {
      this.curso=res.curso;
      // console.log(this.curso.secciones);

      this.curso.secciones.forEach((seccion: any) => {
        this.allLessons = this.allLessons.concat(seccion.subsecciones);
      });
      res.curso.secciones.forEach((seccion: any) => {
        this.isLoading = false;
        if (seccion.id == this.id_seccion) {
          // console.log(seccion);
          this.modulo = seccion;
          // console.log(this.modulo);
          seccion.subsecciones.forEach((subseccion: any) => {
            // console.log("entro");
            // console.log(subseccion);
            if (subseccion.id_subseccion == this.id_subseccion) {
              this.lessons = subseccion;
              console.log(this.lessons);
            }

          });
        }
      });
    });
  }
  sanitizeUrl(videoUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
}
