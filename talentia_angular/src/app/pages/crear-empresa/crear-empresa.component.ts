import { Component, Input, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';

const jwt = new JwtHelperService();
@Component({
  selector: 'app-crear-empresa',
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['./crear-empresa.component.css'],
})
export class CrearEmpresaComponent implements OnInit {
  constructor(
    private toastr:ToastrService,
    private ofertaEmpresa: OfertaEmpresaService
  ) {}
  @Input() nombre_empresa: string = '';
  @Input() direccion_empresa: string = '';
  @Input() telefono_empresa: string = '';
  @Input() website_empresa: string = '';
  id_usuario : string = ""
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const data_token = jwt.decodeToken(token);
      this.id_usuario = data_token['id'];
    } else {
      window.location.href = '/';
    }
  }
  crearEmpresa(){
    console.log(this.nombre_empresa)
    console.log(this.direccion_empresa)
    console.log(this.telefono_empresa)
    console.log(this.website_empresa)
    if (this.nombre_empresa != '' && this.direccion_empresa != '' && this.telefono_empresa != '' && this.website_empresa != '') {
      const data ={
        nombre:this.nombre_empresa,
        direccion: this.direccion_empresa,
        telefono: this.telefono_empresa,
        website: this.website_empresa,
        id_usuario: this.id_usuario
      }
      this.ofertaEmpresa.crearEmpresa(data).subscribe({
        next: (data:any) => {
          if(data.status == 200){
            console.log(data);
            this.toastr.success("Empresa creada correctamente")
            // window.location.href = '/ofertas';
          }else{
            this.toastr.error("Error al crear la empresa")
          }
        },
        error: (error) => {
          console.log(error);
          this.toastr.error("Error al crear la empresa")
        },
      });
    }else{
      this.toastr.error("Todos los campos son obligatorios")
    }
  }
}
