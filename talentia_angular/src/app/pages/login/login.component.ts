import { Component } from '@angular/core';
import { ApiService } from '../../services/api_service/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  constructor(
    private apiService: ApiService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    public router: Router
  ) {}
  // traer los datos del formulario
  formulario: FormGroup = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  circles: any[] = [];
  ngOnInit(): void {
    

    if (this.apiService.isLoggedIn()) {
      // dependiendo de rol redirigir a la vista
      this.router.navigate(['/inicio']);
    }
  }
  // metodo para el envio de datos a la api y guardar el token
  login(): void {
    const userData = {
      correo: this.formulario.value.correo,
      password: this.formulario.value.password,
    };
    if (userData.correo === '' || userData.password === '') {
      this.toast.error('Por favor llena todos los campos', 'Talentia', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
      });
      return;
    } else {
      this.apiService
        .login(userData)
        .pipe(
          catchError((error) => {
            this.toast.error(error.error.message, 'Talentia', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            });
            return EMPTY;
          }),
          tap((response: any) => {
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
              window.location.href = '/inicio';
            } else if (response.status === 401) {
              this.toast.error(response.message, 'Talentia', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              });
            }
          })
        )
        .subscribe();
    }
  }
}
