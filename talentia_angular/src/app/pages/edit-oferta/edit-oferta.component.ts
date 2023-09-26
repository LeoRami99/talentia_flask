import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OfertaEmpresaService } from 'src/app/services/oferta-empresa/oferta-empresa.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-oferta',
  templateUrl: './edit-oferta.component.html',
  styleUrls: ['./edit-oferta.component.css'],
})
export class EditOfertaComponent implements OnInit {
  ofertaData: any;
  loading = true;
  constructor(
    private routeActive: ActivatedRoute,
    private ofertaSr: OfertaEmpresaService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.routeActive.params.subscribe((params) => {
      this.ofertaSr.allOfertas().subscribe({
        next: (data: any) => {
          if (data == null) {
            this.loading = true;
          } else {
            this.loading = false;
            data.ofertas.find((oferta: any) => {
              if (oferta.id == params['id']) {
                this.ofertaData = oferta;
                // parsear para frontend
                this.ofertaData.fecha_cierre =  new Date(this.ofertaData.fecha_cierre).toISOString().slice(0,10);
                // console.log(this.ofertaData);
              } else {
                // this.router.navigate(['/inicio']);
              }
            });
          }
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }
  actualiarOferta() {
    this.ofertaSr.actualizarOferta(this.ofertaData).subscribe({
      next: (data: any) => {
        if (data.status == 200) {
          this.toastr.success(data.message);
          window.location.reload();
        }else{
          this.toastr.error("Error al actualizar la oferta");
        }
        // this.router.navigate(['/inicio']);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  activarOferta() {
    const dataOferta = {
      id: this.ofertaData.id,
      estado: 1,
    }
    this.ofertaSr.actualizarEstadoOferta(dataOferta).subscribe({
      next: (data: any) => {
        if (data.status == 200) {
          this.toastr.success(data.message);
          window.location.reload();
        } else {
          this.toastr.error("Error al activar la oferta");
        }
      },
      error: (error: any) => {
        this.toastr.error("Error al activar la oferta");
      },
    });
  }
  desactivarOferta() {
    const dataOferta = {
      id: this.ofertaData.id,
      estado: 0,
    }
    this.ofertaSr.actualizarEstadoOferta(dataOferta).subscribe({
      next: (data: any) => {
        if (data.status == 200) {
          this.toastr.success(data.message);
          window.location.reload();
        }else{
          this.toastr.error("Error al desactivar la oferta");
        }
        // this.router.navigate(['/inicio']);
      },
      error: (error: any) => {
        this.toastr.error("Error al desactivar la oferta");
        console.log(error);
      },
    });
  }
}
