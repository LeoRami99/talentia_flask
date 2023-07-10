import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.css']
})
export class CardEditComponent {
  // titulo de la tarjeta
  @Input() id: number = 0;
  @Input() title: string = '';
  // descripcion de la tarjeta
  url_images : string = 'http://localhost:3000/imagenes/';
  @Input() imagen_card: string = '';
  @Input() dificultad: string = '';

}
