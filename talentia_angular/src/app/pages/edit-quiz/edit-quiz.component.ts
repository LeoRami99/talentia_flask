import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';
import { UpdateEstadoExamenService } from 'src/app/services/update-estado-examen/update-estado-examen.service';

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


}
