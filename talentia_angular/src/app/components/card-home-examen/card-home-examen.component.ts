import { Component, Input} from '@angular/core';
import { API_URL } from 'src/app/api.constants';
import { ExamenesService } from 'src/app/services/examenes/examenes.service';


@Component({
  selector: 'app-card-home-examen',
  templateUrl: './card-home-examen.component.html',
  styleUrls: ['./card-home-examen.component.css']
})
export class CardHomeExamenComponent {

  constructor(private examenService: ExamenesService){}

  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() imagen: string = '';
  url_images : string = API_URL+'imagenes/';
  @Input() tiempo: string = '';
  @Input() id_examen: string = '';
  @Input() aprobado: string = '';
  @Input() id_usuario: string = '';
  // id Examen
  descargarCertificado(){
    this.examenService.getCertificado(this.id_usuario,this.id_examen).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
  }



}
