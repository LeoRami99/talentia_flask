import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { API_URL } from 'src/app/api.constants';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.css']
})
export class CardPreviewComponent {

  constructor() { }
  // titulo de la tarjeta
  @Input() id: number = 0;
  @Input() title: string = '';
  // descripcion de la tarjeta
  url_images : string = API_URL+'imagenes/';
  @Input() imagen_card: string = '';
  @Input() dificultad: string = '';
}
