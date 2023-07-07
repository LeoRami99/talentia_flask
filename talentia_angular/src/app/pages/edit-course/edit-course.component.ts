import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCourseService } from '../../services/get-course/get-course.service';
import { UpdateCursoService } from 'src/app/services/update_curso/update-curso.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { UpdateStateCursoService } from 'src/app/services/update-state-curso/update-state-curso.service';
import { DeleteCursoService } from 'src/app/services/delete-curso/delete-curso.service';
import { DeleteSeccionService } from 'src/app/services/delete-seccion/delete-seccion.service';
import { DeleteSubseccionService } from 'src/app/services/delete-subseccion/delete-subseccion.service';
import { data } from 'jquery';

interface iSubseccion {
  id_seccion: number,
  titulo: string,
  url_conteido: string,
  descripcion: string
}
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
})
export class EditCourseComponent implements OnInit {
  isLoading: boolean = true;
  curso: any;
  addSubSection: boolean = false;
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
    private deleteCursoAll: DeleteCursoService,
    private deleteSeccion: DeleteSeccionService,
    private deleteSubseccion: DeleteSubseccionService
  ) {}
  // // se agrega los inputs model para despues poder editarlos
  // @Input() titulo: string='';
  @Input() categoria_id: string = '';
  // estado_curso
  @Input() estado_curso: string = '';
  categorias: any[] = [];

// models para las lecciones Subsecciones
@Input() titulo_leccion: string = '';
@Input() url_contenido: string = '';
@Input() descripcion_leccion: string = '';


  ngOnInit(): void {
    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe(
        (res: any) => {

          if (res.status === 200) {
            // console.log(res.curso);
            this.curso = res.curso;
            console.log(this.curso);
            this.isLoading = false;
          } else {
            confirm('Ocurrió un error al obtener el curso');
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
    // console.log(this.curso);
    // envio del json para actualizar la información del curso
    this.updateCurso.updateCurso(this.curso).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.toastr.success('Curso actualizado correctamente', 'Éxito');
          // console.log(this.curso);
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
  eliminarSeccion(id_seccion: any, id_curso: any, subsecciones: any){
    const data = {
      id_seccion: id_seccion,
      id_curso: id_curso,
      subsecciones: subsecciones
    }
    // console.log(data);
    this.deleteSeccion.deleteSeccion(data).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.toastr.success('Sección eliminada correctamente', 'Éxito');
          // recargar la página
          this.router.navigate(['/edit-courses']);
        } else {
          this.toastr.error('Ocurrió un error al eliminar la sección', 'Error');
        }
      },(error: any) =>{
        this.toastr.error('Ocurrió un error al eliminar la sección', 'Error');
      }
    );
  }
  eliminarSubseccion(id_subseccion: any, id_seccion: any){
    const data ={
      id_subseccion: id_subseccion,
      id_seccion: id_seccion
    }
    this.deleteSubseccion.deleteSubseccion(data).subscribe({
      next: (res: any) => {
        if( res.status === 200){
          this.toastr.success('Lección eliminada correctamente', 'Éxito');
          window.location.reload();
        }else{
          this.toastr.error('Ocurrió un error al eliminar la lección', 'Error');
        }
      }
    });
  }
  onAddSubsection(){
      this.addSubSection = true;
  }
  cancelAddSubsection(){
    this.addSubSection = false;
  }
  // Se recoge el objeto de la subsección con los models
  onAddSubsectionSubmit(id_seccion: any){
    return "Hola"
    // const data ={
    //   id_seccion: this.id_seccion,
    // }
  }
}
