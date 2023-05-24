import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor( private apiService: ApiService, private toast:ToastrService ) { }
  // traer los datos del html
  login(): void{
    const userData = {
      correo: (<HTMLInputElement>document.getElementById('email')).value,
      password: (<HTMLInputElement>document.getElementById('password')).value,
    };
    if (userData.correo === '' || userData.password === '') {
      this.toast.error('Por favor llena todos los campos', 'Talentia', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
      return;
    } else {
      this.apiService.login(userData).subscribe((response: any) => {
        // si el estatus es 200
        if (response.status === 200) {
          this.toast.success(response.message, 'Talentia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
          // limipiar los campos
          // guardar el token en el localstorage
          localStorage.setItem('token', response.access_token);
        } else if (response.status === 401) {
          this.toast.error(response.message, 'Talentia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
        }
      });
    }
  }
}
