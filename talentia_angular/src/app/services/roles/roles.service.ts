import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Inject } from '@angular/core';


const jwt= new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    // private jwt: JwtHelperService
  ) { }
  // retornar roles de usuario del token JWT
  getRoles(){
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decodeToken(token!);
    return decodedToken .rol ? decodedToken.rol : null;
  }

}
