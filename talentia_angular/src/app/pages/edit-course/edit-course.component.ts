import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCourseService } from '../../services/get-course/get-course.service';
import { UpdateCursoService } from 'src/app/services/update_curso/update-curso.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';

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
    private categoriasService: CategoriasService
  ) {}
  // // se agrega los inputs model para despues poder editarlos
  // @Input() titulo: string='';
  @Input() categoria_id: string='';
  categorias: any[] = [];
  ngOnInit(): void {
    this.routeActive.params.subscribe((params) => {
      this.getcourse.getCourse(params['id']).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.curso = res.curso;
            // console.log(this.curso);
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
}
