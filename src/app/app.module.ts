import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

import { SharedModule } from './shared';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,

    ROUTES
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
