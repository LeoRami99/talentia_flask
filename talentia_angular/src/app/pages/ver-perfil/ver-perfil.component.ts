import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from 'src/app/api.constants';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent {
    constructor(private userData : UserDataService, private activeRouter: ActivatedRoute) { }
    usuario: any;
    loading = false;
    url_image=API_URL;
    skills_usuario : any;

    ngOnInit(): void {
      const id = this.activeRouter.snapshot.paramMap.get('id');
      this.userData.getProfile(id).subscribe((data:any)=>{
        if (data.status == 200) {
          this.loading = true;
          // console.log(data.data);
          this.usuario = data.data;
          this.skills_usuario = JSON.parse(data.data[0].skills);
        }else{
          this.loading = false;
        }

      })
    }
}
