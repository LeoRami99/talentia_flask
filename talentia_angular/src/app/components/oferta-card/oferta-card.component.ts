import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { ToastrService } from 'ngx-toastr';


const jwt = new JwtHelperService();

@Component({
  selector: 'app-oferta-card',
  templateUrl: './oferta-card.component.html',
  styleUrls: ['./oferta-card.component.css']
})
export class OfertaCardComponent {

    @Input() nombre_oferta: string="";
    @Input() descripcion_oferta: string="";
    // las habilidades vienen en un array
    @Input() habilidades_oferta:any=[];
    @Input () ubicacion: string="";
    @Input() modalidad: string="";
    @Input() id_oferta: string="";
    @Input() id_usuario: string="";
    // id del usuario



    constructor(private router: Router, private ofertaService: OfertaEmpresaService, private toast: ToastrService) { }

    verOferta(){
      this.router.navigate(['/ver-oferta', this.id_oferta]);
    }
    aplicarOferta(){
      const data = {
        id_usuario: this.id_usuario,
        id_oferta: this.id_oferta
      }
      this.ofertaService.aplicarOferta(data).subscribe({
        next: (data:any) => {
          if(data.status == 200){
            this.toast.success(data.message);
          }},
        error: (error:any) => {
          this.toast.error(error.error.message);
        }
      })
    }
}
