import { Component, Input } from '@angular/core';
import { ResetPasswordService } from '../../services/reset-password/reset-password.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent {
  @Input() codigo: string = '';
  constructor(private toastr: ToastrService, private resetPasswordService: ResetPasswordService, private router: Router) { }
  verificarCodigo() {
    // obtener el correo de localstorage
    let correo = localStorage.getItem('correo');
    if (this.codigo == '' || correo==null) {
      this.toastr.error('Ingrese un código', 'Código vacío');
      this.toastr.error('Correo no encontrado', 'Correo no encontrado');
      this.toastr.error('Pruebe a enviar un correo nuevamente', 'Correo no encontrado');
      this.router.navigate(['/reset-password']);
      return;
    } else {
      this.resetPasswordService.verifyCode(this.codigo, correo).subscribe({
        next: (data: any) => {

          if (data.status == '200') {
            // guardar correo en localstorage
            localStorage.setItem('estado', 'ok');
            this.toastr.success(
              'Código correcto',
              'Código correcto'
            );
            this.router.navigate(['/update-password']);
          } else {
            this.toastr.error(
              'El código ingresado no es correcto',
              'Código incorrecto'
            );
          }
        },
        error: (error: any) => {
          console.log(error);
          this.toastr.error(
            'El código ingresado no es correcto',
            'Código incorrecto'
          );
        },
      });
    }
  }
}
