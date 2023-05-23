import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarStateSource = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarStateSource.asObservable();

  toggleSidebar(): void {
    this.sidebarStateSource.next(!this.sidebarStateSource.getValue());
  }
}
