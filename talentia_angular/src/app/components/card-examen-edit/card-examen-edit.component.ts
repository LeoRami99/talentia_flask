import { Component, Input} from '@angular/core';
import { API_URL } from 'src/app/api.constants';

@Component({
  selector: 'app-card-examen-edit',
  templateUrl: './card-examen-edit.component.html',
  styleUrls: ['./card-examen-edit.component.css']
})
export class CardExamenEditComponent {
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() imagen: string = '';
  url_images : string = API_URL+'imagenes/';
  @Input() tiempo: string = '';
  @Input() id: string = '';

}
