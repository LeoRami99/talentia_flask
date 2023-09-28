import { Component, Inject, AfterViewInit } from '@angular/core';
import AOS from 'aos';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{

  ngAfterViewInit(): void {
    AOS.init();
  }
}
