import { Component, Input, HostListener, Inject } from '@angular/core';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from 'src/app/api.constants';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { data, error } from 'jquery';




@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css'],
})
export class TakeQuizComponent {
  constructor(
    private examenesService: ExamenesService,
    private routerActive: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,

  ) {}
  examen: any = [];
  url_images: string = API_URL + 'imagenes/';
  showModal: boolean = true;
  minutosDesdeBD: number = 0; // Aquí almacenamos los minutos obtenidos de la base de datos
  minutosRestantes: number = 0; // Aquí almacenamos el tiempo restante del contador
  segundosRestantes: number = 0;

  // aqui se van a almacenar las respuestas del usuario para hacer el ponderado final
  respuestas = [];
  mostrarPregunta: number = 0; // Índice de la pregunta actual
  botonSiguiente: boolean = true;
  @Input() respuestaUsuario: string = '';
  @Input() id_pregunta: string = '';
  respuestasUsuario: any = [];
  numeroDePreguntas: number = 0;
  id_usuario: number = 0;
  jwtHelper = new JwtHelperService();
  progresoUsurioCheck : boolean = false;
  examen_id : string = '';

  @HostListener('document:visibilitychange', ['$event'])
  onclickOutside(event: Event) {
    if (document.hidden){
      this.toastr.warning('Se ha cerrado la pestaña, no esta permitido cambiar de pestaña', 'Alerta', {
        timeOut: 10000,
      });
      // this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = this.jwtHelper.decodeToken(token);
      this.id_usuario = tokenPayload.id;
    }
    this.routerActive.params.subscribe((params) => {
      this.examen_id = params['id'];
      this.examenesService.getExamen(params['id']).subscribe((data: any) => {
        this.examen = data.examen;
        this.minutosDesdeBD = 30;
        this.mostrarPregunta = 0;
      },(error: any) => {
        this.toastr.error('No se ha podido obtener el examen', 'Error');
        this.router.navigate(['/examenes']);
      }
      );
    });
    let data={"id_examen":this.examen_id, "id_usuario":this.id_usuario}
    this.examenesService.getProgreso(data).subscribe(
      (data: any) => {
      if(data.status == 200){
        this.progresoUsurioCheck = true;
      }else{
        this.progresoUsurioCheck = false;
      }
    },(error: any) => {
      this.progresoUsurioCheck = false;
    }
    );

  }
  ocultarModal() {
    this.showModal = false;
    this.numeroDePreguntas= this.examen.preguntas.length;
    console.log(this.progresoUsurioCheck);
    if (!this.progresoUsurioCheck){
      let data={"id_examen":this.examen.id, "id_usuario":this.id_usuario}
      this.examenesService.createProgreso(data).subscribe((data: any) => {
          this.toastr.success('Examen iniciado', 'Correcto');
      });
    }else{
      this.toastr.success('Examen iniciado', 'Correcto');
    }
    this.iniciarContador();
  }

  iniciarContador() {
    this.minutosRestantes = this.minutosDesdeBD;
    this.segundosRestantes = 0;
    this.contador();
  }
  contador() {
    if (this.minutosRestantes > 0 || this.segundosRestantes > 0) {
      if (this.segundosRestantes === 0) {
        this.minutosRestantes--;
        this.segundosRestantes = 59;
      } else {
        this.segundosRestantes--;
      }
      setTimeout(() => {
        this.contador();
      }, 1000); // 1000 milisegundos = 1 segundo
    } else {
      if (this.minutosRestantes == 29) {
        this.toastr.warning(
          'Quedan 30 minutos para terminar el examen',
          'Alerta'
        );
      }
    }
  }
  siguientePregunta(id_pregunta: string) {
    const totalPreguntas = this.examen.preguntas.length;
    const esUltimaPregunta = this.mostrarPregunta === totalPreguntas - 1;

    if (this.respuestaUsuario !== '') {
      this.toastr.success('Respuesta guardada', 'Correcto');
      this.respuestasUsuario.push({ 'id_opcion': this.respuestaUsuario, 'id_pregunta': id_pregunta});


      if (!esUltimaPregunta) {
        this.mostrarPregunta++;
        this.respuestaUsuario = ''; // Reiniciamos la respuesta para la siguiente pregunta
      } else {
        this.botonSiguiente = false;
        // console.log(this.respuestasUsuario);
      }
    } else {
      this.toastr.error('No has seleccionado ninguna respuesta', 'Error');
    }
  }
  // esta función se encarga de evualuar el examen si se apropo o no.
  funcionFinalizar() {
      const resultado_maximo_examen = this.examen.preguntas.length;
      const resultadoExamenRtaCorrectas = [];
      let contadorPreguntasCorrectas = 0;
      // console.log(this.examen)
      for (let i = 0; i < this.examen.preguntas.length; i++) {
        for (let j = 0; j < this.examen.preguntas[i].opciones.length; j++) {
          if(this.examen.preguntas[i].opciones[j].opcion_correcta=='true'){
            resultadoExamenRtaCorrectas.push({
              "id_pregunta": this.examen.preguntas[i].id,
              "id_opcion": this.examen.preguntas[i].opciones[j].id,
            })
          }
        }
      }
      for (let index = 0; index < this.examen.preguntas.length; index++) {
        // verificar que el id de las respuestas del usuario coincidan con las del examen
        if(this.respuestasUsuario[index].id_pregunta == resultadoExamenRtaCorrectas[index].id_pregunta){

          if(this.respuestasUsuario[index].id_opcion == resultadoExamenRtaCorrectas[index].id_opcion){
            contadorPreguntasCorrectas++;
          }
        }else{
          break;
        }
      }
      // console.log(contadorPreguntasCorrectas);
      contadorPreguntasCorrectas >= resultado_maximo_examen ? this.toastr.success('Aprobaste el examen', 'Correcto') : this.toastr.error('No aprobaste el examen', 'Error');




  }



}
