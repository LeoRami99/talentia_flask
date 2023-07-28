import { Component, OnInit , Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';
import { UpdateEstadoExamenService } from 'src/app/services/update-estado-examen/update-estado-examen.service';

interface IPregunta {
  pregunta: string;
  opciones: IOpcion[];
}
interface IOpcion {
  opcion: string;
  opcion_correcta: string;
}
@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.css'],
})

export class EditQuizComponent implements OnInit {
  constructor(
    private actRouter: ActivatedRoute,
    private examenService: ExamenesService,
    private toastr: ToastrService,
    private router: Router,
    private estadoExamen: UpdateEstadoExamenService
  ) {}
  examen: any = {};
  // Inputs models para crear las opciones de las preguntas
  @Input() opcion_create: string = '';
  @Input() opcion_correcta_create : string = '';
  // inputs para crear preguntas con opciones nuevas desde
  preguntas: IPregunta[] = [];
  opciones: IOpcion[] = [];
  @Input() pregunta_create: string = '';
  @Input() opcion: string = '';
  @Input() opcion_correcta: string = 'false';

  ngOnInit(): void {
    this.actRouter.params.subscribe((params) => {
      this.examenService.getExamen(params['id']).subscribe(
        (data: any) => {
          if (data.status === 200) {
            this.examen = data.examen;
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        (error: any) => {
          // redirigir a editar examenes
          this.toastr.error('Error al obtener el examen', 'Error');
          this.router.navigate(['/edit-examenes']);
        }
      );
    }).add(() => {
      // do something when the subscription is completed
    });
  }
  tieneRespuestaVerdadera(data:any): boolean {
    return data.some((opcion:any) => opcion.opcion_correcta == 'true');
  }

  updateEstadoExamen(){
    if(this.examen.estado === '1'){
      this.estadoExamen.updateEstadoExmanen({id:this.examen.id,estado:'0'}).subscribe((res:any)=>{
        if(res.status == 200){
          this.toastr.success('El examen se ha desactivado correctamente', 'Exito');
          window.location.reload()
        }else{
          this.toastr.error('Error al desactivar el examen', 'Error');
        }
      })
    }else if (this.examen.estado === '0'){
      this.estadoExamen.updateEstadoExmanen({id:this.examen.id,estado:'1'}).subscribe((res:any)=>{
        if(res.status == 200){
          this.toastr.success('El examen se ha activado correctamente', 'Exito');
          window.location.reload()
        }else{
          this.toastr.error('Error al activar el examen', 'Error');
        }
      })
    }
  }

  // crear Opciones para las preguntas
  createOption(id_pregunta:any, opcion:any, opcion_correcta:any ) {
    if (id_pregunta !== '' && opcion !=='' && opcion_correcta !==''){

      this.examenService.createOption({id_pregunta, opcion, opcion_correcta}).subscribe((res:any)=>{
        if(res.status == 200){
          this.toastr.success('La opción se ha creado correctamente', 'Exito');
          window.location.reload()
        }else{
          this.toastr.error('Error al crear la opción', 'Error');
        }
      })
    }else{
      this.toastr.error('Error al crear la opción', 'Error');
    }
  }
  deleteOpcion(id:any){
    if(id!==''){
      this.examenService.deleteOption(id).subscribe((res:any)=>{
        if(res.status == 200){
          this.toastr.success('La opción se ha eliminado correctamente', 'Exito');
          window.location.reload()
        }else{
          this.toastr.error('Error al eliminar la opción', 'Error');
        }
      })
    }
  }

  updateExamen(){
      console.log(this.examen);
      this.examenService.updateExamen(this.examen).subscribe((res:any)=>{
        if(res.status == 200){
          this.toastr.success('El examen se ha actualizado correctamente', 'Exito');
          window.location.reload()
        }else{
          this.toastr.error('Error al actualizar el examen', 'Error');
        }
      })
  }
  // createPregunta(id_examen:any, pregunta:any, tipo_pregunta:any){

  //
  addOpcion(){
    if(this.opcion !== '' && this.opcion_correcta !== ''){
      this.opciones.push({opcion:this.opcion, opcion_correcta:this.opcion_correcta});
      this.opcion = '';
      // this.opcion_correcta = '';
    }
    console. log(this.opciones);
  }
  eliminarOpcion(index:number){
    this.opciones.splice(index, 1);
  }

  createPregunta(){
    if(this.pregunta_create !== '' && this.opciones.length > 0){
      let contador = 0;
      for (let i = 0; i < this.opciones.length; i++) {
        if (this.opciones[i].opcion_correcta === 'true') {
          contador++;
        }
      }
      if(contador === 0 || contador > 1){
        this.toastr.error('La pregunta debe tener una sola respuesta correcta', 'Error');
        return;
      }else{
        this.preguntas.push({pregunta:this.pregunta_create, opciones:this.opciones});
        const data={
          id_examen:this.examen.id,
          pregunta:this.pregunta_create,
          opciones:this.opciones
        }
        this.examenService.createPregunta(data).subscribe((res:any)=>{
          if(res.status == 200){
            this.toastr.success('La pregunta se ha creado correctamente', 'Exito');
            window.location.reload()
          }else{
            this.toastr.error('Error al crear la pregunta', 'Error');
          }
        })
        this.pregunta_create = '';
        this.opciones = [];
      }
    }
  }
  eliminarPregunta(id:any){
    if(id!==''){
      this.examenService.deletePregunta(id).subscribe((res:any)=>{
        if(res.status == 200){
          this.toastr.success('La pregunta se ha eliminado correctamente', 'Exito');
          window.location.reload()
        }else{
          this.toastr.error('Error al eliminar la pregunta', 'Error');
        }
      })
    }
  }


}
