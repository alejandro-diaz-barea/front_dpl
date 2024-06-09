import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  [x: string]: any;


  constructor(private route:Router) {}


  goToExplore(){
    this.route.navigate(['/explore']);
  }


}
