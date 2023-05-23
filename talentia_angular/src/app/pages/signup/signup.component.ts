import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';




@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private apiService:ApiService) { }
  signup(){
    // extraer de los name del html
    const userData = {
      nombre: (<HTMLInputElement>document.getElementById('name')).value,
      apellidos: (<HTMLInputElement>document.getElementById('lastname')).value,
      correo: (<HTMLInputElement>document.getElementById('email')).value,
      password: (<HTMLInputElement>document.getElementById('password')).value
    }
    this.apiService.signup(userData).subscribe((response:any) => {
      // si el estatus es 200
      if( response.status === 200 ){
        alert(response.message);
        // redireccionar a login
        window.location.href = '/login';


      }else if(response.status === 400){
        alert(response.message);
      }
      // capturar el status del response
    });

  }

}
