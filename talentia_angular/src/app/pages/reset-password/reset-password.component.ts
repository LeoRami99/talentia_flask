import { Component, Input } from '@angular/core';
import { ResetPasswordService } from '../../services/reset-password/reset-password.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  @Input() correo: string = '';

  constructor(
    private resetPasswordService: ResetPasswordService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  resetPassword() {
    if (this.correo == '') {
      this.toastr.error('Ingrese un correo', 'Correo vacío');
      return;
    } else {
      this.resetPasswordService.resetPassword(this.correo).subscribe({
        next: (data: any) => {
          if (data.status == '200') {
            // guardar correo en localstorage
            localStorage.setItem('correo', this.correo);
            this.toastr.success(
              'Se envio un correo con un código para restablecer su contraseña',
              'Correo enviado'
            );
            this.router.navigate(['/verify-code']);
          } else {
            this.toastr.error(
              'El correo ingresado no existe',
              'Correo no encontrado'
            );
          }
        },
        error: (error: any) => {
          console.log(error);
          this.toastr.error(
            'El correo ingresado no existe',
            'Correo no encontrado'
          );
        },
      });
    }
  }
}
