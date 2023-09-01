import { Component, OnInit} from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{
  constructor(private dataUser : UserDataService) { }
  // rol del usuario
  helper = new JwtHelperService();
  ngOnInit(): void {
    // obtener el token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.helper.decodeToken(token);
      if (decodedToken['rol'] == "ADMIN") {
        // redirigir al dashboard de administrador
        window.location.href = '/dashboard-admin';
      }else if(decodedToken['rol'] == "USER"){
        window.location.href = '/dashboard-home';
      }else if(decodedToken['rol'] == "EMPRESA"){
        window.location.href = '/dashboard-empresa';
      }else{
        window.location.href = '/';
      }
    }else{
      window.location.href = '/';
    }
  }

}
