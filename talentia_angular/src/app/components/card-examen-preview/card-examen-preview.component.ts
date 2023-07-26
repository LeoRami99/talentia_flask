import { Component, Input } from '@angular/core';
import { API_URL } from 'src/app/api.constants';

@Component({
  selector: 'app-card-examen-preview',
  templateUrl: './card-examen-preview.component.html',
  styleUrls: ['./card-examen-preview.component.css']
})
export class CardExamenPreviewComponent {
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() imagen: string = '';
  url_images : string = API_URL+'imagenes/';
  @Input() tiempo: string = '';

}
