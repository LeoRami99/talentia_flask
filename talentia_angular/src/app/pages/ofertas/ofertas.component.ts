import { Component, OnInit, Input } from '@angular/core';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { OwlOptions } from 'ngx-owl-carousel-o';


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
  cursos_aleatorios : any;
  customOptions:OwlOptions={
    loop:true,
    autoplay:true,
    mouseDrag:true,
    touchDrag:true,
    pullDrag:true,
    dots:false,
    navSpeed:1000,
    margin:10,
    // navText:['<','>'],
    responsive:{
      0:{
        items:1
      },
      400:{
        items:2
      },
      740:{
        items:2
      },
      940:{
        items:2
      }
    },
    // nav:true
  }

  constructor(private ofertas: OfertaEmpresaService, private cursosAleatorios: GetCourseService) { }
  ngOnInit(): void {
    this.cursosAleatorios.getCoursesAleatorios().subscribe({
      next: (data: any) => {
        if (data) {
          this.cursos_aleatorios = data.data;
        }else{
          this.cursos_aleatorios = [];
        }
      },
      error: (error: any) => {
        this.cursos_aleatorios = [];
      }
    })
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
        this.ofertasTodos = data.ofertas.reverse();
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
