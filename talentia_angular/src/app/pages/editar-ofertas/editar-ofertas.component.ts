import { Component, OnInit } from '@angular/core';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

const jwt = new JwtHelperService();

@Component({
  selector: 'app-editar-ofertas',
  templateUrl: './editar-ofertas.component.html',
  styleUrls: ['./editar-ofertas.component.css']
})
export class EditarOfertasComponent implements OnInit {
  ofertas_por_empresa: any[] = [];
  input_busqueda = "";
  currentPage: number = 1;
  itemsPerPage: number = 9;
  ofertasFiltradas: any[] = [];
  loading = true;

  constructor(private ofertas: OfertaEmpresaService, private router: Router) {}
  dtOptions: DataTables.Settings = {};
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "Ningún elemento encontrado",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la columna de manera ascendente",
          sortDescending: ": Activar para ordenar la columna de manera descendente"
        }
      }
    };
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decodeToken(token);
      this.ofertas.getEmpresaById(decodedToken['id']).pipe(
        switchMap((data_empresa: any) => {
          return this.ofertas.allOfertas().pipe(
            switchMap((data_oferta: any) => {
              this.loading = false;
              this.ofertas_por_empresa = data_oferta.ofertas.filter((oferta: any) => oferta.id_empresa == data_empresa.empresa[0].id);
              return this.ofertas_por_empresa; // Esto es opcional, dependiendo de si necesitas el valor en el siguiente observable.
            })
          );
        })
      ).subscribe({
        next: (result) => {
          this.loading = false;
          this.ofertasFiltroBusqueda();
        },
        error: (err) => {
          console.error("Error al obtener las ofertas:", err);
        }
      });
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  ofertasFiltroBusqueda() {
    this.ofertasFiltradas = this.ofertas_por_empresa.filter((oferta: any) => oferta.titulo.toLowerCase().includes(this.input_busqueda.toLowerCase()));
  }
  // ver postulantes
  verPostulantes(id: any) {
    this.router.navigate(['/ver-postulantes', id]);
  }
  editarOferta(id: any) {
    this.router.navigate(['/editar-oferta', id]);
  }
}
