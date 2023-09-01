import { Component, Input} from '@angular/core';
import { API_URL } from 'src/app/api.constants';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';

@Component({
  selector: 'app-certificado-card',
  templateUrl: './certificado-card.component.html',
  styleUrls: ['./certificado-card.component.css']
})
export class CertificadoCardComponent {
  constructor(private examenService: ExamenesService) { }
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() imagen: string = '';
  url_images : string = API_URL+'imagenes/';
  @Input() id_usuario: string = '';
  @Input() id_examen: string = '';
  descargarCertificado(){
    console.log(this.id_usuario, this.id_examen);
    this.examenService.getCertificado(this.id_usuario,this.id_examen).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
  }
}
