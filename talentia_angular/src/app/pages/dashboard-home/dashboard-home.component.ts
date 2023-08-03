import { Component, OnInit } from '@angular/core';
import { ProgresoCursoService } from 'src/app/services/progreso-curso/progreso-curso.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';

const helper = new JwtHelperService();
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  cursos: any = [];
  examenes: any = [];
  constructor(
    private progresoService: ProgresoCursoService,
    private toastr: ToastrService,
    private getCourses: GetCourseService,
    private examenService: ExamenesService
  ) {}
  ngOnInit(): void {
    // obtener el token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = helper.decodeToken(token);
      this.progresoService.obtenerCursosProgreso(decodedToken['id'])
        .subscribe((data: any) => {
          if (data.data.length > 0) {
            let progreso = data.data;
            progreso.forEach((element: any) => {
              this.getCourses
                .getCourse(element.id_curso)
                .subscribe((data: any) => {
                  this.cursos.push(data.curso);
                });
            });
          } else {
            this.cursos = [];
          }
        });

      this.examenService.getProgresoUsuario(decodedToken['id']).subscribe((data: any) => {
        if(data.status === 200){
          let examenes = data.data;
          console.log(examenes);
          examenes.forEach((element: any) => {
            this.examenService.getExamen(element.id_examen).subscribe((data: any) => {
              this.examenes.push(data.examen);
            });
          });
        }else{
          this.examenes = [];
        }
      },(error:any)=>{
        this.examenes = [];
      })



    } else {
      this.toastr.error('Error en la obtención del toke', 'Error');
    }
  }
}
