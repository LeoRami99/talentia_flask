import { Component, Input, OnInit} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { UploadImgsService } from 'src/app/services/upload_images/upload-imgs.service';
const jwt = new JwtHelperService();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  constructor(private user: UserDataService, private toast: ToastrService, private uploadImgs: UploadImgsService) { }
  regex_username = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
  valida_username = false;
  id_usuario = "";
  no_exist_profile = false;
  data_usuario: any;
  foto_perfil!: File;;
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
  onImagenPerfilSelected(event: any): void {
    const foto_perfil: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result as string;
        img.onload = () => {
          const width = img.width;
          const height = img.height
          if (width != 100 || height != 100) {
            this.toast.error('La imagen para foto de perfil debe ser de  100x100 Pixeles');
            return;
          }else{
            this.foto_perfil = foto_perfil;
          }
        }
    };
    reader.readAsDataURL(foto_perfil);
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

  actualizarFotoPerfil(){
    const formData = new FormData();
    formData.append('foto_perfil', this.foto_perfil);
    if (this.foto_perfil == undefined) {
      this.toast.error('Seleccione una foto de perfil', '¡Error!');
      return;
    }else{
      this.uploadImgs.uploadImagenPerfil(formData).subscribe((data:any)=>{
        if (data.status == 200) {
          this.user.actualizarFotoPerfil({id_usuario: this.id_usuario, foto_perfil: data.foto_perfil}).subscribe((data:any)=>{
            if (data.status == 200) {
              this.toast.success('Foto de perfil actualizada correctamente', '¡Éxito!');
              window.location.href = '/profile';
            } else {
              this.toast.error('Ocurrió un error al actualizar la foto de perfil', '¡Error!');
            }
          });
        } else {
          this.toast.error('Ocurrió un error al actualizar la foto de perfil', '¡Error!');
        }
      })
    }
  }


}
