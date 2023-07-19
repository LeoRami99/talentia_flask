import { Component, Input, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CursosPreviewService } from '../../services/cursos-preview/cursos-preview.service';
// Interfaces para la creación del examen
interface Iexamen{
  nombre: string;
  descripcion: string;
  imagen: string;
  tiempo: string;
  preguntas: IPregunta[];
}
interface IPregunta{
  pregunta: string;
  opciones: IOpcion[];
}
interface IOpcion{
  opcion: string;
  opcion_correcta: boolean | string;
}
// Models para recoger la información


@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})



export class CreateQuizComponent implements OnInit {
  constructor(private toastr: ToastrService, private getCursos : CursosPreviewService) { }
  // Modelos binding para recoger la información
  @Input() pregunta: string = '';
  @Input() opcion_correcta: boolean = false;
  @Input() opcion: string = '';
  opciones:  IOpcion[] = [];
  preguntas: IPregunta[] = [];
  animationClass: string = 'animate__backOutDown';
  imagen!: File;
  viewAddQuestion: boolean = true;
  cursos: any[] = [];

  ngOnInit(): void {
    this.getCursos.getCursos().subscribe(
      (res: any) => {
        this.cursos = res.cursos;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }


  toggleAddPregunta() {
    this.viewAddQuestion = !this.viewAddQuestion;
    this.animationClass = 'animate__backInUp';
    this.pregunta = '';
    this.opcion = '';
    this.opcion_correcta = false;
  }
  // addExamen
  addOption() {
    if (this.opcion === '' || this.opcion.length < 3 || this.opciones.length > 3) {
      return;
    }else{
      const opcion={
        opcion: this.opcion,
        opcion_correcta: this.opcion_correcta
      }
      this.opciones.push(opcion);
      console.log(this.opciones)
      this.opcion = '';
      this.opcion_correcta = false;
    }
  }
  AddPregunta(){
    if (this.pregunta === '' || this.opciones.length == 0) {
      return;
    }else{
      const preguntas={
        pregunta: this.pregunta,
        opciones: this.opciones
      }
      if (this.opciones.length >=2){
        // console.log(this.opciones.length >=2)
        // verificar que las opciontes tenga una opción en true y el resto en false pero que solo haya una en true
        let contador = 0;
        for (let i = 0; i < this.opciones.length; i++) {
          if(this.opciones[i].opcion_correcta === 'true') {
            contador++;
          }
        }
        console.log(contador)
        if (contador > 1 || contador == 0 ) {
          this.toastr.error('Tienes más de una opción correcta o ninguna', 'Error');
          return;
        }else{
          this.preguntas.push(preguntas);
          // console.log(this.preguntas)
          this.opciones = [];
          this.pregunta = '';
          this.toggleAddPregunta();
        }

      }else{
        this.toastr.error('Debes añadir al menos 2 opciones', 'Error');
        return;
      }
    }
  }
  eliminarPreguntas(index: number){
    this.preguntas.splice(index, 1);
  }
  eliminarOpciones(index: number){
    this.opciones.splice(index, 1);
  }
  onImagenSelected(event: any): void {
    const imagen_card: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result as string;
        img.onload = () => {
          const width = img.width;
          const height = img.height
          console.log(width, height);
          if (width != 40 || height != 40) {
            this.toastr.error('La imagen debe de tener una resolucion de 40x40 pixeles');
            return;
          }else{
            this.imagen = imagen_card;
          }
        }
    };
    reader.readAsDataURL(imagen_card);
    // this.portada = file_portada;
    // console.log(file_portada);
  }

}
