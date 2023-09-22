import { Component, Input, OnInit } from '@angular/core';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
const jwt = new JwtHelperService();

// interface IExamen{
//   id: number;
//   nombre: string;
//   descripcion: string;
//   imagen : string;
//   duracion: string;
// }
@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
})
export class ExamenesComponent implements OnInit {
  constructor(private examen: ExamenesService, private toastr: ToastrService) {}
  examenes: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  examenesAuxiliar: any = [];

  filtroNombre: string = '';
  examenesFiltrados: any[] = [];
  examenes_aprobados: any = [];
  loading = false;


  ngOnInit(): void {
    this.loading = true;

    // Obtiene el ID del usuario desde el token
    const userId = jwt.decodeToken(localStorage.getItem('token') || '')['id'];

    // Obtén el progreso del usuario
    this.examen.getProgresoUsuario(userId).subscribe(
        (progreso: any) => {
            // Si el progreso es nulo, indefinido o un arreglo vacío, muestra todos los exámenes
            if (!progreso || progreso.length === 0) {
                this.getAllExamenes();
                return;
            }

            // Creamos un array de IDs de exámenes que el usuario ya aprobó
            const examenesAprobadosIds = progreso.data.map((examen: any) => examen.id_examen);

            // Luego, obtén todos los exámenes
            this.examen.getExamenes().subscribe(
                (res: any) => {
                    // Filtra aquellos exámenes que NO están en la lista de aprobados
                    this.examenes = res.filter((examen: any) => !examenesAprobadosIds.includes(examen.id));
                    this.filtrarExamen();
                    this.loading = false;
                },
                (err: any) => {
                    this.toastr.error('Ocurrió un error al obtener los exámenes', 'Error');
                    this.loading = false;
                }
            );
        },
        (err: any) => {
            // Si el error es 400, se interpreta como que el usuario no tiene progreso
            if (err.status === 400) {
                this.getAllExamenes();
            } else {
                this.toastr.error('Ocurrió un error al obtener el progreso del usuario', 'Error');
                this.loading = false;
            }
        }
    );
}

getAllExamenes() {
    this.examen.getExamenes().subscribe(
        (res: any) => {
            this.examenes = res;
            this.filtrarExamen();
            this.loading = false;
        },
        (err: any) => {
            this.toastr.error('Ocurrió un error al obtener los exámenes', 'Error');
            this.loading = false;
        }
    );
}

filtrarExamen() {
    this.examenesFiltrados = this.examenes.filter((examen: any) =>
        examen.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
}




}
