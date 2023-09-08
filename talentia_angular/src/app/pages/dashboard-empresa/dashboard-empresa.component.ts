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
    constructor(private oferta: OfertaEmpresaService) { }

    ngOnInit(): void {
      const token = localStorage.getItem('token');
      if(token != null){
        const tokenPayload:any = jwt.decodeToken(token);
        console.log(tokenPayload["id"]);
        this.oferta.allOfertas().subscribe((data:any)=>{
          data.ofertas.filter((oferta:any)=>{
            if(oferta.estado == 1){
              this.contadorOfertas += 1;
            }
          })
          // this.contadorOfertas = data.ofertas.length
        });
      }
    }
}
