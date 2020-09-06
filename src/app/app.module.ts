import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { QuicksortComponent } from "./quicksort/quicksort.component";
import { LineComponent } from "./line/line.component";
import { TetrisComponent } from "./tetris/tetris.component";
import { HomeComponent } from "./home/home.component";
import { InfoComponent } from "./info/info.component";
import { AboutComponent } from "./about/about.component";

@NgModule({
  declarations: [
    AppComponent,
    QuicksortComponent,
    LineComponent,
    TetrisComponent,
    HomeComponent,
    InfoComponent,
    AboutComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
