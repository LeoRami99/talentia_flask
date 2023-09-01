import { Component, Input, OnInit} from '@angular/core';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
const jwt= new JwtHelperService();
//ng-select

@Component({
  selector: 'app-crear-oferta',
  templateUrl: './crear-oferta.component.html',
  styleUrls: ['./crear-oferta.component.css']
})
export class CrearOfertaComponent implements OnInit {
  constructor(private ofertaEmpresaService: OfertaEmpresaService, private toastr: ToastrService, private router: Router) { }
  habilidades:any;
  @Input() nombre_oferta: string = '';
  @Input() descripcion_oferta: string = '';
  @Input() salario: string = '';
  @Input() fecha_cierre: string = '';
  @Input() tipo_contrato: string = '';
  @Input() modalidad: string = '';
  @Input() requisitos: string = '';
  @Input() habilidades_oferta: any [] = [];
  @Input() empresa_oferta: string = '';
  @Input() url_referencia: string = '';
  @Input() pais: string = '';
  @Input() ciudad: string = '';
  id_empresa : string = ""
  empresa:any;
  id_usuario : string = ""
  nombre_empresa_view : string = ""
  mensajeAlerta : string = ""
  ngOnInit(): void {
    this.ofertaEmpresaService.getHabilidades().subscribe(
      (data:any)=>{
        if (data.status == 200) {
          this.habilidades=data.habilidades[0];
        }else{
          this.toastr.error("Error al cargar las habilidades", "Error");
        }
      },(error:any)=>{
        this.toastr.error("Error al cargar las habilidades", "Error");
      }
    )
    const token = localStorage.getItem('token');
    if (token) {
      const data_token = jwt.decodeToken(token);
      this.id_usuario = data_token['id'];
    }
    this.ofertaEmpresaService.getEmpresaById(this.id_usuario).subscribe(
      (data:any)=>{
        if (data.status==200) {
          this.empresa=data.empresa;
        }
      }
    )
  }
  selectedCar: number=0;
  nombreEmpresaPreview(id_empresa:string){
    this.id_empresa = id_empresa;
    this.empresa.filter((empresa:any)=>{
      if (empresa.id==id_empresa) {

        this.nombre_empresa_view =  empresa.nombre;
        return empresa.nombre;
      }else{
        return "";
      }
    })
  }
  // función para crear oferta y enviarla al backend
  crearOferta(){
    const data={
      id_empresa: this.id_empresa,
      nombre_oferta: this.nombre_oferta,
      descripcion_oferta: this.descripcion_oferta,
      fecha_publicacion: new Date(),
      fecha_cierre: this.fecha_cierre,
      salario : this.salario,
      tipo_contrato: this.tipo_contrato,
      modalidad: this.modalidad,
      requisitos: this.requisitos,
      url_referencia: this.url_referencia,
      pais: this.pais,
      ciudad: this.ciudad,
      habilidades: this.habilidades_oferta,
      estado: "1"
    }
    const condiciones={
      id_empresa: '',
      nombre_oferta: '',
      descripcion_oferta: '',
      fecha_publicacion: '',
      fecha_cierre: '',
      salario : '',
      tipo_contrato: '',
      modalidad: '',
      requisitos: '',
      url_referencia: '',
      pais: '',
      ciudad: '',
      habilidades:[],
    }
    let mensajes = [];
    if (condiciones.id_empresa == data.id_empresa) mensajes.push("El campo de empresa no puede estar vacío");
    if (condiciones.nombre_oferta == data.nombre_oferta) mensajes.push("El campo nombre de la oferta no puede estar vacío");
    if (condiciones.descripcion_oferta == data.descripcion_oferta) mensajes.push("El campo descripción de la oferta no puede estar vacío");
    if (condiciones.fecha_cierre == data.fecha_cierre) mensajes.push("El campo fecha de cierre no puede estar vacío");
    if (condiciones.salario == data.salario) mensajes.push("El campo salario no puede estar vacío");
    if (condiciones.tipo_contrato == data.tipo_contrato) mensajes.push("El campo tipo de contrato no puede estar vacío");
    if (condiciones.modalidad == data.modalidad) mensajes.push("El campo modalidad no puede estar vacío");
    if (condiciones.requisitos == data.requisitos) mensajes.push("El campo requisitos no puede estar vacío");
    if (condiciones.url_referencia == data.url_referencia) mensajes.push("El campo url de referencia no puede estar vacío");
    if (condiciones.pais == data.pais) mensajes.push("El campo pais no puede estar vacío");
    if (condiciones.ciudad == data.ciudad) mensajes.push("El campo ciudad no puede estar vacío");
    if (condiciones.habilidades.length == data.habilidades.length) mensajes.push("El campo habilidades no puede estar vacío");
    if (mensajes.length > 0) {
        console.log(this.habilidades_oferta);
        for (let i = 0; i < mensajes.length; i++) {
            this.toastr.error(mensajes[i], "Error");
        }
    } else {
        // this.toastr.success("Oferta creada con éxito", "Éxito");
        this.ofertaEmpresaService.crearOferta(data).subscribe(
          (data:any)=>{
            if (data.status == 200) {

              this.toastr.success("Oferta creada con éxito", "Éxito");
              this.router.navigate(['/inicio']);
            }else{
              this.toastr.error("Error al crear la oferta", "Error");
            }
          }
        );
    }



    // this.ofertaEmpresaService.crearOferta(data).subscribe()}



  }

}
