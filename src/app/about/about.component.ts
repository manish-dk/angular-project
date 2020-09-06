import { Component, OnInit } from "@angular/core";
import { InfoComponent } from "../info/info.component";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  cards: InfoComponent[] = [];
  siteSummary: string =
    "I currently work as a QA Engineer and my day to day involves doing a lot of C# and the work I do in fixing and extending the automation framework is much more akin to back-end development so I created this site as a way to teach myself a front-end framework. This site was made using Angular; I chose this framework as it's the framework that's currently used at my company for most of our web apps.";
  algoSummary: string =
    "Due to having studied Maths & Physics instead of Computer Science I hadn't had much exposure to algorithms. I created this algorithm visualiser as a way to learn a bit more about algorithms. I've currently got a visualisation for 3 different ones but there may be more to come in the future.";
  tetrisSummary: string =
    "I started created this Tetris game a little while ago as a way to teach myself some JavaScript. This was initially incomplete and very buggy. When I was building this site I also decided to go back to it and it is now a fully functional tetris game with a couple of additional mechanics.";
  constructor() {}

  ngOnInit(): void {
    let siteInfo = new InfoComponent();
    siteInfo.title = "This Site";
    siteInfo.text = this.siteSummary;
    siteInfo.iconClass = "fas fa-globe";
    let algoInfo = new InfoComponent();
    algoInfo.title = "Algorithm Visualiser";
    algoInfo.text = this.algoSummary;
    algoInfo.iconClass = "fas fa-chart-bar";
    let tetrisInfo = new InfoComponent();
    tetrisInfo.title = "Tetris";
    tetrisInfo.text = this.tetrisSummary;
    tetrisInfo.iconClass = "fas fa-gamepad";

    this.cards.push(siteInfo);
    this.cards.push(algoInfo);
    this.cards.push(tetrisInfo);
  }

  createModal(title: string) {
    console.log(title);
  }
}
