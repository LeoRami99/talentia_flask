import { Component} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {

  formulario = new FormGroup({
    nombre: new FormControl(''),
    apellidos: new FormControl(''),
    correo: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private apiService: ApiService, private toast: ToastrService) {}

  signup(): void{
    const userData = {
      nombre: this.formulario.value.nombre,
      apellidos: this.formulario.value.apellidos,
      correo: this.formulario.value.correo,
      password: this.formulario.value.password,
    };
    if (
      userData.nombre === '' ||
      userData.apellidos === '' ||
      userData.correo === '' ||
      userData.password === ''
    ) {
      this.toast.error('Por favor llena todos los campos', 'Talentia', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
      return;
    } else {
      this.apiService.signup(userData).pipe(
        catchError((error) => {
          this.toast.error(error.error.message, 'Talentia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
          return EMPTY;
        }
      )
      ).subscribe((response: any) => {
        // si el estatus es 200
        if (response.status === 200) {
          this.toast.success(response.message, 'Talentia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
          // limipiar los campos
          (<HTMLInputElement>document.getElementById('name')).value = '';
          (<HTMLInputElement>document.getElementById('lastname')).value = '';
          (<HTMLInputElement>document.getElementById('email')).value = '';
          (<HTMLInputElement>document.getElementById('password')).value = '';
        } else if (response.status === 400) {
          this.toast.error(response.message, 'Talentia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
        }
      }, (error:any) => {
          this.toast.error(error.error.message, 'Talentia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          });
        }
      );
    }
  }
}
