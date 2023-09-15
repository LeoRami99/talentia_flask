import { Component, OnInit } from '@angular/core';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ver-postulantes',
  templateUrl: './ver-postulantes.component.html',
  styleUrls: ['./ver-postulantes.component.css']
})
export class VerPostulantesComponent {
    constructor(private oferta: OfertaEmpresaService, private activeRoute: ActivatedRoute, private router: Router ) { }
    pustalantes: any;
    loading = false;
    ngOnInit(): void {
      const id = this.activeRoute.snapshot.paramMap.get('id');
      console.log(id);
      this.oferta.usuariosAplicantesOfertas(id).subscribe((data:any)=>{
        if (data.status == 200) {
          this.loading = true;
          this.pustalantes = data.aplicantes;
        }else{
          this.loading = false;
        }
      })
    }
    verPerfil(id: any){
      this.router.navigate(['/ver-perfil', id]);
    }
}
