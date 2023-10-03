import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ApiService} from 'src/app/services/api_service/api.service'
const helper = new JwtHelperService();

@Component({
  selector: 'app-back-verify',
  templateUrl: './back-verify.component.html',
  styleUrls: ['./back-verify.component.css']
})
export class BackVerifyComponent implements OnInit{
  constructor(private dataUser: UserDataService) {}
  state_of_account = false;
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decodedToken = helper.decodeToken(token ? token : '');
    // hacer l verificación del estado de cuenta desde el localstorage
    if (localStorage.getItem('state_of_account') == 'true') {
      this.state_of_account = true;
    }else{
      this.dataUser.dataUsuario(decodedToken['id']).subscribe((data:any)=>{
        if (data) {
          this.dataUser.verificarEstadoCuenta(data.data.correo).subscribe((data:any)=>{
            if (data) {
              if (data.data == 1) {
                this.state_of_account = true;
                // guarda el estado de la cuenta en el localstorage
                localStorage.setItem('state_of_account', 'true');
              }else{
                this.state_of_account = false;
              }
            }else{
              this.state_of_account = false;
            }
          })
        }
      })
    }
  }
}
