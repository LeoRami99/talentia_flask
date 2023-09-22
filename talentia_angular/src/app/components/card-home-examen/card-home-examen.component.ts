import { Component, Input} from '@angular/core';
import { API_URL } from 'src/app/api.constants';


@Component({
  selector: 'app-card-home-examen',
  templateUrl: './card-home-examen.component.html',
  styleUrls: ['./card-home-examen.component.css']
})
export class CardHomeExamenComponent {
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() imagen: string = '';
  url_images : string = API_URL+'imagenes/';
  @Input() tiempo: string = '';
  @Input() id_examen: string = '';
  @Input() aprobado: string = '';
}
