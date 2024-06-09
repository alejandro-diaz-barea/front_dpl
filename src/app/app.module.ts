import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { DragDirective } from './drag.directive';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CdkDrag} from '@angular/cdk/drag-drop'
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    DragDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CdkDrag,
    HttpClientModule

  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
