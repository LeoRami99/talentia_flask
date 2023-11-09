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
import { CreateLeccionService } from 'src/app/services/create-leccion/create-leccion.service';
import { CreateModuleService } from 'src/app/services/create-module/create-module.service';
import { UploadImgsService } from 'src/app/services/upload_images/upload-imgs.service';
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
  public addSubSection: boolean[] = [];
  public isAccordionOpen: boolean[] = [];
  public addSection = false;

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
    private deleteSubseccion: DeleteSubseccionService,
    // servicio para agregar las lecciones
    private createLecciones: CreateLeccionService,
    // servicio para agregar las modulos
    private createModulos: CreateModuleService,
    private uploadImg: UploadImgsService
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
  // models para las secciones
  @Input() titulo_seccion: string = '';
  @Input() descripcion_seccion: string = '';
  card!: File;
  id_curso = this.routeActive.snapshot.params['id'];

  ngOnInit(): void {
    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe(
        (res: any) => {
          if (res.status === 200) {
            // console.log(res.curso);
            this.curso = res.curso;
            // console.log(this.curso);
            this.categoria_id = this.curso.categoria_id;
            // console.log(this.categoria_id);
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
    console.log(this.curso)
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
              'Éxito'
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
  deleteCurso() {
    this.deleteCursoAll.deleteCurso(this.curso).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.toastr.success('Curso eliminado correctamente', 'Éxito');
          // recargar la página
          this.router.navigate(['/edit-courses']);
        } else {
          this.toastr.error('Ocurrió un error al eliminar el curso', 'Error');
        }
      },
      (error: any) => {
        this.toastr.error('Ocurrió un error al eliminar el curso', 'Error');
      }
    );
  }
  eliminarSeccion(id_seccion: any, id_curso: any, subsecciones: any) {
    const data = {
      id_seccion: id_seccion,
      id_curso: id_curso,
      subsecciones: subsecciones,
    };
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
      },
      (error: any) => {
        this.toastr.error('Ocurrió un error al eliminar la sección', 'Error');
      }
    );
  }
  eliminarSubseccion(id_subseccion: any, id_seccion: any) {
    const data = {
      id_subseccion: id_subseccion,
      id_seccion: id_seccion,
    };
    this.deleteSubseccion.deleteSubseccion(data).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success('Lección eliminada correctamente', 'Éxito');
          window.location.reload();
        } else {
          this.toastr.error('Ocurrió un error al eliminar la lección', 'Error');
        }
      },
    });
  }
  onAddSection() {
    this.addSection = true;
  }
  cancelAddSection() {
    this.titulo_seccion = '';
    this.descripcion_seccion = '';
    this.addSection = false;
  }
  onAddSubsection(index: number) {
    this.addSubSection[index] = true;
  }
  cancelAddSubsection(index: number) {
    this.addSubSection[index] = false;
  }
  toggleAccordion(index: number) {
    this.isAccordionOpen[index] = !this.isAccordionOpen[index];
  }

  // Se recoge el objeto de la subsección con los models
  onAddSubsectionSubmit(id_seccion: any) {
    const data = {
      id_seccion: id_seccion,
      titulo_leccion: this.titulo_leccion,
      url_contenido: this.url_contenido,
      descripcion_leccion: this.descripcion_leccion,
    };
    if (
      data.titulo_leccion == '' ||
      data.url_contenido == '' ||
      data.descripcion_leccion == ''
    ) {
      this.toastr.error(
        'Debe llenar todos los campos para crear la lección',
        'Error'
      );
    } else {
      this.createLecciones.createLeccion(data).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.toastr.success('Lección creada correctamente', 'Éxito');
            window.location.reload();
          } else {
            this.toastr.error('Ocurrió un error al crear la lección', 'Error');
          }
        },
      });
    }
  }
  onAddModeuleSubmit(id_curso: any) {
    const data = {
      id_curso: id_curso,
      titulo_modulo: this.titulo_seccion,
      descripcion_seccion: this.descripcion_seccion,
    };
    if (data.titulo_modulo !== '' || data.descripcion_seccion !== '') {
      this.createModulos.createModule(data).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.toastr.success('Módulo creado correctamente', 'Éxito');
            window.location.reload();
          } else {
            this.toastr.error('Ocurrió un error al crear el módulo', 'Error');
          }
        },
        error: (error: any) => {
          this.toastr.error('Ocurrió un error al crear el módulo', 'Error');
        }
      });
    }else{
      this.toastr.error('Debe llenar todos los campos para crear el módulo', 'Error');
    }
  }

  onCardSelected(event: any): void {
    const file_card: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result as string;
        img.onload = () => {
          const width = img.width;
          const height = img.height
          if (width != 200 || height != 168) {
            this.toastr.error('La imagen para la tarjeta debe ser igual a 200x168 pixeles');
            return;
          }else{
            this.card = file_card;
          }
        }
    };
    reader.readAsDataURL(file_card);
  }
  actualizarImagenCard(){
    if (this.card == undefined) {
      this.toastr.error('Debe seleccionar una imagen para la tarjeta');
      return;
    }else{
      const formData = new FormData();
      formData.append('imagen_card', this.card);

      this.uploadImg.updateCard(formData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            // this.toastr.success('Tarjeta actualizada correctamente', 'Éxito');
            const data ={
              "id_curso": this.id_curso,
              "imagen_card": res.imagen_card
            }
            this.updateCurso.updateImagenCurso(data).subscribe({
              next: (res: any) => {
                if (res.status === 200) {
                  this.toastr.success('Imagen actualizada correctamente', 'Éxito');
                  window.location.reload();
                } else {
                  this.toastr.error('Ocurrió un error al actualizar la imagen', 'Error');
                }
              },
              error: (error: any) => {
                this.toastr.error('Ocurrió un error al actualizar la imagen', 'Error');
              }
            });

            
          } else {
            this.toastr.error('Ocurrió un error al actualizar la tarjeta', 'Error');
          }
        },
        error: (error: any) => {
          this.toastr.error('Ocurrió un error al actualizar la tarjeta', 'Error');
        }
      });
    }
  }
}
