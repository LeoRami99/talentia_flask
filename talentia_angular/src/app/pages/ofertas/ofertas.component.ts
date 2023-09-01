import { Component, OnInit, Input } from '@angular/core';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { JwtHelperService } from '@auth0/angular-jwt';


const jwt = new JwtHelperService();

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  ofertasTodos: any;
  ofertasBusqueda: any;
  @Input() filtro: string = '';
  id_usuario = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private ofertas: OfertaEmpresaService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token != null){
      const tokenPayload:any = jwt.decodeToken(token);
      this.id_usuario = tokenPayload["id"];
      console.log(this.id_usuario);
    }


    this.ofertas.allOfertas().subscribe(
      (data: any) => {
        this.ofertasTodos = data.ofertas;
        console.log(this.ofertasTodos);
        this.filtrarOfertas();
      },
      error => {
        console.error("Error al obtener las ofertas:", error);
      }
    );
  }

  filtrarOfertas() {
    this.ofertasBusqueda = this.ofertasTodos.filter((oferta: any) =>
      oferta.titulo.toLowerCase().includes(this.filtro)
    );
  }
}
