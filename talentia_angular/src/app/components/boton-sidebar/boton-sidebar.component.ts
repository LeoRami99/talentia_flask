import { Component } from '@angular/core';
import { SidebarService } from 'src/app/sidebar-service.service';

@Component({
  selector: 'app-boton-sidebar',
  template: `
  <button class="navbar-toggler w-auto mr-16pt d-block d-lg-none rounded-0" type="button" (click)="toggleSidebar()">
    <span class="material-icons">short_text</span>
  </button> `
})
export class BotonSidebarComponent {
  constructor(private sidebarService: SidebarService) {}

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
