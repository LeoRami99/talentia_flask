import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { API_URL } from 'src/app/api.constants';
import { CrearProgresoService } from 'src/app/services/crear-progreos/crear-progreso.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.css']
})
export class CardPreviewComponent implements OnInit{

  constructor(private crearProgreso: CrearProgresoService, private toastr: ToastrService, private router: Router, private userData: UserDataService) { }
  // titulo de la tarjeta
  // Este input es el id_del_curso
  @Input() id: number = 0;
  @Input() title: string = '';
  dataUsuario : any;
  // descripcion de la tarjeta
  url_images : string = API_URL+'imagenes/';
  @Input() imagen_card: string = '';
  @Input() dificultad: string = '';
  buttonOculto : boolean = true

  verificiarProgreso: any;
  @Input() id_usuario: string = '';

  ngOnInit(): void {

    this.userData.dataUsuario(parseInt(this.id_usuario)).subscribe(
      (res: any) => {

        this.dataUsuario = res.data;
        this.id_usuario = this.dataUsuario.id;
        this.crearProgreso.verificarProgreso(this.id.toString(), this.dataUsuario.id).subscribe(
          (res:any)=>{
            this.verificiarProgreso=res.data;
          }
        );
      },
      (error) => {
        // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
        this.toastr.error('Error no se puede obtener la información del usuario', 'Error');
        // this.router.navigate(['/courses']);
    });
  }



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
        this.buttonOculto=false
        setTimeout(() => {
          this.router.navigate(['/courses']);
        }, 1000);
      },
      (error) => {
        console.log(error);
        // Manejo de error, podrías redirigir al usuario o mostrar un mensaje de error
        this.toastr.error('Error no se puede crear tu progreso', 'Error');
        // this.router.navigate(['/courses']);
      }
    );
  }

}
