import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {API_URL} from '../../../app/api.constants';
import { ProgresoCursoService } from 'src/app/services/progreso-curso/progreso-curso.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { JwtHelperService } from '@auth0/angular-jwt';

// Interfaz para guardar las lessons


interface Lesson {

  id_seccion: number;
  id_subseccion: number;
  titulo: string;
  contenido: string;
}
const jwtHelper = new JwtHelperService();

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
  id_usuario: any;
  haySiguienteLeccion : boolean = true;
  haySiguienteLeccionId : string = '';
  haySiguienteModulo : boolean = true;
  haySiguienteModuloId : string = '';
  siguienteLeccion: boolean = false;
  leccionFinalizada : boolean=  false;





  constructor(
    private routeActive: ActivatedRoute,
    private getCurso: GetCourseService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private progresoCurso: ProgresoCursoService,
    private userData: UserDataService,
  ) {

  }
  ngOnInit() {

    // token jwt
    const token=localStorage.getItem('token')
    const decodedToken = jwtHelper.decodeToken(token!);
    this.userData.dataUsuario(decodedToken.id).subscribe((res: any) => {
      // console.log(res);
      this.id_usuario = res.data.id;
    });



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
              // console.log(this.lessons);
            }

          });
        }
      });
    });
  }
  sanitizeUrl(videoUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
  // Funcion para actualizar el progreso de la leccion
  updateProgreso(id_usuario:any, id_curso:any, id_seccion:any, id_subseccion:any) {
    this.progresoCurso.actualizarProgreso(id_usuario, id_curso, id_seccion, id_subseccion).subscribe((res: any) => {
      // console.log(res);
      if (res.status == 200) {
        this.toastr.success('Progreso actualizado', 'Correcto');
        this.leccionFinalizada = true;
        this.siguienteLeccion = true;
      } else {
        this.toastr.error('No se pudo actualizar el progreso', 'Error');
      }
    });
  }
  nextLesson(id_curso:any, id_seccion: any, id_subseccion: any) {
    this.progresoCurso.verificarLeccion(id_seccion, id_subseccion).subscribe((res: any) => {
      this.haySiguienteLeccionId = res.data.id;
      this.haySiguienteLeccion = res.data.id ? true : false;
      if (this.haySiguienteLeccion) {
        window.location.href = `/lesson-preview/lesson/${id_curso}/${id_seccion}/${this.haySiguienteLeccionId}`;
      } else {
        this.progresoCurso.verificarModulo(id_curso, id_seccion).subscribe((res: any) => {
          this.haySiguienteModuloId = res.data.id;
          this.haySiguienteModulo = res.data.id ? true : false;
          console.log(this.haySiguienteModulo);
          if (this.haySiguienteModulo) {
            this.progresoCurso.verificarLeccion(this.haySiguienteModuloId, 0).subscribe((res: any) => {
              window.location.href = `/lesson-preview/lesson/${id_curso}/${this.haySiguienteModuloId}/${res.data.id}`;
            });
          } else if(this.haySiguienteModulo == false && this.haySiguienteLeccion == false) {
            console.log("hay siguiente modulo y hay siguiente leccion");
            // No hay siguiente lección ni siguiente módulo, el curso ha finalizado

            this.toastr.success('¡Felicidades, has finalizado el curso!', 'Curso finalizado');
            // redireccionar al seccion de cursos
            window.location.href = `/courses`;
          }
        });
      }
    });
}
  finCurso() {
    this.updateProgreso(this.id_usuario, this.id_curso, this.id_seccion, this.id_subseccion)
    this.toastr.success('Curso finalizado', 'Correcto');
  }



}
