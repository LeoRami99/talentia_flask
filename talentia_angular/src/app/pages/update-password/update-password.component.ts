import { Component, Input, OnInit } from '@angular/core';
import { ResetPasswordService } from '../../services/reset-password/reset-password.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {
  constructor(private resetPassword: ResetPasswordService, private toastr: ToastrService) {}
  @Input() password: string = '';
  ngOnInit(): void {
    // trear correo y estado del localstorage
    let correo = localStorage.getItem('correo');
    let estado = localStorage.getItem('estado');
    if (correo == null || estado == null) {
      // si no hay correo o estado en el localstorage, redirigir a reset-password
      // de igual manera borrar el localstorage
      localStorage.removeItem('correo');
      localStorage.removeItem('estado');
      window.location.href = '/reset-password';
    }
  }
  updatePassword() {
    if(this.password == '' || this.password == ' ') {
      this.toastr.error('Ingrese una contraseña', 'Contraseña vacía');
    }else{
      // verificar el email y el estado del localstorage
      let correo = localStorage.getItem('correo');
      let estado = localStorage.getItem('estado');
      if(estado == 'ok' && correo != null){
        if (this.password.length < 8) {
          this.toastr.error('La contraseña debe tener al menos 8 caracteres', 'Contraseña muy corta');
          return;
        }else{
          this.resetPassword.updatePassword(correo, this.password).subscribe({
            next: (data: any) => {
              if(data.status == '200'){
                this.toastr.success('Contraseña actualizada', 'Contraseña actualizada');
                localStorage.removeItem('correo');
                localStorage.removeItem('estado');
                localStorage.removeItem('token');
                window.location.href = '/login';
            }else{
              this.toastr.error('No se pudo actualizar la contraseña', 'Error');
            }
          }
        });
      }
      }else{
        this.toastr.error('No se pudo actualizar la contraseña', 'Error');
      }

    }
  }
}
