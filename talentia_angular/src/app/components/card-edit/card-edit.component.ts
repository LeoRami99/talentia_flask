import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.css']
})
export class CardEditComponent {
  @Input() title: string = '';
  @Input() imageSource: string = ''; //La imagen debe tener un tamaño de 430x168
  @Input() id: string = ''; //el id es para generar la url del link

}
