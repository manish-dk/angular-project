import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {
  @Input() value:number;

  @Input() isMinimum:boolean;
  @Input() isActive:boolean;
  @Input() isSecondary:boolean;
  constructor() { 
    
  }

  ngOnInit(): void {
    
  }

}
