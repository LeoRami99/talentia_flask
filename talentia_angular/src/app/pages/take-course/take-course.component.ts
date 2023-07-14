import { Component,  ElementRef, Renderer2, ViewChild } from '@angular/core';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { Inject } from '@angular/core';
// import toastr
import { ToastrService } from 'ngx-toastr';
import { ProgresoCursoService } from 'src/app/services/progreso-curso/progreso-curso.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { JwtHelperService } from '@auth0/angular-jwt';



const jwtHelper = new JwtHelperService();

@Component({
  selector: 'app-take-course',
  templateUrl: './take-course.component.html',
  styleUrls: ['./take-course.component.css'],
})

export class TakeCourseComponent implements OnInit {
  constructor(
    private getCourseService: GetCourseService,
    private routeActive: ActivatedRoute,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private el: ElementRef,
    private dataUser: UserDataService,
    private progresoCurso: ProgresoCursoService,
  ) {}

  curso: any = {};
  selectedSection: number = 0;
  resumenCurso: boolean = false;
  urlCurso: string= '';
  onSectionClick(i: number): void {
    this.selectedSection = i;
    const element = this.el.nativeElement.querySelector(
      `#toc-content-${i + 1}`
    );
    element.scrollIntoView({ behavior: 'smooth' });
  }
  ngOnInit(): void {

    // se hace la consulta para obtener el curso
    this.routeActive.params.subscribe((params) => {
      this.getCourseService.getCourse(params['id']).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.curso = res.curso;
            console.log(this.curso);
          } else {
            this.toastr.error('Error', 'Error');
            // console.log('Error');
          }
        },
        (error) => {
          this.toastr.error(
            'Error no se puede obtener la información del curso',
            'Error'
          );
          // console.log(error);
        }
      );
    });
    // se obtiene el id del usuario mediante el token
    //   verificación del usuario
      const token = localStorage.getItem('token');
      const decodedToken = jwtHelper.decodeToken(token!);
      this.dataUser.dataUsuario(decodedToken.id).subscribe((res: any) => {
        if(res.status == 200){
            this.progresoCurso.obtenerProgreso(this.curso.id, res.data.id).subscribe((res2: any) => {
              console.log(res2);
                if(res2.status == 200){
                  if(res2.data.id_seccion == null && res2.data.id_subseccion == null){this.resumenCurso}else{
                    this.urlCurso = `/lesson-preview/lesson/${res2.data.id_curso}/${res2.data.id_seccion}/${res2.data.id_subseccion}`;
                    this.resumenCurso = true;
                  }
                }else{
                  this.toastr.error('Error', 'Error');
                  this.resumenCurso = false;
                }
            });
        }else{
          this.toastr.error('Error', 'Error');
        }
      });

  }
}
