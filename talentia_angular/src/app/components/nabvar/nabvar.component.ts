import { Component } from '@angular/core';
// location from '@angular/common';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {Observable, map} from 'rxjs';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.css']
})
export class NabvarComponent {
  // se va a ocultar el contenido de html
  mostrarContenidoHTML: boolean = false;
  constructor(private route: ActivatedRoute, private location: Location) {
    this.location.onUrlChange((url: string) => {
      this.mostrarContenidoHTML = url !== '/login' && url !== '/signup';
    });
  }
}
