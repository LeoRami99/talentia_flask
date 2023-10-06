import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api_service/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { API_URL } from 'src/app/api.constants';
import { JwtHelperService } from '@auth0/angular-jwt';
const jwt = new JwtHelperService();

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.css']
})
export class NabvarComponent implements OnInit{
  mostrarContenidoHTML: boolean = false;
  mostrarIconUser: boolean = false;
  imagen_perfil: string = '';
  url_api = API_URL;
  check_foto = false;
  constructor(public auth: ApiService, private router: Router, private user: UserDataService) {
    // Suscríbete a los eventos del router
    this.router.events.subscribe((event:any) => {
      if (event.routerEvent.urlAfterRedirects === '/login' || event.routerEvent.urlAfterRedirects === '/signup') {
        this.mostrarContenidoHTML = true;
      }
    });
  }
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.mostrarIconUser = true;
      // hacer decode del toquen
      // hacer peticion al servidor para obtener los datos del usuario
      const token_id_usuario = jwt.decodeToken(localStorage.getItem('token')!);

      this.user.getFotoPerfil(token_id_usuario['id']).subscribe((data:any)=>{
        if(data.status == 200){
          this.check_foto = true;
          this.imagen_perfil = data.data;
        }else{
          this.check_foto = false;
        }
        (erro:any)=>{
          this.check_foto = false;
          console.log(erro);
        }
      })
    }else{
      this.mostrarIconUser = false;
    }
    
    
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
