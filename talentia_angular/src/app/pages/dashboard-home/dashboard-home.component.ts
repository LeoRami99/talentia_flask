import { Component, Injectable, OnInit, } from '@angular/core';
import { ProgresoCursoService } from 'src/app/services/progreso-curso/progreso-curso.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

const helper = new JwtHelperService();
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  randomOfertas: any = []
  currentPage: number = 1;
  itemsPerPage: number = 9;
  pageSize: number = 9;
  cursos: any = [];
  examenes: any = [];
  examenes_aprobados: any = [];
  nombre_usuario: string = ''
  contador_certificados = 0;
  contador_examenes = 0;
  contador_cursos = 0;
  contador_ofertas = 0;
  id_usuario: any;
  loading = false;
  customOptions:OwlOptions={
    loop:true,
    autoplay:true,
    mouseDrag:true,
    touchDrag:true,
    pullDrag:true,
    dots:false,
    navSpeed:1000,
    margin:10,
    navText:['<','>'],
    responsive:{
      0:{
        items:1
      },
      400:{
        items:2
      },
      740:{
        items:2
      },
      940:{
        items:2
      }
    },
    nav:true
  }
  customOptionsOfertas:OwlOptions={
    loop:true,
    autoplay:true,
    mouseDrag:true,
    touchDrag:true,
    pullDrag:true,
    dots:false,
    navSpeed:1000,
    margin:10,
    navText:['<','>'],
    responsive:{
      0:{
        items:1
      },
      400:{
        items:1
      },
      740:{
        items:1
      },
      940:{
        items:1
      }
    },
  }
  constructor(
    private progresoService: ProgresoCursoService,
    private toastr: ToastrService,
    private getCourses: GetCourseService,
    private examenService: ExamenesService,
    private dataUser : UserDataService,
    private ofertaService: OfertaEmpresaService
  ) {}
  ngOnInit(): void {
    this.ofertasRandom()
    // obtener el token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = helper.decodeToken(token);
      this.ofertaService.countOfertasByUser(decodedToken['id']).subscribe((data:any)=>{
        this.contador_ofertas = data.ofertas;
      })
      this.progresoService.obtenerCursosProgreso(decodedToken['id'])
        .subscribe((data: any) => {
          if (data.data.length > 0) {
            let progreso = data.data;
            progreso.forEach((element: any) => {
              this.getCourses.getCourse(element.id_curso).subscribe((data: any) => {
                  this.contador_cursos += 1;
                  if(data){
                    this.loading = true;
                    this.cursos.push(data.curso);
                  }else{
                    this.cursos = [];
                    this.loading = false;
                  }
                });
            });
          } else {
            this.cursos = [];
          }
        });
        this.dataUser.dataUsuario(decodedToken['id']).subscribe((data:any)=>{
          this.id_usuario=data.data.id;
          this.nombre_usuario=data.data.nombre+" "+ data.data.apellidos;
        })
      this.examenService.getProgresoUsuario(decodedToken['id']).subscribe((data: any) => {
        if(data.status === 200){
          let examenes = data.data;
          examenes.forEach((element: any) => {
            this.examenService.getExamen(element.id_examen).subscribe((data: any) => {
              // añadir tambien el estado de aprobado
              console.log()
              this.examenes.push({examen:data.examen, aprobado:element.aprobado});
              this.contador_examenes += 1;
              // console.log(element.aprobado)
              if (element.aprobado == "aprobado") {
                this.contador_certificados += 1;
                this.examenes_aprobados.push(data.examen);
              }
            });
          });
        }else{
          this.examenes = [];
        }
      },(error:any)=>{
        this.examenes = [];
      })



    } else {
      this.toastr.error('Error en la obtención del token', 'Error');
    }
  }
  ofertasRandom(){
    this.ofertaService.allOfertas().subscribe({
      next: (data: any) => {
        if (data.status == 200) {
          // las ofertas tienen que estar activas
          data.ofertas.filter((oferta:any)=>oferta.estado == 1)
          this.randomOfertas = data.ofertas.sort(() => Math.random() - Math.random()).slice(0, 3);
        }else{
          this.randomOfertas = [];
        }
      },
      error: (error: any) => {
        this.randomOfertas = [];
      }
    })
  }
}
