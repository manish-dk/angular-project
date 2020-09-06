import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.css"],
})
export class InfoComponent implements OnInit {
  @Input() iconClass: string;
  @Input() text: string;
  @Input() title: string;
  constructor() {}

  ngOnInit(): void {}
}
