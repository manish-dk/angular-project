import { Component, OnInit } from '@angular/core';
import { LineComponent } from '../line/line.component';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Algorithm } from '../algorithm'

@Component({
  selector: 'app-quicksort',
  templateUrl: './quicksort.component.html',
  styleUrls: ['./quicksort.component.css']
})
export class QuicksortComponent implements OnInit {
  lines:LineComponent[] = [];
  faCoffee = faChevronRight;
  algorithms: Algorithm[] = [Algorithm.mergeSort, Algorithm.quickSort, Algorithm.selectionSort];
  currentSelection: Algorithm = Algorithm.mergeSort;


  constructor() { }

  ngOnInit(): void {
    this.lines = [];
    for(let i = 0; i < 20; i++) {
      let line = new LineComponent();
      line.value = Math.floor(Math.random() * 100) + 1;
      this.lines.push(line);
    }
  }

  selectAlgo(algo: string) {
    this.algorithms.forEach(element => {
      if(element.valueOf() == algo) {
        this.currentSelection = element;
      }
    });
  }

  sort() {
    switch(this.currentSelection) {
      case Algorithm.mergeSort: {
        this.mergeSort(this.lines);
        break;
      }
      case Algorithm.quickSort: {
        this.quickSort(this.lines);
        break;
      }
      case Algorithm.selectionSort: {
        this.selectionSort(this.lines);
        break;
      }
    }
  }

  async selectionSort(array: LineComponent[]): Promise<void> {
    let minIndex = 0;
    
    for(let i = 0; i < array.length; i++) {
      if(i > 0) {
        array[i-1].isActive = false;
      }
      
      array[i].isActive = true;
      minIndex = await this.findMinIndex(array, i);
      if(i == array.length - 1) {
        array[i].isActive = false;
      }
      
      let temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;
      await this.delay(500);
      temp.isActive = false;
    }
  }

  async findMinIndex(array: LineComponent[], start: number): Promise<number> {
    let minIndex = start;
    array[minIndex].isMinimum = true;
    for(let i = start; i < array.length; i++) {
      array[i].isSecondary = true;
      if(i > 0) {
        array[i-1].isSecondary = false;
      }
      
      await this.delay(250);
      if(i == array.length - 1) {
        array[i].isSecondary = false;
      }
      if(array[i].value < array[minIndex].value) {
        array[minIndex].isMinimum = false;
        array[i].isMinimum = true;
        minIndex = i;
      }
    }
    return minIndex;
  }

  mergeSort(array: LineComponent[]): void {
    console.log('do merge sorty things');
  }

  quickSort(array: LineComponent[]): void {
    console.log('do quick sorty things');
  }
  
  delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
