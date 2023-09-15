import { Component, OnInit } from '@angular/core';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { JwtHelperService } from '@auth0/angular-jwt';
const jwt = new JwtHelperService();

@Component({
  selector: 'app-dashboard-empresa',
  templateUrl: './dashboard-empresa.component.html',
  styleUrls: ['./dashboard-empresa.component.css']
})
export class DashboardEmpresaComponent implements OnInit {
    contadorOfertas = 0;
    contadorOfertasInactivas = 0;
    contadorUsuariosAplicaronOferta = 0;
    constructor(private oferta: OfertaEmpresaService) { }

    ngOnInit(): void {
      const token = localStorage.getItem('token');
      if(token != null){
        const tokenPayload:any = jwt.decodeToken(token);
        this.oferta.allOfertas().subscribe((data:any)=>{
          data.ofertas.filter((oferta:any)=>{
            this.oferta.getEmpresaById(tokenPayload['id']).subscribe((data_empresa:any)=>{
              for(let i = 0; i < data_empresa.empresa.length; i++){
                if(oferta.id_empresa == data_empresa.empresa[i].id){
                  this.oferta.usuariosAplicaronOferta().subscribe((data_usuarios:any)=>{
                    data_usuarios.ofertas.filter((usuario:any)=>{
                      if(usuario.id_oferta == oferta.id){
                        this.contadorUsuariosAplicaronOferta += 1;
                      }
                    })
                  })
                  if(oferta.estado == 1){
                    this.contadorOfertas += 1;
                  }else{
                    this.contadorOfertasInactivas += 1;
                  }
                }
              }
            })
          })
          // this.contadorOfertas = data.ofertas.length
        });
      }
    }
}
