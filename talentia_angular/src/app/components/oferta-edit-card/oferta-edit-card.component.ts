import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-oferta-edit-card',
  templateUrl: './oferta-edit-card.component.html',
  styleUrls: ['./oferta-edit-card.component.css'],
})
export class OfertaEditCardComponent {
  @Input() nombre_oferta: string = '';
  @Input() descripcion_oferta: string = '';
  @Input() id_oferta: string = '';
  constructor(private router: Router) {}

  editarOferta() {
    this.router.navigate(['/editar-oferta', this.id_oferta]);
  }
}
