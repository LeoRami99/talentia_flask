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
  itemsPerPage: number = 10;
  filtroHabilidad = '';
  filtroModalidad = '';
  loading = true;
  habilidades: any;

  constructor(private ofertas: OfertaEmpresaService) { }

  ngOnInit(): void {
    this.ofertas.getHabilidades().subscribe((data: any) => {
      if (data.status == 200) {
        this.habilidades = data.habilidades[0];
      }else{
        console.error("Error al obtener las habilidades:", data);
      }
    });
    const token = localStorage.getItem('token');
    if(token != null){
      const tokenPayload:any = jwt.decodeToken(token);
      this.id_usuario = tokenPayload["id"];
    }


    this.ofertas.allOfertas().subscribe(
      (data: any) => {
        this.ofertasTodos = data.ofertas;
        this.filtrarOfertas();
        this.loading = false;
      },
      error => {
        console.error("Error al obtener las ofertas:", error);
        this.loading = true;
      }
    );
  }

  filtrarOfertas() {
    this.ofertasBusqueda = this.ofertasTodos.filter((oferta: any) =>
      oferta.titulo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  get ofertasFiltradas() {
    return this.ofertasBusqueda.filter((oferta:any) => {
      const habilidadCoincide = this.filtroHabilidad ? oferta.habilidades.some((habilidad:any) => habilidad.nombre.toLowerCase().includes(this.filtroHabilidad.toLowerCase())) : true;
      const modalidadCoincide = this.filtroModalidad ? oferta.modalidad === this.filtroModalidad : true;
      return habilidadCoincide && modalidadCoincide;
    });
  }


}
