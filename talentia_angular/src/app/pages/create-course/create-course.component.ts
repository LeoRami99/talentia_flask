import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ISection } from 'src/app/models/section.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UploadImgsService } from '../../services/upload_images/upload-imgs.service';
import { CreateCursoService } from '../../services/create_curso/create-curso.service';
import { EMPTY, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent {

  // Este selected files es para los dos imagenes portada y card
  // selectedFiles: Map<string, File> = new Map<string, File>();
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private upload_imgs: UploadImgsService,
    private crear_curso: CreateCursoService,
    private router: Router
  ) {}
  // declarar una variable de tipo file
  portada!: File;
  card!: File;

  // Datos para crear el curso
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imagen_portada: string = '';
  @Input() imagen_card: string = '';
  @Input() price: number = 0;
  @Input() categoria: string = '';
  @Input() tags: string = '';
  // @Input() url_video_intro: string="";
  @Input() url_video: string = '';

  isAddSection = false;
  hintError = 'Este campo es requerido';
  hintErrorLength = 'Este campo debe tener al menos 3 caracteres';
  sections: ISection[] = [];

  newSection: ISection = {
    headerTitle: '',
    items: [],
  };
  titleSectionInput = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  newSubsectionForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    url: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  currentSubsectionIndex = -1;
  onAddSection() {
    console.log(this.newSection);
    if (this.titleSectionInput.valid) {
      this.newSection.headerTitle = this.titleSectionInput.value!;
      this.sections.push(this.newSection);
      this.newSection = {
        headerTitle: '',
        items: [],
      };
      this.titleSectionInput.reset();
    }
    document.getElementById('cancelAddNewSectionButton')?.click();
  }

  onAddSubSection() {
    if (this.newSubsectionForm.valid) {
      if (this.currentSubsectionIndex !== -1) {
        this.newSection.items[this.currentSubsectionIndex] = {
          title: this.newSubsectionForm.value.title!,
          url: this.newSubsectionForm.value.url!,
          videoTiming: '00:00',
        };
      } else {
        this.newSection.items.push({
          title: this.newSubsectionForm.value.title!,
          url: this.newSubsectionForm.value.url!,
          videoTiming: '00:00',
        });
      }
      this.newSubsectionForm.reset();
      this.currentSubsectionIndex = -1;
    }
  }

  onEditSubSection(index: number) {
    this.newSubsectionForm.setValue({
      title: this.newSection.items[index].title,
      url: this.newSection.items[index].url,
    });
    // this.newSection.items.splice(index, 1);
    this.currentSubsectionIndex = index;
  }
  onDeleteSubSection(index: number) {
    this.newSection.items.splice(index, 1);
  }

  onPortadaSelected(event: any): void {
    const file_portada: File = event.target.files[0];
    this.portada = file_portada;
    // console.log(file_portada);
  }
  onCardSelected(event: any): void {
    const file_card: File = event.target.files[0];
    this.card = file_card;
    // console.log(file_card);
  }

  createCourse() {
    let json = {
      title: this.title,
      description: this.description,
      imagen_portada: '',
      imagen_card: '',
      price: this.price,
      categoria: this.categoria,
      tags: this.tags,
      url_video_intro: this.url_video,
      // las secciones y las subsecciones
      sections: this.sections,
    };
    // las categorias y los tags se omiten por el momento
    if (
      this.title !== '' &&
      this.description !== '' &&
      // this.price !== 0 &&

      this.url_video !== '' &&
      this.portada !== undefined &&
      this.card !== undefined
    ) {
      const formData = new FormData();
      formData.append('imagen_portada', this.portada);
      formData.append('imagen_card', this.card);
      this.upload_imgs
        .uploadImgs(formData)
        .pipe(
          catchError((err) => {
            this.toast.error('Error al subir las imagenes', 'Error');
            return EMPTY;
          }),
          tap((res: any) => {
            json.imagen_portada = res.imagen_portada;
            json.imagen_card = res.imagen_card;
            this.toast.success(
              'Imagenes subidas correctamente',
              'Imagenes subidas'
            );
            console.log(json);
            // enviar el json al backend
            this.crear_curso
              .createCurso(json)
              .pipe(
                catchError((err) => {
                  this.toast.error('Error al crear el curso', 'Error');
                  return EMPTY;
                }),
                tap((res: any) => {
                  this.toast.success(
                    'Curso creado correctamente',
                    'Curso creado'
                  );
                  console.log(res);
                  // redireccionar al home
                  this.router.navigate(['/home']);
                })

              )
              .subscribe();
          })
        )
        .subscribe();
      //  me dice empty porque no estoy retornando nada

      // console.log(json);
    }else{
      this.toast.error('Error al crear el curso. Complete todos los campos.', 'Error');
    }
  }
}
