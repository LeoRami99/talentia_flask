import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lesson-preview',
  templateUrl: './lesson-preview.component.html',
  styleUrls: ['./lesson-preview.component.css'],
})
export class LessonPreviewComponent implements OnInit {
  id_curso: any;
  id_seccion: any;
  id_subseccion: any;
  lessons: any;
  modulo: any;
  constructor(
    private routeActive: ActivatedRoute,
    private getCurso: GetCourseService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.id_curso = this.routeActive.snapshot.paramMap.get('id_curso');
    this.id_seccion = this.routeActive.snapshot.paramMap.get('id_seccion');
    this.id_subseccion = this.routeActive.snapshot.paramMap.get('id_subseccion');

    // Ahora puedes usar los valores de id_curso, id_seccion e id_subseccion
    console.log(this.id_curso, this.id_seccion, this.id_subseccion);
    this.getCurso.getCourse(this.id_curso).subscribe((res: any) => {
      // console.log(res.curso);
      res.curso.secciones.forEach((seccion: any) => {
        if (seccion.id == this.id_seccion) {
          // console.log(seccion);
          this.modulo = seccion;
          console.log(this.modulo);
          seccion.subsecciones.forEach((subseccion: any) => {
            console.log("entro");
            if (subseccion.id_subseccion == this.id_subseccion) {
              this.lessons = subseccion;
              console.log(this.lessons);
            }else{
              this.toastr.error('Error no se puede obtener la información del curso', 'Error');
            }

          });
        }
      });
    });
  }
}
