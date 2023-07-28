import { Component, Input, OnInit } from '@angular/core';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';
import { ToastrService } from 'ngx-toastr';

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
  examenesAuxiliar: any = [];
  itemsPerPage: number = 12;
  totalPages: number = 1; // Añade esta línea
  filtroNombre: string = '';
  examenesFiltrados: any[] = [];






  ngOnInit(): void {
    this.examen.getExamenes().subscribe(
      (res: any) => {

        this.examenesAuxiliar = res;
        for (let index = 0; index < this.examenesAuxiliar.length; index++) {
            if (this.examenesAuxiliar[index].estado==='1') {
              this.examenes.push(this.examenesAuxiliar[index]);
            }
        }
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
    this.totalPages = Math.ceil(filteredExams.length / this.itemsPerPage);

    this.paginateResults(filteredExams);
  }

  paginateResults(data: any[]) {
    const startItem = (this.currentPage - 1) * this.itemsPerPage;
    const endItem = this.currentPage * this.itemsPerPage;

    this.examenesFiltrados = data.slice(startItem, endItem);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) { // Asegurarse de que la página esté en el rango permitido
      this.currentPage = page;
      this.filtrarExamen();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
        this.onPageChange(this.currentPage - 1);
    }
}

nextPage() {
    if (this.currentPage < this.totalPages) {
        this.onPageChange(this.currentPage + 1);
    }
}


}
