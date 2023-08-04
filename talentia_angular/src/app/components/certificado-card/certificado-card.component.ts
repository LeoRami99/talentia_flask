import { Component, Input} from '@angular/core';
import { API_URL } from 'src/app/api.constants';

@Component({
  selector: 'app-certificado-card',
  templateUrl: './certificado-card.component.html',
  styleUrls: ['./certificado-card.component.css']
})
export class CertificadoCardComponent {
  constructor() { }
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() imagen: string = '';
  url_images : string = API_URL+'imagenes/';
  @Input() id_usuario: string = '';
  @Input() id_examen: string = '';



}
