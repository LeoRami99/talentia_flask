import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCourseService } from '../../services/get-course/get-course.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/api.constants';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Inject } from '@angular/core';
import { CrearProgresoService } from 'src/app/services/crear-progreos/crear-progreso.service';
import { CursosPreviewService } from '../../services/cursos-preview/cursos-preview.service'
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

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
  descripcion: string;
}
const jwtHelper = new JwtHelperService();
// variable para guardar los datos del usuario que vienen del backend

@Component({
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css'],
})

export class ViewCourseComponent implements OnInit {
  curso: Curso | undefined;
  id_curso: string = '';
  id_usuario:any;
  dataUsuario: any;
  buttonOculto : boolean = true
  cursos: any;
  verificiarProgreso: any;
  loading: boolean = true;
  randomOfertas: any[] = [];
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
    private routeActive: ActivatedRoute,
    private router: Router,
    private getcourse: GetCourseService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private userData: UserDataService,
    private crearProgreso: CrearProgresoService,
    private cursosPreview: CursosPreviewService,
    private ofertaService: OfertaEmpresaService
  ) {}



  public ruta: string=API_URL+'imagenes/';
  ngOnInit(): void {
    this.ofertasRandom();
    this.cursosPreview.getCursos().subscribe((res:any)=>{
      this.cursos=res.cursos;
      // console.log(this.cursos);
    });
    // decode token
    this.id_curso = this.routeActive.snapshot.params['id'];
    const token = localStorage.getItem('token');
    const tokenDecoded = jwtHelper.decodeToken(token!);
    this.userData.dataUsuario(tokenDecoded.id).subscribe(
      (res: any) => {
        this.dataUsuario = res.data;
        this.id_usuario = this.dataUsuario.id;
        this.crearProgreso.verificarProgreso(this.id_curso, this.dataUsuario.id).subscribe(
          (res:any)=>{
            this.verificiarProgreso=res.data;
          }
        );
      },
      (error) => {
        // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
        this.toastr.error('Error no se puede obtener la información del usuario', 'Error');
        this.router.navigate(['/courses']);
    });

    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe(
        (res: any) => {
          if (res.curso == null) {
            this.toastr.error('Error no se puede obtener la información del curso', 'Error');
            this.router.navigate(['/courses']);
            this.loading = false;
          }else{
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
            this.loading = false;
          }


        },
        (error) => {
          // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
          this.toastr.error('Error no se puede obtener la información del curso', 'Error');
          this.router.navigate(['/courses']);
        }
      );
    });

  }

  sanitizeUrl(videoUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  //Crear el progreso basado en el id del curso y el id del usuario
  crearProgresoCurso(id_usuario:any , id_curso: any,) {
    const data = {
      id_usuario: id_usuario,
      id_curso: id_curso,
      id_modulo: '',
      id_leccion: ''
    };
    // data.id_usuario, data.id_curso, data.id_modulo, data.id_leccion
    this.crearProgreso.createProgreso(data).subscribe(
      (res: any) => {
        this.toastr.success('Hemos agregado correctamente el curso', 'Exito');
        this.toastr.info('Ahora puedes empezar a aprender', 'Información');
        this.toastr.info('Seras redireccionado en 5 segundos', 'Información');
        this.buttonOculto=false
        setTimeout(() => {
          this.router.navigate(['/take-lesson/'+this.id_curso]);
        }, 5000);

      },
      (error) => {
        // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
        this.toastr.error('Error no se puede crear tu progreso', 'Error');
        // this.router.navigate(['/courses']);
      }
    );
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
