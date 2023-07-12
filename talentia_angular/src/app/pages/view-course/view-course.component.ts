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
  dataUsuario: any;
  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private getcourse: GetCourseService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private userData: UserDataService,
    private crearProgreso: CrearProgresoService

  ) {}
  public ruta: string=API_URL+'imagenes/';
  ngOnInit(): void {
    // decode token
    const token = localStorage.getItem('token');
    const tokenDecoded = jwtHelper.decodeToken(token!);
    this.userData.dataUsuario(tokenDecoded.id).subscribe(
      (res: any) => {
        this.dataUsuario = res.data;

      },
      (error) => {
        // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
        this.toastr.error('Error no se puede obtener la información del usuario', 'Error');
        this.router.navigate(['/courses']);
    });

    this.id_curso = this.routeActive.snapshot.params['id'];
    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe(
        (res: any) => {
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
        this.toastr.success('Hemos creado correctamente tu progreso', 'Exito');
        // this.router.navigate(['/courses']);
        console.log(res);
      },
      (error) => {
        // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
        this.toastr.error('Error no se puede crear tu progreso', 'Error');
        // this.router.navigate(['/courses']);
      }
    );
  }

}
