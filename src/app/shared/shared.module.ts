import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { FooterComponentComponent } from './components/footer-component/footer-component.component';



@NgModule({
  declarations: [
    Error404PageComponent,
    FooterComponentComponent,
  ],
  imports: [
    CommonModule,

  ],
  exports: [
    FooterComponentComponent,
    
  ]
})
export class SharedModule { }
