import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';

@Component({
  selector: 'app-edit-examenes',
  templateUrl: './edit-examenes.component.html',
  styleUrls: ['./edit-examenes.component.css']
})
export class EditExamenesComponent  implements OnInit {
  constructor(private examen: ExamenesService, private toastr: ToastrService) {}
  examenes: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  // totalPages: number = 1; // Añade esta línea
  filtroNombre: string = '';
  examenesFiltrados: any[] = [];
  loading = false;

  ngOnInit(): void {
    this.examen.getExamenes().subscribe(
      (res: any) => {
        this.examenes = res;
        this.loading = true;
        this.filtrarExamen();
      },
      (err: any) => {
        this.toastr.error('Ocurrio un error al obtener los examenes', 'Error');
      }
    );
  }

  filtrarExamen() {
    let filteredExams = this.examenes;
    if (this.filtroNombre) {
      filteredExams = this.examenes.filter((examen: { nombre: string }) =>
        examen.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }

    // Calcula el número total de páginas
    // this.totalPages = Math.ceil(filteredExams.length / this.itemsPerPage);

    // this.paginateResults(filteredExams);
  }

  // paginateResults(data: any[]) {
  //   const startItem = (this.currentPage - 1) * this.itemsPerPage;
  //   const endItem = this.currentPage * this.itemsPerPage;

  //   this.examenesFiltrados = data.slice(startItem, endItem);
  // }

  // onPageChange(page: number) {
  //   if (page >= 1 && page <= this.totalPages) { // Asegurarse de que la página esté en el rango permitido
  //     this.currentPage = page;
  //     this.filtrarExamen();
  //   }
  // }

//   previousPage() {
//     if (this.currentPage > 1) {
//         this.onPageChange(this.currentPage - 1);
//     }
// }

// nextPage() {
//     if (this.currentPage < this.totalPages) {
//         this.onPageChange(this.currentPage + 1);
//     }
// }


}
