import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ISection } from 'src/app/models/section.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UploadImgsService } from '../../services/upload_images/upload-imgs.service';
import { CreateCursoService } from '../../services/create_curso/create-curso.service';
import { EMPTY, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwt = new JwtHelperService();

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent implements OnInit {
  // Este selected files es para los dos imagenes portada y card
  // selectedFiles: Map<string, File> = new Map<string, File>();
  constructor(
    private toast: ToastrService,
    private upload_imgs: UploadImgsService,
    private crear_curso: CreateCursoService,
    private router: Router,
    private categoriasService: CategoriasService,
    private rolesService: RolesService
  ) {}

  // declarar una variable de tipo file
  portada!: File;
  card!: File;

  // array para guardar las categorias
  categorias: any[] = [];

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
  @Input() dificultad: string = '';
  SelectTags: string[] = [];
  // array con opciones
  tagsOptions = [
    { name: 'Angular', value: 'Angular' },
    { name: 'JavaScript', value: 'JavaScript' },
    { name: 'TypeScript', value: 'TypeScript' },
  ];

  // SelectTags = []; // Definimos el array para guardar las selecciones

  ngOnInit() {


    this.categoriasService.getCategorias().subscribe((data: any) => {
      // console.log(data.categorias);
      // console.log(data.categorias);
      this.categorias = data.categorias;
    });
  }

  isAddSection = false;
  hintError = 'Este campo es requerido';
  hintErrorLength = 'Este campo debe tener al menos 3 caracteres';
  sections: ISection[] = [];

  newSection: ISection = {
    headerTitle: '',
    descriptionSection: '',
    items: [],
  };
  titleSectionInput = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  descriptionSectionTextArea = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  newSubsectionForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    url: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion : new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  currentSubsectionIndex = -1;
  onAddSection() {
    // console.log(this.newSection);
    if (this.titleSectionInput.valid) {
      this.newSection.headerTitle = this.titleSectionInput.value!;
      this.newSection.descriptionSection = this.descriptionSectionTextArea.value!;
      this.sections.push(this.newSection);
      this.newSection = {
        headerTitle: '',
        descriptionSection: '',
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
          descripcion: this.newSubsectionForm.value.descripcion!,
          videoTiming: '00:00',
        };
      } else {
        this.newSection.items.push({
          title: this.newSubsectionForm.value.title!,
          url: this.newSubsectionForm.value.url!,
          descripcion: this.newSubsectionForm.value.descripcion!,
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
      descripcion: this.newSection.items[index].descripcion
    });
    // this.newSection.items.splice(index, 1);
    this.currentSubsectionIndex = index;
  }
  onDeleteSubSection(index: number) {
    this.newSection.items.splice(index, 1);
  }

  // onPortadaSelected(event: any): void {
  //   const file_portada: File = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //       const img = new Image();
  //       img.src = e.target.result as string;
  //       img.onload = () => {
  //         const width = img.width;
  //         const height = img.height
  //         console.log(width, height);
  //         if (width != 1000 || height != 800) {
  //           this.toast.error('La imagen debe de tener una resolucion de 1000x800 pixeles');
  //           return;
  //         }else{
  //           this.portada = file_portada;
  //         }
  //       }
  //   };
  //   reader.readAsDataURL(file_portada);
  //   // this.portada = file_portada;
  //   // console.log(file_portada);
  // }
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
            this.toast.error('La imagen para la tarjeta debe ser igual a 200x168 pixeles');
            return;
          }else{
            this.card = file_card;
          }
        }
    };

    reader.readAsDataURL(file_card);
    // this.card = file_card;
    // console.log(file_card);
  }

  createCourse() {
    console.log("Esto es los tags: ", this.SelectTags);
    let json = {
      title: this.title,
      description: this.description,
      imagen_portada: 'portada',
      imagen_card: '',
      price: this.price,
      categoria: this.categoria,
      tags: this.tags,
      dificultad: this.dificultad,
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
      this.card !== undefined
    ) {
      const formData = new FormData();
      // formData.append('imagen_portada', this.portada);
      formData.append('imagen_card', this.card);
      this.upload_imgs
        .uploadImgs(formData)
        .pipe(
          catchError((err) => {
            this.toast.error('Error al subir las imagenes', 'Error');
            return EMPTY;
          }),
          tap((res: any) => {
            // json.imagen_portada = 'imagen_portada';
            json.imagen_card = res.imagen_card;
            // console.log(json);
            // enviar el json al backend
            this.crear_curso.createCurso(json).pipe(
                catchError((err) => {
                  this.toast.error('Error al crear el curso', 'Error');
                  return EMPTY;
                }),
                tap((res: any) => {
                  this.router.navigate(['/courses']);
                  this.toast.success(
                    'Curso creado correctamente',
                    'Curso creado'
                  );
                  // console.log(res);
                  // redireccionar al home
                })
              )
              .subscribe();
          })
        )
        .subscribe();

      // console.log(json);
    } else {
      this.toast.error(
        'Error al crear el curso. Complete todos los campos.',
        'Error'
      );
    }
  }
}
