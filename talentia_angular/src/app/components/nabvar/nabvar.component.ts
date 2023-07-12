import { Component } from '@angular/core';
// location from '@angular/common';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {Observable, map} from 'rxjs';
import { ApiService } from '../../services/api_service/api.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.css']
})
export class NabvarComponent {
  // se va a ocultar el contenido de html
  mostrarContenidoHTML: boolean = false;
  constructor(private route: ActivatedRoute, private location: Location, public auth: ApiService, private router: Router) {
    this.location.onUrlChange((url: string) => {
      this.mostrarContenidoHTML = url !== '/login' && url !== '/signup';
    });
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
