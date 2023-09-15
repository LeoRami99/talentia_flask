import { Component, Input, OnInit} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ToastrService } from 'ngx-toastr';
const jwt = new JwtHelperService();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  constructor(private user: UserDataService, private toast: ToastrService) { }
  regex_username = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
  valida_username = false;
  id_usuario = "";
  no_exist_profile = false;
  data_usuario: any;
  @Input() username: string = '';
  @Input() sobre_ti: string = '';
  @Input() link_cv: string = '';
  @Input() num_telefono: string = '';
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token != null){
      const tokenPayload:any = jwt.decodeToken(token);
      this.id_usuario = tokenPayload['id'];
      this.user.profileExist(this.id_usuario).subscribe((data:any)=>{
        if(data.status == 200 && data.data==true){
          this.no_exist_profile = true;
          this.user.getProfile(this.id_usuario).subscribe((data:any)=>{
            if(data.status == 200){
              this.data_usuario=data.data[0];
            }
          })
        }else{
          this.no_exist_profile = false;
        }
      })
    }
  }
  validateUsername(){
    if(this.regex_username.test(this.username)){
      this.valida_username = true;
    }else{
      this.valida_username = false;
    }
  }
  saveProfile(){
    const data = {
      id_usuario : this.id_usuario,
      nombre_usuario: this.username,
      sobre_mi: this.sobre_ti,
      url_cv: this.link_cv,
      num_telefono: this.num_telefono
    }
    this.user.createProfile(data).subscribe((data:any)=>{
      if(data.status == 200){
        this.toast.success('Perfil creado correctamente', '¡Éxito!');
        window.location.href = '/inicio';
      }else{
        this.toast.error('Ocurrió un error al crear el perfil', '¡Error!');
      }
    })
  }
  updateProfile(){
    const data = {
      id: this.id_usuario,
      nombre: this.data_usuario.nombre,
      apellido: this.data_usuario.apellidos,
      correo: this.data_usuario.correo,
      nombre_usuario: this.data_usuario.nombre_usuario,
      sobre_mi: this.data_usuario.sobre_mi,
      url_cv: this.data_usuario.url_cv,
      num_telefono: this.data_usuario.num_telefono
    }
    this.user.updateProfile(data).subscribe((data:any)=>{
      if (data.status == 200) {
        this.toast.success('Perfil actualizado correctamente', '¡Éxito!');
        window.location.href = '/profile';
      } else {
        this.toast.error('Ocurrió un error al actualizar el perfil', '¡Error!');
      }
    })
  }


}
