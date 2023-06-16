import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCourseService } from '../../services/get-course/get-course.service';
import { UpdateCursoService } from 'src/app/services/update_curso/update-curso.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { UpdateStateCursoService } from 'src/app/services/update-state-curso/update-state-curso.service';
import { DeleteCursoService } from 'src/app/services/delete-curso/delete-curso.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
})
export class EditCourseComponent implements OnInit {
  isLoading: boolean = true;
  curso: any;
  // curso: Curso | undefined;
  constructor(
    private getcourse: GetCourseService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private updateCurso: UpdateCursoService,
    private toastr: ToastrService,
    private categoriasService: CategoriasService,
    private updateStateCurso: UpdateStateCursoService,
    // se agrega el nombre all ya que elimina todo lo relacionado a dicho curso
    private deleteCursoAll: DeleteCursoService
  ) {}
  // // se agrega los inputs model para despues poder editarlos
  // @Input() titulo: string='';
  @Input() categoria_id: string = '';
  // estado_curso
  @Input() estado_curso: string = '';
  categorias: any[] = [];
  ngOnInit(): void {
    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.curso = res.curso;
            console.log(this.curso);
            this.isLoading = false;
          } else {
            this.toastr.error('Ocurrió un error al obtener el curso', 'Error');
            this.router.navigate(['/courses']);
          }
        },
        (error: any) => {
          this.toastr.error('Ocurrió un error al obtener el curso', 'Error');
          this.router.navigate(['/courses']);
        }
      );
    });
    this.categoriasService.getCategorias().subscribe((data: any) => {
      this.categorias = data.categorias;
    });
  }
  saveChanges() {
    this.curso.categoria_id = this.categoria_id;
    console.log(this.curso);
    // envio del json para actualizar la información del curso
    this.updateCurso.updateCurso(this.curso).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.toastr.success('Curso actualizado correctamente', 'Éxito');
          // recargar la página
          window.location.reload();
        } else {
          this.toastr.error('Ocurrió un error al actualizar el curso', 'Error');
        }
      },
      (error: any) => {
        this.toastr.error('Ocurrió un error al actualizar el curso', 'Error');
      }
    );

    console.log(this.curso);
  }
  // Actualización de estado del curso
  updateEstadoCurso() {
    if (this.curso.estado == 1) {
      this.curso.estado = 0;
      this.updateStateCurso.updateStateCurso(this.curso).subscribe(
        (res: any) => {
          if (res.status === 200) {
            window.location.reload();
            this.toastr.success(
              'Estado del curso actualizado correctamente',
              'Éxito',
            );
            // recargar la página
            // esperar 3 segundos para recargar la página
          } else {
            this.toastr.error(
              'Ocurrió un error al actualizar el estado del curso',
              'Error'
            );
          }
        },
        (error: any) => {
          this.toastr.error(
            'Ocurrió un error al actualizar el estado del curso',
            'Error'
          );
        }
      );
    } else if (this.curso.estado == 0) {
      this.curso.estado = 1;
      this.updateStateCurso
        .updateStateCurso(this.curso)
        .subscribe((res: any) => {
          if (res.status === 200) {
            window.location.reload();
            this.toastr.success(
              'Estado del curso actualizado correctamente',
              'Éxito'
            );
            // recargar la página
          } else {
            this.toastr.error(
              'Ocurrió un error al actualizar el estado del curso',
              'Error'
            );
          }
        });
    }
  }
  deleteCurso(){
    this.deleteCursoAll.deleteCurso(this.curso).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.toastr.success('Curso eliminado correctamente', 'Éxito');
          // recargar la página
          this.router.navigate(['/edit-courses']);
        } else {
          this.toastr.error('Ocurrió un error al eliminar el curso', 'Error');
        }
      },(error: any) =>{
        this.toastr.error('Ocurrió un error al eliminar el curso', 'Error');
      }
    );
  }
}
