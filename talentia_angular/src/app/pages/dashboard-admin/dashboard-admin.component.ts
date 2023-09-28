import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})

export class DashboardAdminComponent implements OnInit{
  helper = new JwtHelperService();
  constructor(private dataUser: UserDataService, private getCoursesData: GetCourseService, private examenGet: ExamenesService) { }

  // contador de usuarios registrados en talentia
  countUsers: number = 0;
  countCursosActivos: number = 0;
  countCursosInactivos: number = 0;
  countExamenActivos: number = 0;
  countExamenInactivos: number = 0;
  nombre_usuario: string = ''
  // este dato de examenes aprobados contiene el numero de examenes aprobados para todos los usuarios
  exameneAprobados: number = 0;
  cursosTomados : number = 0;



  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken = this.helper.decodeToken(token);
      this.dataUser.dataUsuario(decodedToken['id']).subscribe((data:any)=>{
        this.nombre_usuario=data.data.nombre+" "+ data.data.apellidos;
      })
    }
    this.dataUser.countUsers().subscribe((data: any) => {
      this.countUsers = data.count;
    });
    this.getCoursesData.getCursosEstado().subscribe((data: any) => {
      this.countCursosActivos = data.data.activos;
      this.countCursosInactivos = data.data.inactivos;
    });
    this.examenGet.getExamenesEstado().subscribe((data: any) => {
      this.countExamenActivos = data.data.activos;
      this.countExamenInactivos = data.data.inactivos;
    });
    this.examenGet.getExamenesAprobados().subscribe((data: any) => {
      this.exameneAprobados = data.data.aprobados;
      this.getCoursesData.getCursosTomados().subscribe((data: any) => {
        this.cursosTomados = data.data.progreso;

        let myChart = new Chart("myChart", {
          type: 'bar',

          data: {
              labels: ['Cursos tomados por usuarios', 'Examenes aprobados por usuarios'],
              datasets: [{
                  label: 'Datos de usuarios',
                  data: [this.cursosTomados, this.exameneAprobados],
                  backgroundColor: [
                      'rgba(66, 134, 244, 0.3)',   // Azul
                      'rgba(244, 67, 54, 0.3)',   // Rojo
                  ],
                  borderColor: [
                      'rgba(66, 134, 244, 1)',
                      'rgba(244, 67, 54, 1)',
                  ],
                  borderWidth: 1.5   // Aumenta un poco el ancho del borde para un aspecto nítido
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              },
              responsive: true
          }
      });

      });
    });

  }
}
