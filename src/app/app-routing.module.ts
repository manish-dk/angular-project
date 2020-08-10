import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TetrisComponent } from "./tetris/tetris.component";
import { QuicksortComponent } from "./quicksort/quicksort.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: "tetris", component: TetrisComponent },
  { path: "visualiser", component: QuicksortComponent },
  { path: "", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
