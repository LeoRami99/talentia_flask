import { Component } from '@angular/core';
import { Input } from '@angular/core';

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
  url_images : string = 'http://localhost:5000/curso-imagenes/curso/';
  @Input() imagen_card: string = '';
  @Input() dificultad: string = '';
}
