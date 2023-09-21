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
  itemsPerPage: number = 10;
  examenesAuxiliar: any = [];

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
            this.filtrarExamen();
        }
      },
      (err: any) => {
        this.toastr.error('Ocurrio un error al obtener los examenes', 'Error');
      }
    );
  }

  filtrarExamen() {
    this.examenesFiltrados = this.examenes.filter((examen: any) =>
      examen.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }
}
