import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent {
    constructor(private userData : UserDataService, private activeRouter: ActivatedRoute) { }
    usuario: any;
    loading = false;

    ngOnInit(): void {
      const id = this.activeRouter.snapshot.paramMap.get('id');
      this.userData.getProfile(id).subscribe((data:any)=>{
        if (data.status == 200) {
          this.loading = true;
          this.usuario = data.data;
        }else{
          this.loading = false;
        }

      })
    }
}
