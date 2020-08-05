import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { QuicksortComponent } from './quicksort/quicksort.component';
import { LineComponent } from './line/line.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VisualiserComponent } from './visualiser/visualiser.component';
import { TetrisComponent } from './tetris/tetris.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    QuicksortComponent,
    LineComponent,
    VisualiserComponent,
    TetrisComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
