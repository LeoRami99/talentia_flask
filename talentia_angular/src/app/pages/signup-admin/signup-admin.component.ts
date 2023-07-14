import { Component } from '@angular/core';
import { ApiService } from '../../services/api_service/api.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError, tap } from 'rxjs';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-admin',
  templateUrl: './signup-admin.component.html',
  styleUrls: ['./signup-admin.component.css'],
})
export class SignupAdminComponent implements OnInit{
  // Constructor
  constructor(
    private apiService: ApiService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    public router: Router
  ) {}
  ngOnInit(): void {
    if (this.apiService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Inicialización del formulario con los campos requeridos
  formulario: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  // metodo para el envio de datos a la api
  signup(): void {
    const userData = {
      nombre: this.formulario.value.nombre,
      apellidos: this.formulario.value.apellidos,
      correo: this.formulario.value.correo,
      password: this.formulario.value.password,
      rol : 'ADMIN'
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
      this.apiService
        .signup(userData)
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
            if (response.status === 200) {
              this.toast.success(response.message, 'Talentia', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              });
              this.formulario.reset();
            } else if (response.status === 400) {
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
