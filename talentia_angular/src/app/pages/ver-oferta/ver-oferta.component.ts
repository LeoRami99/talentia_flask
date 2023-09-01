import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
const jwt = new JwtHelperService();

@Component({
  selector: 'app-ver-oferta',
  templateUrl: './ver-oferta.component.html',
  styleUrls: ['./ver-oferta.component.css']
})
export class VerOfertaComponent {
  constructor(private activateRute: ActivatedRoute, public oferta: OfertaEmpresaService, private toast: ToastrService){}
  id_oferta: string ="";
  ofertaData: any;
  loading = true;
  id_usuario = ""
  ngOnInit(): void {
    const tokenPayload = jwt.decodeToken(localStorage.getItem('token')!);
    this.id_usuario = tokenPayload["id"];

    this.activateRute.params.subscribe(params => {
      this.id_oferta = params['id'];
        this.oferta.allOfertas().subscribe(
          (data:any)=>{
            if(data == null){
              this.loading = true;
            }else{
              this.loading = false;
              this.ofertaData = data.ofertas.find((oferta:any)=>{
                if(oferta.id == this.id_oferta){
                  return oferta;
                }
              });
            }
            console.log(this.ofertaData);
          }
        );
      }
    );
  }
  aplicarOferta(){
    const data = {
      id_usuario: jwt.decodeToken(localStorage.getItem('token')!).id,
      id_oferta: this.id_oferta
    }
    this.oferta.aplicarOferta(data).subscribe({
      next: (data:any) => {
        if(data.status == 200){
          this.toast.success(data.message);
        }else{
          this.toast.error(data.message);
        }

      },
      error: (error:any) => {
        this.toast.error(error.error.message);
      }
    })
  }

}
