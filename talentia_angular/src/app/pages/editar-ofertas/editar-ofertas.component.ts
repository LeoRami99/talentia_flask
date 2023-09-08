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
  itemsPerPage: number = 10;
  ofertasFiltradas: any[] = [];

  constructor(private ofertas: OfertaEmpresaService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decodeToken(token);
      this.ofertas.getEmpresaById(decodedToken['id']).pipe(
        switchMap((data_empresa: any) => {
          return this.ofertas.allOfertas().pipe(
            switchMap((data_oferta: any) => {
              this.ofertas_por_empresa = data_oferta.ofertas.filter((oferta: any) => oferta.id_empresa == data_empresa.empresa[0].id);
              return this.ofertas_por_empresa; // Esto es opcional, dependiendo de si necesitas el valor en el siguiente observable.
            })
          );
        })
      ).subscribe({
        next: (result) => {
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
}
